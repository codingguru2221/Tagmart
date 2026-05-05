import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const originalFetch = window.fetch;
window.fetch = async (input, init) => {
  const token = localStorage.getItem("tagmart_token");
  if (token) {
    init = init ?? {};
    init.headers = { ...(init.headers as Record<string, string>), Authorization: `Bearer ${token}` };
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById("root")!).render(<App />);
