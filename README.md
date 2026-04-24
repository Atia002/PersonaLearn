
  # personaLearn-Web app

  This is a code bundle for personaLearn-Web app. The original project is available at https://www.figma.com/design/bwIQwujlx8r97qhkNp5KS9/personaLearn-Web-app.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Backend API (PHP)

  A PHP backend is available in the `backend` folder.

  Run backend locally:

  `php -S localhost:8000 -t backend/public`

  See `backend/README.md` for endpoint docs and request payloads.

## Deploying to Vercel or Netlify

The frontend is ready for Vercel or Netlify as a static SPA. The PHP API must be hosted separately on a PHP-capable server, then pointed to from the frontend with `VITE_API_BASE_URL`.

Frontend deployment settings:
- Build command: `pnpm build`
- Publish directory: `dist`
- SPA fallback: handled by [`vercel.json`](vercel.json) or [`netlify.toml`](netlify.toml)

Environment variables:
- `VITE_API_BASE_URL` should point to your deployed backend, for example `https://api.yourdomain.com`
- Set `API_ALLOWED_ORIGIN` in the backend to your deployed frontend URL, for example `https://your-app.vercel.app` or `https://your-app.netlify.app`

Local development:
- Frontend: `VITE_API_BASE_URL=http://localhost:8000`
- Backend: `php -S localhost:8000 -t backend/public`
  