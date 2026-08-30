import { useTranslation } from "react-i18next";
import AuthPrompt from "./AuthPrompt.jsx";

const MODULES = [
  { key: "universe_explorer", labelKey: "modules.universe_explorer", descKey: "universe_explorer.subtitle" },
  { key: "sky_explorer", labelKey: "modules.sky_explorer", descKey: "sky_explorer.subtitle" },
  { key: "asteroid_hunter", labelKey: "modules.asteroid_hunter", descKey: "asteroid_hunter.subtitle" },
  { key: "exoplanet_hunter", labelKey: "modules.exoplanet_hunter", descKey: "exoplanet_hunter.subtitle" },
  { key: "stellar_detective", labelKey: "modules.stellar_detective", descKey: "stellar_detective.subtitle" },
  { key: "physics_lab", labelKey: "modules.physics_lab", descKey: "physics_lab.subtitle" },
];

export default function Home({ setView }) {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <AuthPrompt />
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl md:text-5xl leading-tight text-text">
          {t("home.heading")}
        </h1>
        <p className="text-muted text-lg mt-4">{t("home.subheading")}</p>
        <button
          onClick={() => setView("universe_explorer")}
          className="mt-8 px-6 py-3 rounded-full bg-nebula text-void font-medium hover:bg-nebulaSoft transition shadow-glow"
        >
          {t("home.start_button")}
        </button>
      </div>

      <h2 className="font-display text-sm uppercase tracking-widest text-muted mt-16 mb-4">
        {t("home.modules_heading")}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {MODULES.map((mod, i) => (
          <button
            key={mod.key}
            onClick={() => setView(mod.key)}
            className="text-left rounded-2xl border border-white/10 bg-panel p-6 hover:border-nebula hover:shadow-glow transition"
          >
            <div className="text-starlight text-xs font-mono mb-2">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="font-display text-lg">{t(mod.labelKey)}</div>
            <div className="text-muted text-sm mt-1">{t(mod.descKey)}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
