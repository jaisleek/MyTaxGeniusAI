import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import twilio from "twilio";
import dotenv from "dotenv";
import http from "http";
import Groq from "groq-sdk";

dotenv.config();

// In-memory database for prototype
const db = {
  tins: [] as any[],
  filings: [] as any[]
};

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = http.createServer(app);

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Twilio Client Setup
  const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;
    
  // Groq Client Setup setup for Llama 3.3 70B
  const groqClient = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

  // Llama 3.3 70B Chat API proxy
  app.post("/api/chat", async (req, res) => {
    try {
      const { contents, systemInstruction } = req.body;
      
      const messages: any[] = [];
      if (systemInstruction) {
        messages.push({ role: "system", content: systemInstruction });
      }
      
      if (contents && Array.isArray(contents)) {
        for (const msg of contents) {
          messages.push({
            role: msg.role === "model" ? "assistant" : "user",
            content: msg.parts?.[0]?.text || ""
          });
        }
      }

      // If user provided a Groq API key, use it. Otherwise fallback to a simulated response or throw an error.
      if (!groqClient) {
        return res.status(403).json({ error: "Groq API key is missing. Please add GROQ_API_KEY to your settings to use Llama 3.3 70B." });
      }

      const stream = await groqClient.chat.completions.create({
        messages: messages as any,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 2048,
        stream: true,
      });

      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error: any) {
      console.error("Llama 3.3 70B Chat error:", error);
      res.status(500).json({ error: error.message || "Failed to generate response" });
    }
  });

  // Create TIN
  app.post("/api/tin/register", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, businessName, businessType } = req.body;
      
      // Generate a random 10-digit TIN
      const tin = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      
      const newTinRecord = {
        id: Date.now().toString(),
        tin,
        firstName,
        lastName,
        email,
        phone,
        businessName,
        businessType,
        createdAt: new Date().toISOString()
      };
      
      db.tins.push(newTinRecord);

      // Send SMS via Twilio if configured
      if (twilioClient && process.env.TWILIO_PHONE_NUMBER && phone) {
        try {
          await twilioClient.messages.create({
            body: `Welcome to NRS! Your new Tax Identification Number (TIN) is ${tin}. Keep this safe.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
          });
        } catch (smsError) {
          console.error("Failed to send SMS:", smsError);
          // Continue even if SMS fails
        }
      }

      res.json({ success: true, tin: newTinRecord });
    } catch (error) {
      console.error("Error registering TIN:", error);
      res.status(500).json({ error: "Failed to register TIN" });
    }
  });

  // File Tax
  app.post("/api/tax/file", async (req, res) => {
    try {
      const { tin, period, income, expenses, taxDue, email } = req.body;
      
      const filingRecord = {
        id: Date.now().toString(),
        tin,
        period,
        income,
        expenses,
        taxDue,
        status: "Submitted",
        filedAt: new Date().toISOString()
      };
      
      db.filings.push(filingRecord);

      // Simulate sending Email via mock service (e.g., SendGrid/AWS SES replacement)
      if (email) {
        console.log(`[EMAIL SIMULATION] Sending tax filing confirmation to: ${email}`);
        console.log(`[EMAIL SIMULATION] Subject: NRS Tax Filing Received - ${period}`);
        console.log(`[EMAIL SIMULATION] Body: Your tax filing for ${period} has been securely received. Tax Due: NGN ${taxDue}. Confirmation ID: ${filingRecord.id}`);
      }

      res.json({ success: true, filing: filingRecord });
    } catch (error) {
      console.error("Error filing tax:", error);
      res.status(500).json({ error: "Failed to file tax" });
    }
  });

  // TCC Request
  app.post("/api/tcc/request", async (req, res) => {
    try {
      const { tin, requestReason } = req.body;
      
      // Mock logic: Check if TIN exists in filings to determine approval
      const hasFiled = db.filings.some(f => f.tin === tin);
      
      const tccRecord = {
        id: Date.now().toString(),
        tin,
        requestReason,
        status: hasFiled ? "Approved" : "Pending Review",
        validUntil: hasFiled ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() : null,
        requestedAt: new Date().toISOString()
      };
      
      res.json({ success: true, tcc: tccRecord });
    } catch (error) {
      console.error("Error processing TCC:", error);
      res.status(500).json({ error: "Failed to process TCC request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: { server: httpServer }
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
