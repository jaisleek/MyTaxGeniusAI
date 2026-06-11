import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import twilio from "twilio";
import dotenv from "dotenv";
import http from "http";
import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import { Resend } from "resend";

dotenv.config();

// In-memory database for prototype
const db = {
  tins: [] as any[],
  filings: [] as any[]
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const emailTransporter = process.env.SMTP_HOST ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
}) : null;

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

  // Gemini Setup for Search Grounding and specific tasks
  const geminiAI = process.env.GEMINI_API_KEY ? new GoogleGenAI({ 
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
  }) : null;

  app.get("/api/tax-updates", async (req, res) => {
    const fallbackUpdates = [
      "- FIRS Extends Deadline for Corporate Tax Returns Setup by 30 days.",
      "- New VAT Exemption List Published for Basic Educational and Food Items.",
      "- NRS Introduces Digital Portal for Seamless E-Invoicing Tracking.",
      "- Penalty Waivers Available for SMEs Filing Before the Next Quarter."
    ].join("\n");

    try {
      if (!geminiAI) {
        return res.json({ success: true, text: fallbackUpdates, chunks: [] });
      }

      const response = await geminiAI.models.generateContent({
        model: "gemini-3.5-flash",
        contents: "What are the latest news, updates, or recent policy changes from the Nigerian Revenue Service (NRS), FIRS, or Nigerian tax policy broadly? Give me a concise summary of the top 3-4 actual recent updates. Format as a simple list.",
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || fallbackUpdates;
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      res.json({ success: true, text, chunks });
    } catch (error: any) {
      console.warn("Gemini API key invalid or missing. Using mock tax updates.");
      // Return fallback data instead of 500 error if API key is invalid
      res.json({ success: true, text: fallbackUpdates, chunks: [] });
    }
  });

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

const otps = new Map<string, string>();

  app.post("/api/tin/send-otp", async (req, res) => {
    try {
      const { email, phone } = req.body;
      if (!email || !phone) return res.status(400).json({ error: "Email and phone are required" });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const token = Date.now().toString();
      
      otps.set(token, otp);
      setTimeout(() => otps.delete(token), 10 * 60 * 1000); // Expires in 10 mins

      let messagesSent = { email: false, sms: false };

      // Send SMS via Twilio if configured
      if (twilioClient && process.env.TWILIO_PHONE_NUMBER && phone) {
        try {
          const formattedPhone = phone.startsWith('0') ? '+234' + phone.substring(1) : phone;
          await twilioClient.messages.create({
            body: `MyTaxGenius: Your verification code is ${otp}. Do not share this with anyone.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone.includes('+') ? formattedPhone : `+${formattedPhone}`
          });
          messagesSent.sms = true;
        } catch (smsError) {
          console.error("Failed to send OTP SMS:", smsError);
        }
      } else {
        console.log(`[MOCK OTP SMS] To: ${phone} - Code: ${otp}`);
        messagesSent.sms = true;
      }

      // Send Email via Resend or Nodemailer
      if (resend && email) {
        try {
          await resend.emails.send({
            from: "MyTaxGenius <onboarding@resend.dev>",
            to: email as string,
            subject: "Your Registration Verification Code",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Verify your registration</h2>
                <p>Your 6-digit confirmation code is:</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                  <p style="margin: 0; font-size: 32px; font-weight: bold; color: #047857; letter-spacing: 5px;">${otp}</p>
                </div>
                <p>This code expires in 10 minutes.</p>
              </div>
            `
          });
          messagesSent.email = true;
        } catch (err: any) {
          console.error("Failed to send OTP Email via Resend:", err.message);
        }
      } else if (emailTransporter && email) {
        try {
          await emailTransporter.sendMail({
            from: `"MyTaxGenius" <${process.env.SMTP_USER || 'noreply@mytaxgenius.com'}>`,
            to: email,
            subject: "Your Registration Verification Code",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Verify your registration</h2>
                <p>Your 6-digit confirmation code is:</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                  <p style="margin: 0; font-size: 32px; font-weight: bold; color: #047857; letter-spacing: 5px;">${otp}</p>
                </div>
                <p>This code expires in 10 minutes.</p>
              </div>
            `
          });
          messagesSent.email = true;
        } catch (err: any) {
          console.error("Failed to send OTP Email:", err.message);
        }
      } else {
        console.log(`[MOCK OTP EMAIL] To: ${email} - Subject: Your Registration Verification Code - Code: ${otp}`);
        messagesSent.email = true;
      }

      res.json({ success: true, token, messagesSent });
    } catch (error) {
      console.error("Error sending OTP:", error);
      res.status(500).json({ error: "Failed to send OTP" });
    }
  });

  // Create TIN
  app.post("/api/tin/register", async (req, res) => {
    try {
      const { firstName, lastName, email, phone, businessName, businessType, otp, token } = req.body;
      
      if (!otp || !token) {
         return res.status(400).json({ error: "OTP verification required." });
      }

      if (otps.get(token) !== otp) {
         return res.status(400).json({ error: "Invalid or expired verification code." });
      }
      
      // OTP verified, remove it
      otps.delete(token);
      
      // Generate an authentic looking NRS TIN (e.g., 100XXXXXXX-0001 or 2456XXXXXX)
      const baseTin = '2456' + Math.floor(100000 + Math.random() * 900000).toString();
      const branchCode = '0001';
      const tin = `${baseTin}-${branchCode}`;
      
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

      let messagesSent = { email: false, sms: false };

      // Send SMS via Twilio if configured
      if (twilioClient && process.env.TWILIO_PHONE_NUMBER && phone) {
        try {
          const formattedPhone = phone.startsWith('0') ? '+234' + phone.substring(1) : phone;
          await twilioClient.messages.create({
            body: `MyTaxGenius: Your official NRS Tax Identification Number (TIN) is ${tin}. Keep this safe for all tax filings.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: formattedPhone.includes('+') ? formattedPhone : `+${formattedPhone}`
          });
          messagesSent.sms = true;
        } catch (smsError) {
          console.error("Failed to send SMS:", smsError);
          // Continue even if SMS fails
        }
      } else {
        console.log(`[MOCK SMS] To: ${phone} - Body: MyTaxGenius: Your official NRS Tax Identification Number (TIN) is ${tin}.`);
        messagesSent.sms = true; // Set to true for mock response to UI
      }

      // Send Email via Resend or Nodemailer
      if (resend && email) {
        try {
          await resend.emails.send({
            from: "MyTaxGenius <onboarding@resend.dev>",
            to: email as string,
            subject: "Your Official Tax Identification Number (TIN)",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Registration Successful</h2>
                <p>Dear ${firstName} ${lastName},</p>
                <p>Your business <strong>${businessName}</strong> has been successfully registered.</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px; text-transform: uppercase;">Your Tax ID (TIN)</p>
                  <p style="margin: 5px 0 0; font-size: 32px; font-weight: bold; color: #047857; letter-spacing: 2px;">${tin}</p>
                </div>
                <p>Please keep this safe for all future tax filings with the Nigeria Revenue Service.</p>
                <p>Best regards,<br>MyTaxGenius Team</p>
              </div>
            `
          });
          messagesSent.email = true;
        } catch (err: any) {
          console.error("Failed to send Email via Resend:", err.message);
        }
      } else if (emailTransporter && email) {
        try {
          await emailTransporter.sendMail({
            from: `"MyTaxGenius NRS Reg" <${process.env.SMTP_USER || 'noreply@mytaxgenius.com'}>`,
            to: email,
            subject: "Your Official Tax Identification Number (TIN)",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Registration Successful</h2>
                <p>Dear ${firstName} ${lastName},</p>
                <p>Your business <strong>${businessName}</strong> has been successfully registered.</p>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                  <p style="margin: 0; color: #6b7280; font-size: 14px; text-transform: uppercase;">Your Tax ID (TIN)</p>
                  <p style="margin: 5px 0 0; font-size: 32px; font-weight: bold; color: #047857; letter-spacing: 2px;">${tin}</p>
                </div>
                <p>Please keep this safe for all future tax filings with the Nigeria Revenue Service.</p>
                <p>Best regards,<br>MyTaxGenius Team</p>
              </div>
            `
          });
          messagesSent.email = true;
        } catch (err: any) {
          console.error("Failed to send Email:", err.message);
        }
      } else {
        console.log(`[MOCK EMAIL] To: ${email} - Subject: Your Official Tax Identification Number (TIN) - TIN: ${tin}`);
        messagesSent.email = true; // Set to true for mock response to UI
      }

      res.json({ success: true, tin: newTinRecord, messagesSent });
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

  // Meta's Official WhatsApp Cloud API Webhook (Verification)
  app.get("/api/meta-whatsapp/webhook", (req, res) => {
    const verify_token = process.env.META_VERIFY_TOKEN || "taxbuddy_secure_token_123";

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.status(400).send("Invalid request");
    }
  });

  // Meta's Official WhatsApp Cloud API Webhook (Message Receiving)
  app.post("/api/meta-whatsapp/webhook", express.json(), async (req, res) => {
    try {
      let body = req.body;

      if (body.object) {
        if (
          body.entry &&
          body.entry[0].changes &&
          body.entry[0].changes[0] &&
          body.entry[0].changes[0].value.messages &&
          body.entry[0].changes[0].value.messages[0]
        ) {
          let phone_number_id = body.entry[0].changes[0].value.metadata.phone_number_id;
          let from = body.entry[0].changes[0].value.messages[0].from; 
          let msg_body = body.entry[0].changes[0].value.messages[0].text?.body; 

          if (!msg_body || !groqClient) {
             res.sendStatus(200);
             return;
          }

          const systemInstruction = `You are MyTaxGenius AI, an independent, AI-powered "Audit Defense" & Tax Advisor, and an expert in Nigerian tax law.
IMPORTANT DISCLAIMER: You are independent but highly knowledgeable.
CRITICAL RULES:
1. NO INTRODUCTIONS: Never say "Hello, I am MyTaxGenius AI..." unless they explicitly are just saying Hi. If they are just saying Hi, welcome them to MyTaxGenius AI. Otherwise, just answer the question directly. Dive straight into the solution.
2. Format your responses beautifully and structurally like an expert. Use short sentences.
3. Keep it brief and well-formatted for WhatsApp.
4. Provide actionable advice for Nigerian SMEs regarding VAT, CIT, PIT, etc.`;

          const messages = [
            { role: "system", content: systemInstruction },
            { role: "user", content: msg_body }
          ];

          const chatCompletion = await groqClient.chat.completions.create({
            messages: messages as any,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 1024,
          });

          const reply = chatCompletion.choices[0]?.message?.content || "Sorry, I could not process your request at this time.";

          const token = process.env.META_WHATSAPP_TOKEN;
          if (token) {
            await fetch(`https://graph.facebook.com/v17.0/${phone_number_id}/messages`, {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                messaging_product: "whatsapp",
                to: from,
                text: { body: reply }
              })
            });
          } else {
             console.log("No META_WHATSAPP_TOKEN found in env.");
          }
        }
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    } catch (error) {
      console.error("Meta WhatsApp Webhook Error:", error);
      res.sendStatus(500);
    }
  });

  // Add urlencoded middleware for Twilio Webhooks
  app.use(express.urlencoded({ extended: true }));

  // Twilio WhatsApp Webhook
  app.post("/api/whatsapp/webhook", async (req, res) => {
    try {
      const incomingMessage = req.body.Body;
      const senderNumber = req.body.From; // e.g., "whatsapp:+2348000000000"
      const twilioFrom = req.body.To || "whatsapp:+14155238886";

      // Immediate acknowledgment to Twilio
      res.set("Content-Type", "text/xml");
      res.send("<Response></Response>");

      if (!incomingMessage || !senderNumber || !twilioClient || !groqClient) {
        console.warn("Missing twilioClient, groqClient, or message content");
        return;
      }

      const systemInstruction = `You are MyTaxGenius AI, an independent, AI-powered "Audit Defense" & Tax Advisor, and an expert in Nigerian tax law designed to help SMEs and individuals.
IMPORTANT DISCLAIMER: You are independent but highly knowledgeable.

CRITICAL FORMATTING & BEHAVIOR RULES:
1. NO INTRODUCTIONS: Never say "Hello, I am MyTaxGenius AI..." just answer the question directly. Dive straight into the solution.
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
