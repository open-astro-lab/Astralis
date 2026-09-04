import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";
import { usePassport } from "../context/PassportContext.jsx";
import { useSound } from "../context/SoundContext.jsx";
import { totalCompleted } from "../lib/passport";

export default function NavBar({ view, setView }) {
  const { t, i18n } = useTranslation();
  const { user, signIn, signOutUser, firebaseEnabled, syncing, passport, combo } = usePassport();
  const { enabled: soundEnabled, toggle: toggleSound, playClick } = useSound();
  const streakCount = passport?.streak?.count || 0;
  const xpTotal = totalCompleted(passport);

  function go(key) {
    playClick();
    setView(key);
  }

  const items = [
    { key: "home", label: t("nav.home") },
    { key: "glossary", label: t("nav.glossary") },
    { key: "collection", label: t("nav.collection") },
    { key: "passport", label: t("nav.passport") },
  ];

  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-void/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <button
          onClick={() => go("home")}
          className="font-display text-lg text-text tracking-tight shrink-0"
        >
          Astralis
        </button>

        <nav className="flex gap-1">
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => go(item.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm transition ${
                view === item.key ? "bg-panelLight text-text" : "text-muted hover:text-text"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={toggleSound}
            className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-muted hover:text-text hover:border-white/25 transition"
            aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
            title={soundEnabled ? "Mute sound" : "Unmute sound"}
          >
            {soundEnabled ? "🔊" : "🔇"}
          </button>
          <button
            onClick={() => setView("passport")}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-nebula/10 border border-nebula/30 text-nebulaSoft font-mono hover:border-nebula transition"
          >
            ⭐ {xpTotal} XP
          </button>
          {combo >= 2 && (
            <span className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-starlight/10 border border-starlight/40 text-starlight font-mono animate-pulse">
              🔥 {t("combo.label", { count: combo })}
            </span>
          )}
          {streakCount > 1 && (
            <span
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-starlight/10 border border-starlight/30 text-starlight"
              title={t("passport.streak_label")}
            >
              🔥 {streakCount}
            </span>
          )}
          {firebaseEnabled && syncing && (
            <span className="text-xs text-nebulaSoft animate-pulse hidden sm:inline">
              {t("auth.syncing")}
            </span>
          )}
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
