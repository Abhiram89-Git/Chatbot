import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

// 🌿 Environment setup
console.log("🔑 Groq key loaded:", !!process.env.GROQ_API_KEY);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 💬 Chat endpoint
app.post("/ask", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // ✅ updated active model
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();
    console.log("🧠 Groq API response:", JSON.stringify(data, null, 2));

    if (data.choices?.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({
        error: data.error?.message || "⚠️ No response from Groq model",
      });
    }
  } catch (error) {
    console.error("🚨 Server error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🚀 Launch backend
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
