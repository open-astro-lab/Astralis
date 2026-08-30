import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App.jsx";
import { PassportProvider } from "./context/PassportContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PassportProvider>
      <App />
    </PassportProvider>
  </StrictMode>
);
