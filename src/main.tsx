
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

// Wake up Render free tier backend on app load
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (API_BASE_URL) {
  fetch(API_BASE_URL + '/api/health').catch(() => {});
}

createRoot(document.getElementById("root")!).render(<App />);

  