import { useState, useEffect } from "react";
import LanguagePicker from "./components/LanguagePicker.jsx";
import NavBar from "./components/NavBar.jsx";
import Home from "./components/Home.jsx";
import Passport from "./components/Passport.jsx";
import EscapeVelocity from "./modules/physics-lab/EscapeVelocity.jsx";
import { useTranslation } from "react-i18next";

export default function App() {
  const { t } = useTranslation();
  const [languageChosen, setLanguageChosen] = useState(
    () => !!localStorage.getItem("astralis_lang")
  );
  const [view, setView] = useState("home");

  useEffect(() => {
    document.title = `${t("app.name")} — ${t("app.tagline")}`;
  }, [t, languageChosen]);

  if (!languageChosen) {
    return <LanguagePicker onChosen={() => setLanguageChosen(true)} />;
  }

  return (
    <div className="min-h-screen">
      <NavBar view={view} setView={setView} />
      {view === "home" && <Home setView={setView} />}
      {view === "physics_lab" && (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <h1 className="font-display text-3xl mb-1">{t("physics_lab.title")}</h1>
          <p className="text-muted mb-8">{t("physics_lab.subtitle")}</p>
          <EscapeVelocity />
        </div>
      )}
      {view === "passport" && <Passport />}
    </div>
  );
}
