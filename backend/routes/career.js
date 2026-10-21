const express = require("express");
const router  = express.Router();
const axios   = require("axios");
const { predictCareers } = require("../predictor");
const db = require("../config/db");

const ML_API_URL = process.env.ML_API_URL || null;

// POST /api/predict-career
router.post("/predict-career", async (req, res) => {
  try {
    const profile = req.body;

    // Basic input validation
    if (!profile || typeof profile !== 'object') {
      return res.status(400).json({ error: "Invalid request body." });
    }
    if (!profile.stage) {
      return res.status(400).json({ error: "Stage is required." });
    }
    if (!Array.isArray(profile.interests) || profile.interests.length === 0) {
      return res.status(400).json({ error: "At least one interest is required." });
    }

    // Convert empty strings to null for numeric fields
    if (profile.tenth_percentage === "") profile.tenth_percentage = null;
    if (profile.twelfth_percentage === "") profile.twelfth_percentage = null;

    // ── Use ML model if available, else fallback to rule-based ───────────────
    let result;
    if (ML_API_URL) {
      try {
        const mlRes = await axios.post(`${ML_API_URL}/predict`, profile, { timeout: 8000 });
        result = mlRes.data;
        console.log("✅ Prediction from ML model");
      } catch (mlErr) {
        console.warn("⚠️ ML API failed, using rule-based fallback:", mlErr.message);
        result = predictCareers(profile);
      }
    } else {
      result = predictCareers(profile);
      console.log("ℹ️ Prediction from rule-based engine (ML_API_URL not set)");
    }

    // Save to MySQL
    await db.query(
      `INSERT INTO student_profiles 
        (name, stage, tenth_board, tenth_percentage, twelfth_stream, twelfth_percentage,
         current_year, college_name, branch, interests, skills, career_goal, predicted_careers, skills_gap)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        profile.name || null,
        profile.stage || null,
        profile.tenth_board || null,
        profile.tenth_percentage || null,
        profile.twelfth_stream || null,
        profile.twelfth_percentage || null,
        profile.current_year || null,
        profile.college_name || null,
        profile.branch || null,
        JSON.stringify(profile.interests || []),
        JSON.stringify(profile.skills || []),
        profile.career_goal || null,
        JSON.stringify(result.careers),
        JSON.stringify(result.skills_gap),
      ]
    );

    res.json(result);
  } catch (err) {
    console.error("predict-career error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
