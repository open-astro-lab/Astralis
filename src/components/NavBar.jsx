import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";

export default function NavBar({ view, setView }) {
  const { t, i18n } = useTranslation();

  const items = [
    { key: "home", label: t("nav.home") },
    { key: "physics_lab", label: t("nav.physics_lab") },
    { key: "passport", label: t("nav.passport") },
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-void/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setView("home")}
          className="font-display text-lg text-text tracking-tight"
        >
          Astralis
        </button>

        <nav className="hidden sm:flex gap-1">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm transition ${
                view === item.key
                  ? "bg-panelLight text-text"
                  : "text-muted hover:text-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <select
          value={i18n.language}
          onChange={(e) => {
            i18n.changeLanguage(e.target.value);
            localStorage.setItem("astralis_lang", e.target.value);
          }}
          className="bg-panel border border-white/10 text-sm rounded-full px-3 py-1.5 text-muted"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile nav */}
      <nav className="flex sm:hidden gap-1 px-4 pb-3 overflow-x-auto">
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => setView(item.key)}
            className={`px-3.5 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              view === item.key
                ? "bg-panelLight text-text"
                : "text-muted hover:text-text"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
