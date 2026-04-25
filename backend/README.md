PersonaLearn PHP Backend

Overview
- Lightweight PHP API for PersonaLearn frontend.
- Persists data in local JSON files inside backend/storage.
- Integrates free APIs:
  - Wikipedia Summary API
  - Open Library Search API

Requirements
- PHP 8.0+

Production Hosting
- Recommended: Render Web Service (Docker) with persistent disk mounted at `/app/storage`.

Run the API
1. Open terminal in repository root.
2. Start local PHP server:
   php -S localhost:8000 -t backend/public

Deploy on Render
1. Create a new Render Web Service from this repo.
2. Set Root Directory to `backend`.
3. Use Docker runtime (see `backend/Dockerfile`).
4. Add a persistent disk mounted to `/app/storage`.
5. Set env vars:
  - `API_ALLOWED_ORIGIN=https://your-app.vercel.app`
  - `USE_GEMINI` / `GEMINI_API_KEY` if needed.
6. Verify `GET /api/health` returns JSON.

Environment
- Copy backend/.env.example to backend/.env if you want custom config.
- Supported settings:
  - API_ALLOWED_ORIGIN (default: http://localhost:5173)
  - USE_GEMINI (default: false)
  - GEMINI_API_KEY (required when USE_GEMINI=true)
  - GEMINI_MODEL (default: gemini-1.5-flash)
  - GEMINI_TIMEOUT_SECONDS (default: 12, min 3, max 30)

Endpoints
1. GET /api/health
- Health check.

2. POST /api/learners/register
- Body:
  {
    "name": "Atia",
    "email": "user@example.com",
    "password": "secret123",
    "profile": {
      "subject": "programming"
    }
  }

3. POST /api/auth/login
- Body:
  {
    "email": "user@example.com",
    "password": "secret123"
  }

4. POST /api/plans/generate
- Body:
  {
    "learnerId": "usr_xxx",
    "profile": {
      "subject": "programming",
      "goal": "exam",
      "weeklyHours": 5,
      "sessionLength": 30,
      "studyDays": ["Monday", "Wednesday", "Friday"],
      "hobbies": ["gaming"],
      "studyTime": "afternoon",
      "pace": "balanced"
    }
  }

5. GET /api/resources/search?topic=Computer%20programming
- Returns Wikipedia summary + top Open Library books.

6. GET /api/learners/{id}
- Returns learner profile by id.

Storage Files
- backend/storage/users.json
- backend/storage/plans.json

Frontend Integration Hint
- Set frontend API base URL to http://localhost:8000.
- Example fetch call:
  fetch('http://localhost:8000/api/health').then(r => r.json())

Notes
- Current auth is simple and suitable for local/dev use.
- For production, add JWT, DB (MySQL/PostgreSQL), rate limiting, and secure secret management.
