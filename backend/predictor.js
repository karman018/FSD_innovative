/**
 * Career Prediction Logic
 * Rule-based scoring + keyword matching
 * JavaScript port of ml-model/predictor.py
 */

const CAREER_PROFILES = [
  {
    title: "Software Engineer",
    description: "Build and maintain software applications. High demand, great salaries.",
    interest_match: ["Technology", "Engineering"],
    skill_match: ["Programming", "Problem Solving", "Mathematics"],
    stream_match: ["Science (PCM)"],
    required_skills: ["DSA", "Python/Java/C++", "System Design", "Git"],
    branches: ["computer science", "it", "software", "information technology"],
  },
  {
    title: "Data Scientist / ML Engineer",
    description: "Analyze data and build AI/ML models. One of the fastest growing fields.",
    interest_match: ["Technology", "Finance", "Business"],
    skill_match: ["Programming", "Mathematics", "Data Analysis", "Problem Solving"],
    stream_match: ["Science (PCM)"],
    required_skills: ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
    branches: ["computer science", "data science", "mathematics", "statistics"],
  },
  {
    title: "Product Manager",
    description: "Lead product development by bridging tech and business.",
    interest_match: ["Business", "Technology", "Marketing"],
    skill_match: ["Leadership", "Communication", "Problem Solving", "Creative Thinking"],
    stream_match: ["Science (PCM)", "Commerce"],
    required_skills: ["Product Strategy", "User Research", "Agile", "Data Analysis", "Communication"],
    branches: ["computer science", "mba", "business", "management"],
  },
  {
    title: "Business Analyst",
    description: "Analyze business processes and recommend data-driven improvements.",
    interest_match: ["Business", "Finance", "Technology"],
    skill_match: ["Data Analysis", "Communication", "Problem Solving", "Research"],
    stream_match: ["Commerce", "Science (PCM)"],
    required_skills: ["SQL", "Excel", "Data Visualization", "Business Communication", "Process Mapping"],
    branches: ["commerce", "business", "management", "computer science"],
  },
  {
    title: "Digital Marketing Specialist",
    description: "Plan and execute digital campaigns, SEO, social media and growth strategies.",
    interest_match: ["Marketing", "Business", "Arts & Media"],
    skill_match: ["Communication", "Creative Thinking", "Research", "Leadership"],
    stream_match: ["Commerce", "Arts / Humanities"],
    required_skills: ["SEO", "Google Analytics", "Social Media Marketing", "Content Writing", "Paid Ads"],
    branches: ["commerce", "marketing", "business", "mass communication"],
  },
  {
    title: "UI/UX Designer",
    description: "Design intuitive and beautiful digital products. High demand in tech companies.",
    interest_match: ["Design", "Technology", "Arts & Media"],
    skill_match: ["Creative Thinking", "Problem Solving", "Communication"],
    stream_match: ["Science (PCM)", "Arts / Humanities"],
    required_skills: ["Figma", "User Research", "Prototyping", "Design Thinking", "HTML/CSS basics"],
    branches: ["design", "computer science", "architecture", "fine arts"],
  },
  {
    title: "Finance Analyst / Investment Banking",
    description: "Analyze financial data, valuations, and market trends for companies.",
    interest_match: ["Finance", "Business"],
    skill_match: ["Mathematics", "Data Analysis", "Research", "Problem Solving"],
    stream_match: ["Commerce"],
    required_skills: ["Financial Modeling", "Excel", "Valuation", "Accounting", "Bloomberg"],
    branches: ["finance", "commerce", "economics", "accounting"],
  },
  {
    title: "Cybersecurity Engineer",
    description: "Protect systems and networks from digital attacks. Booming field with high salaries.",
    interest_match: ["Technology"],
    skill_match: ["Programming", "Problem Solving", "Research"],
    stream_match: ["Science (PCM)"],
    required_skills: ["Networking", "Linux", "Python", "Ethical Hacking", "Security Protocols"],
    branches: ["computer science", "it", "information security", "electronics"],
  },
];

function calculateMatchScore(profile, career) {
  let score = 0;

  // Interest match — +10 per match
  const userInterests = (profile.interests || []).map((i) => i.toLowerCase());
  for (const interest of career.interest_match) {
    if (userInterests.includes(interest.toLowerCase())) score += 10;
  }

  // Skill match — +10 per match
  const userSkills = (profile.skills || []).map((s) => s.toLowerCase());
  for (const skill of career.skill_match) {
    if (userSkills.includes(skill.toLowerCase())) score += 10;
  }

  // Stream match — +20
  if (career.stream_match.includes(profile.twelfth_stream)) score += 20;

  // Branch match — +10
  const userBranch = (profile.branch || "").toLowerCase();
  for (const keyword of career.branches) {
    if (userBranch.includes(keyword)) { score += 10; break; }
  }

  // Academic bonus
  try {
    const tenth = parseFloat(profile.tenth_percentage) || 0;
    const twelfth = parseFloat(profile.twelfth_percentage) || 0;
    const avg = twelfth > 0 ? (tenth + twelfth) / 2 : tenth;
    if (avg >= 85) score += 10;
    else if (avg >= 70) score += 5;
  } catch (_) {}

  // Career goal bonus — +15
  const goal = (profile.career_goal || "").toLowerCase();
  if (goal) {
    const words = goal.split(" ");
    if (words.some((word) => career.title.toLowerCase().includes(word))) score += 15;
  }

  return Math.min(Math.round(score), 99);
}

function predictCareers(profile) {
  const scoredCareers = CAREER_PROFILES.map((career) => ({
    title: career.title,
    description: career.description,
    match: calculateMatchScore(profile, career),
    required_skills: career.required_skills,
  }));

  scoredCareers.sort((a, b) => b.match - a.match);
  const topCareers = scoredCareers.slice(0, 4);

  // Skills gap — based on the actual top recommended careers, not the first 3 definitions
  const userSkillsLower = (profile.skills || []).map((s) => s.toLowerCase());
  const topCareerSkills = new Set();
  topCareers.forEach((tc) => {
    const careerDef = CAREER_PROFILES.find((c) => c.title === tc.title);
    if (careerDef) careerDef.required_skills.forEach((s) => topCareerSkills.add(s));
  });

  const skillsGap = [...topCareerSkills]
    .filter((skill) => !userSkillsLower.some((us) => skill.toLowerCase().includes(us)))
    .slice(0, 6);

  return {
    careers: topCareers,
    skills_gap: skillsGap,
    message: `Based on your background and interests, here are the top career paths for you, ${profile.name || "there"}!`,
  };
}

module.exports = { predictCareers };
