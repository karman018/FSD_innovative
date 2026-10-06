const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

const SYSTEM_PROMPT = `You are PathAI Assistant, a helpful and friendly career guidance chatbot for students in India.
You help students understand career options, required skills, study roadmaps, colleges, entrance exams, and job market trends.
Keep responses concise (3-5 sentences max unless a detailed list is needed), friendly, and actionable.
Focus on Indian education system and job market context.`;

// POST /api/chat
router.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.json({ reply: "Please ask me something!" });
  }

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      max_tokens: 512,
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("chat error:", err.message);
    res.json({ reply: `Sorry, I'm having trouble responding right now. Error: ${err.message}` });
  }
});

module.exports = router;
