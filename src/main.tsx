
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

// Wake up Render free tier backend on app load
fetch(import.meta.env.VITE_API_BASE_URL + '/api/health').catch(() => {});

  