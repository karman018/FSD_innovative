const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pathai_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const db = pool.promise();

// Initialize table if not exists
async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS student_profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        stage VARCHAR(20),
        tenth_board VARCHAR(50),
        tenth_percentage FLOAT,
        twelfth_stream VARCHAR(50),
        twelfth_percentage FLOAT,
        current_year VARCHAR(20),
        college_name VARCHAR(150),
        branch VARCHAR(100),
        interests JSON,
        skills JSON,
        career_goal VARCHAR(200),
        predicted_careers JSON,
        skills_gap JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Database connected & table ready");
  } catch (err) {
    console.error("❌ DB init error:", err.message);
  }
}

initDB();

module.exports = db;
