import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./i18n";
import "./index.css";
import App from "./App.jsx";
import { PassportProvider } from "./context/PassportContext.jsx";
import { SoundProvider } from "./context/SoundContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SoundProvider>
      <PassportProvider>
        <App />
      </PassportProvider>
    </SoundProvider>
  </StrictMode>
);

// Register service worker so the app becomes fully installable as a PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Optional: quiet log for debugging
        // console.log("Service worker registered:", reg.scope);
      })
      .catch((err) => {
        console.warn("Service worker registration failed:", err);
      });
  });
}
