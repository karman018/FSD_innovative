const express = require("express");
const router = express.Router();

const CAREER_MAP = {
  logical: "Software Engineering, Data Science, or Research — you have strong analytical thinking",
  numerical: "Finance, Data Analytics, or Quantitative roles — your numerical strength is a big asset",
  verbal: "Management, Law, Content Strategy, or HR — your communication skills shine",
  interest_tech: "Technology & Software Development fits your interests perfectly",
  interest_business: "Business Strategy, Consulting, or Marketing aligns with your interests",
  interest_creative: "UI/UX Design, Creative Media, or Architecture matches your creative side",
  interest_people: "Education, Healthcare, HR, or Social Work suits your people-oriented nature",
};

// POST /api/aptitude-result
router.post("/aptitude-result", (req, res) => {
  try {
    const { answers, questions } = req.body;

    const scores = { logical: 0, numerical: 0, verbal: 0 };
    const interestVotes = { tech: 0, business: 0, creative: 0, people: 0 };
    const categoryCounts = { logical: 0, numerical: 0, verbal: 0 };

    const interestMap = { 0: "tech", 1: "business", 2: "creative", 3: "people" };

    for (const q of questions) {
      const qid = String(q.id);
      const category = q.category;
      const correct = q.answer;
      const userAnswer = answers[qid];

      if (["logical", "numerical", "verbal"].includes(category)) {
        categoryCounts[category]++;
        if (userAnswer === correct) scores[category]++;
      } else if (category === "interest" && userAnswer !== undefined && userAnswer !== null) {
        const bucket = interestMap[userAnswer] || "tech";
        interestVotes[bucket]++;
      }
    }

    // Convert to percentages
    const scorePct = {};
    for (const [cat, count] of Object.entries(categoryCounts)) {
      scorePct[cat] = count > 0 ? Math.round((scores[cat] / count) * 100) : 0;
    }

    // Dominant aptitude & interest
    const dominantApt = Object.keys(scorePct).reduce((a, b) => scorePct[a] > scorePct[b] ? a : b);
    const dominantInterest = Object.keys(interestVotes).reduce((a, b) => interestVotes[a] > interestVotes[b] ? a : b);
    const interestKey = `interest_${dominantInterest}`;

    const recommendation = `${CAREER_MAP[dominantApt] || ""}. Also, ${CAREER_MAP[interestKey] || ""}.`;

    res.json({
      scores: scorePct,
      dominant_aptitude: dominantApt,
      dominant_interest: dominantInterest,
      recommendation,
    });
  } catch (err) {
    console.error("aptitude-result error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
