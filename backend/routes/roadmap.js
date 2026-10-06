const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");

// POST /api/roadmap
router.post("/roadmap", async (req, res) => {
  const { career, formData } = req.body;
  const branch = formData?.branch || "";
  const year = formData?.current_year || "";

  const prompt = `Create a detailed career roadmap for a student who wants to become a ${career}.
Student context: ${year} student, studying ${branch}.

Return ONLY valid JSON (no markdown, no extra text) in this exact format:
{
    "overview": "A brief 1-2 sentence overview of this career path",
    "phases": [
        {
            "title": "Phase title",
            "duration": "e.g. Months 1-3",
            "tasks": ["Task 1", "Task 2", "Task 3", "Task 4"]
        }
    ],
    "resources": [
        {
            "name": "Resource name",
            "url": "https://example.com",
            "type": "Course / Book / Platform / Website"
        }
    ]
}

Include 4 phases and 5-6 resources. Focus on Indian job market and free/affordable resources.`;

  try {
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        { role: "system", content: "You are a career guidance expert. Return only valid JSON, no markdown." },
        { role: "user", content: prompt },
      ],
      max_tokens: 1024,
    });

    let text = response.choices[0].message.content.trim();

    // Strip markdown code fences if present (opening and closing)
    text = text.replace(/```(?:json)?/g, '').trim();

    const data = JSON.parse(text);
    res.json(data);
  } catch (err) {
    console.error("roadmap error:", err.message);
    // Fallback roadmap
    res.json({
      overview: `A comprehensive roadmap to becoming a ${career}.`,
      phases: [
        {
          title: "Foundation Building",
          duration: "Months 1-3",
          tasks: [
            "Learn core concepts and fundamentals",
            "Complete beginner online courses",
            "Start practicing with small projects",
            "Join relevant communities and forums",
          ],
        },
        {
          title: "Skill Development",
          duration: "Months 4-6",
          tasks: [
            "Build 2-3 portfolio projects",
            "Contribute to open source or group projects",
            "Get certifications in relevant tools",
            "Network on LinkedIn with professionals",
          ],
        },
        {
          title: "Practical Experience",
          duration: "Months 7-9",
          tasks: [
            "Apply for internships",
            "Freelance or work on real problems",
            "Attend workshops and webinars",
            "Build a strong LinkedIn profile",
          ],
        },
        {
          title: "Job Readiness",
          duration: "Months 10-12",
          tasks: [
            "Prepare resume and portfolio",
            "Practice mock interviews",
            "Apply to companies",
            "Prepare for technical and HR rounds",
          ],
        },
      ],
      resources: [
        { name: "Coursera", url: "https://coursera.org", type: "Platform" },
        { name: "YouTube Free Tutorials", url: "https://youtube.com", type: "Platform" },
        { name: "LinkedIn Learning", url: "https://linkedin.com/learning", type: "Platform" },
      ],
    });
  }
});

module.exports = router;
