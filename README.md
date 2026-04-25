
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

  ## Presentation-Ready Deployment (Recommended)

  Frontend: Vercel
  Backend: Render (Docker)

  1. Deploy backend from `backend` on Render.
  2. Set backend env var `API_ALLOWED_ORIGIN` to your Vercel URL.
  3. Deploy frontend on Vercel.
  4. Set Vercel frontend env var:

    `VITE_API_BASE_URL=https://your-render-service.onrender.com`

  5. Redeploy frontend after setting env vars.

  The frontend currently uses direct backend URL configuration via `VITE_API_BASE_URL` and no longer depends on an InfinityFree rewrite.

  See [backend/README.md](backend/README.md) for backend endpoints and Render deployment notes.
  