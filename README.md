# PathAI — FSD Innovative Assignment

AI-powered career guidance platform for Indian students.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| Database | MySQL |
| AI/LLM | Groq SDK + GPT-OSS 20B |
| HTTP Client | Axios |

## Project Structure

```
fsd-innovative/
├── frontend/        ← React SPA
└── backend/
    ├── server.js        ← Express entry point
    ├── predictor.js     ← Career prediction logic
    ├── db_setup.sql     ← MySQL schema
    ├── config/
    │   └── db.js        ← MySQL connection
    └── routes/
        ├── career.js    ← POST /api/predict-career
        ├── aptitude.js  ← POST /api/aptitude-result
        ├── chat.js      ← POST /api/chat
        └── roadmap.js   ← POST /api/roadmap
```

## Setup Instructions

### 1. MySQL Setup
```sql
-- Run db_setup.sql in MySQL Workbench
CREATE DATABASE pathai_db;
```

### 2. Backend Setup
```bash
cd backend
npm install
# Edit .env with your GROQ_API_KEY and MySQL credentials
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Backend runs on: http://localhost:8000
Frontend runs on: http://localhost:5173
