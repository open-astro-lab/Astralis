import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";
import { usePassport } from "../context/PassportContext.jsx";

export default function NavBar({ view, setView }) {
  const { t, i18n } = useTranslation();
  const { user, signIn, signOutUser, firebaseEnabled } = usePassport();

  const items = [
    { key: "home", label: t("nav.home") },
    { key: "passport", label: t("nav.passport") },
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-void/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <button
          onClick={() => setView("home")}
          className="font-display text-lg text-text tracking-tight shrink-0"
        >
          Astralis
        </button>

        <nav className="flex gap-1">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => setView(item.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm transition ${
                view === item.key ? "bg-panelLight text-text" : "text-muted hover:text-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
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

          {firebaseEnabled && (
            user ? (
              <button
                onClick={signOutUser}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-white/10 text-muted hover:text-text transition"
                title={user.email}
              >
                {user.photoURL && (
                  <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full" />
                )}
                {t("auth.sign_out")}
              </button>
            ) : (
              <button
                onClick={signIn}
                className="px-3.5 py-1.5 rounded-full text-xs bg-nebula text-void font-medium hover:bg-nebulaSoft transition"
              >
                {t("auth.sign_in")}
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
}
