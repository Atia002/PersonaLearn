
  # PersonaLearn Web App

  PersonaLearn is a Vite + React frontend with a lightweight PHP backend in `backend`.

  ## Local Run

  1. Install frontend dependencies:

    `pnpm install`

  2. Start frontend:

    `pnpm dev`

  3. Start backend:

    `php -S localhost:8000 -t backend/public`

  4. Use local frontend env:

    `VITE_API_BASE_URL=http://localhost:8000`

## Final Demo: Vercel Frontend + Local PHP Backend

For the final presentation, run the backend locally on your PC while the frontend stays deployed on Vercel.

### Terminal 1 — Start Local Backend

```bash
cd backend
php -S localhost:8000 -t public
```

### Test Backend Health

```
http://localhost:8000/api/health
```

### Vercel Environment Variable

Set in your Vercel project settings:

```
VITE_API_BASE_URL=http://localhost:8000
```

Then **redeploy** your Vercel frontend to pick up the new environment variable.

### Demo URL

```
https://your-vercel-app.vercel.app
```

### Test Flow

1. **Signup** → Create a new account
2. **Onboarding** → Set hobbies, subjects, goals
3. **Diagnostic** → Complete the diagnostic quiz
4. **Plan** → Generate personalized learning plan
5. **Dashboard** → View your plan
6. **Lesson Tutor** → Ask questions to the AI tutor
7. **Materials** → Save and review study materials

### Troubleshooting

- If CORS errors appear, ensure `API_ALLOWED_ORIGIN=*` in `backend/.env`
- If tutor fails, check `USE_GEMINI=true` and valid `GEMINI_API_KEY` in `backend/.env`
- All backend routes return JSON — no HTML errors  