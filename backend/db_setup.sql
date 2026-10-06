-- Run this in MySQL Workbench or terminal to setup the database

CREATE DATABASE IF NOT EXISTS pathai_db;
USE pathai_db;

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
);

-- View all saved profiles
-- SELECT * FROM student_profiles;
