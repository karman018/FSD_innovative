# PathAI — Deployment Guide

## Architecture
- **Backend** → Render (Node.js / Express)
- **Frontend** → Vercel (React / Vite)
- **Database** → Any MySQL host (PlanetScale, Railway, or Render MySQL)

---

## Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/YOUR_USERNAME/pathai.git
git push -u origin main
```

> ⚠️ Make sure `.env` files are NOT committed. They are already in `.gitignore`.

---

## Step 2 — Deploy Backend on Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub repo, select the **`backend`** folder as the root directory
3. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`
4. Add these **Environment Variables** in the Render dashboard:

| Key | Value |
|---|---|
| `GROQ_API_KEY` | Your Groq API key |
| `ALLOWED_ORIGIN` | Your Vercel frontend URL (set after step 3) |
| `DB_HOST` | Your MySQL host |
| `DB_USER` | Your MySQL username |
| `DB_PASSWORD` | Your MySQL password |
| `DB_NAME` | `pathai_db` |
| `PORT` | `8000` |

5. Click **Deploy**. Note down the URL, e.g. `https://pathai-backend.onrender.com`

---

## Step 3 — Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo, set **Root Directory** to `frontend`
3. Vercel auto-detects Vite — leave build settings as default
4. Add this **Environment Variable**:

| Key | Value |
|---|---|
| `VITE_API_URL` | Your Render backend URL, e.g. `https://pathai-backend.onrender.com` |

5. Click **Deploy**. Note down your Vercel URL, e.g. `https://pathai.vercel.app`

---

## Step 4 — Update CORS on Render

Go back to your Render service → **Environment** → update:

```
ALLOWED_ORIGIN = https://pathai.vercel.app
```

Then **redeploy** the backend (Render does this automatically on env var changes).

---

## Step 5 — Set up the Database

Run the SQL setup file on your MySQL host:

```bash
mysql -h YOUR_HOST -u YOUR_USER -p pathai_db < backend/db_setup.sql
```

Or paste the contents of `backend/db_setup.sql` into your MySQL host's query editor.

---

## Local Development

```bash
# Backend
cd backend
npm install
npm run dev        # runs on http://localhost:8000

# Frontend (separate terminal)
cd frontend
npm install
npm run dev        # runs on http://localhost:5173
```

Local `.env` files are already configured — no changes needed for dev.
