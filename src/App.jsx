import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguagePicker from "./components/LanguagePicker.jsx";
import NavBar from "./components/NavBar.jsx";
import GuestBanner from "./components/GuestBanner.jsx";
import Home from "./components/Home.jsx";
import Passport from "./components/Passport.jsx";
import PhysicsLab from "./modules/physics-lab/PhysicsLab.jsx";
import UniverseExplorer from "./modules/universe-explorer/UniverseExplorer.jsx";
import SkyExplorer from "./modules/sky-explorer/SkyExplorer.jsx";
import ExoplanetHunter from "./modules/exoplanet-hunter/ExoplanetHunter.jsx";
import AsteroidHunter from "./modules/asteroid-hunter/AsteroidHunter.jsx";
import StellarDetective from "./modules/stellar-detective/StellarDetective.jsx";

const MODULE_VIEWS = {
  physics_lab: { titleKey: "physics_lab.title", subtitleKey: "physics_lab.subtitle", Component: PhysicsLab },
  universe_explorer: { titleKey: "universe_explorer.title", subtitleKey: "universe_explorer.subtitle", Component: UniverseExplorer },
  sky_explorer: { titleKey: "sky_explorer.title", subtitleKey: "sky_explorer.subtitle", Component: SkyExplorer },
  exoplanet_hunter: { titleKey: "exoplanet_hunter.title", subtitleKey: "exoplanet_hunter.subtitle", Component: ExoplanetHunter },
  asteroid_hunter: { titleKey: "asteroid_hunter.title", subtitleKey: "asteroid_hunter.subtitle", Component: AsteroidHunter },
  stellar_detective: { titleKey: "stellar_detective.title", subtitleKey: "stellar_detective.subtitle", Component: StellarDetective },
};

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

  const moduleView = MODULE_VIEWS[view];

  return (
    <div className="min-h-screen">
      <NavBar view={view} setView={setView} />
      <GuestBanner />
      {view === "home" && <Home setView={setView} />}
      {moduleView && (
        <div className="max-w-5xl mx-auto px-6 py-12">
          <button
            onClick={() => setView("home")}
            className="text-muted text-sm hover:text-text transition mb-4"
          >
            ← {t("nav.home")}
          </button>
          <h1 className="font-display text-3xl mb-1">{t(moduleView.titleKey)}</h1>
          <p className="text-muted mb-8">{t(moduleView.subtitleKey)}</p>
          <moduleView.Component />
        </div>
      )}
      {view === "passport" && <Passport />}
    </div>
  );
}
