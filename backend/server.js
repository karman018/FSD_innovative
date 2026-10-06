require("dotenv").config();
const express = require("express");
const cors = require("cors");

const careerRoutes = require("./routes/career");
const aptitudeRoutes = require("./routes/aptitude");
const chatRoutes = require("./routes/chat");
const roadmapRoutes = require("./routes/roadmap");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map(o => o.trim())
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Render health checks, same-origin)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());

// Routes
app.use("/api", careerRoutes);
app.use("/api", aptitudeRoutes);
app.use("/api", chatRoutes);
app.use("/api", roadmapRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "PathAI Backend is running! (Node.js + Express)" });
});

// Global error handler — catches any unhandled errors thrown in route handlers
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack || err.message);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
