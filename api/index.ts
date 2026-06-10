import express from "express";
import twilio from "twilio";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// Add urlencoded middleware for Twilio Webhooks
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// In-memory database for prototype

const db = {
  tins: [] as any[],
  filings: [] as any[]
};

// Twilio Client Setup
const twilioClient = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
  ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  : null;
  
// Groq Client Setup
const groqClient = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

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

app.post("/api/tin/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, businessName, businessType } = req.body;
    const tin = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const newTinRecord = {
      id: Date.now().toString(),
      tin, firstName, lastName, email, phone, businessName, businessType,
      createdAt: new Date().toISOString()
    };
    db.tins.push(newTinRecord);
    res.json({ success: true, tin: newTinRecord });
  } catch (error) {
    res.status(500).json({ error: "Failed to register TIN" });
  }
});

app.post("/api/tax/file", async (req, res) => {
  try {
    const { tin, period, income, expenses, taxDue, email } = req.body;
    const filingRecord = {
      id: Date.now().toString(),
      tin, period, income, expenses, taxDue,
      status: "Submitted",
      filedAt: new Date().toISOString()
    };
    db.filings.push(filingRecord);
    res.json({ success: true, filing: filingRecord });
  } catch (error) {
    res.status(500).json({ error: "Failed to file tax" });
  }
});

app.post("/api/tcc/request", async (req, res) => {
  try {
    const { tin, requestReason } = req.body;
    const hasFiled = db.filings.some(f => f.tin === tin);
    const tccRecord = {
      id: Date.now().toString(),
      tin, requestReason,
      status: hasFiled ? "Approved" : "Pending Review",
      validUntil: hasFiled ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString() : null,
      requestedAt: new Date().toISOString()
    };
    res.json({ success: true, tcc: tccRecord });
  } catch (error) {
    res.status(500).json({ error: "Failed to process TCC request" });
  }
});

// Twilio WhatsApp Webhook Endpoint Structure
app.post("/api/whatsapp/webhook", async (req, res) => {
  try {
    const incomingMessage = req.body.Body;
    const senderNumber = req.body.From; // e.g., "whatsapp:+2348000000000"
    const isSandbox = senderNumber?.includes("sandbox") || req.body.To?.includes("14155238886");
    const twilioFrom = req.body.To || "whatsapp:+14155238886";

    // Immediate acknowledgment to Twilio
    res.set("Content-Type", "text/xml");
    res.send("<Response></Response>");

    if (!incomingMessage || !senderNumber || !twilioClient || !groqClient) {
      console.warn("Missing twilioClient, groqClient, or message content");
      return;
    }

    const systemInstruction = `You are TaxBuddy AI, an independent, AI-powered "Audit Defense" & Tax Advisor, and an expert in Nigerian tax law designed to help SMEs and individuals.
IMPORTANT DISCLAIMER: You are independent but highly knowledgeable.

CRITICAL FORMATTING & BEHAVIOR RULES:
1. NO INTRODUCTIONS: Never say "Hello, I am TaxBuddy AI..." just answer the question directly. Dive straight into the solution.
2. Format your responses beautifully and structurally like an expert professional AI. Use short, punchy sentences.
3. Keep it brief and well-formatted for WhatsApp.
4. Provide actionable advice for Nigerian SMEs regarding VAT, CIT, PIT, etc.`;

    const messages = [
      { role: "system", content: systemInstruction },
      { role: "user", content: incomingMessage }
    ];

    const chatCompletion = await groqClient.chat.completions.create({
      messages: messages as any,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const reply = chatCompletion.choices[0]?.message?.content || "Sorry, I could not process your request at this time.";

    await twilioClient.messages.create({
      body: reply,
      from: twilioFrom,
      to: senderNumber
    });

  } catch (error) {
    console.error("WhatsApp Webhook Error:", error);
    if (!res.headersSent) {
        res.status(500).send("Error processing message");
    }
  }
});

export default app;
