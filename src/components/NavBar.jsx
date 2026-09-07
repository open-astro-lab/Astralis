import { useState } from "react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";
import { usePassport } from "../context/PassportContext.jsx";
import { useSound } from "../context/SoundContext.jsx";
import { totalCompleted, CATEGORY_KEYS } from "../lib/passport";

export default function NavBar({ view, setView }) {
  const { t, i18n } = useTranslation();
  const { user, signIn, signOutUser, firebaseEnabled, syncing, passport, combo } = usePassport();
  const { enabled: soundEnabled, toggle: toggleSound, playClick } = useSound();
  const [mobileOpen, setMobileOpen] = useState(false);
  const streakCount = passport?.streak?.count || 0;
  const xpTotal = totalCompleted(passport);
  const missionsCompleted = CATEGORY_KEYS.reduce(
    (sum, key) => sum + (passport?.[key]?.filter((id) => id.startsWith("mission_")).length || 0),
    0
  );

  function go(key) {
    playClick();
    setView(key);
    setMobileOpen(false);
  }

  const items = [
    { key: "home", label: t("nav.home") },
    { key: "glossary", label: t("nav.glossary") },
    { key: "collection", label: t("nav.collection") },
    { key: "trivia", label: t("nav.trivia") },
    { key: "passport", label: t("nav.passport") },
  ];

  const statsBadges = (
    <>
      <button
        onClick={() => go("passport")}
        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-nebula/10 border border-nebula/30 text-nebulaSoft font-mono hover:border-nebula transition"
      >
        ⭐ {xpTotal} XP
      </button>
      {missionsCompleted > 0 && (
        <button
          onClick={() => go("passport")}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-verified/10 border border-verified/30 text-verified font-mono hover:border-verified transition"
        >
          🎯 {missionsCompleted}
        </button>
      )}
      {combo >= 2 && (
        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-starlight/10 border border-starlight/40 text-starlight font-mono animate-pulse">
          🔥 {t("combo.label", { count: combo })}
        </span>
      )}
      {streakCount > 1 && (
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-starlight/10 border border-starlight/30 text-starlight"
          title={t("passport.streak_label")}
        >
          🔥 {streakCount}
        </span>
      )}
      {firebaseEnabled && syncing && (
        <span className="text-xs text-nebulaSoft animate-pulse">{t("auth.syncing")}</span>
      )}
    </>
  );

  const languageSelect = (
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
  );

  const authButton = firebaseEnabled && (
    user ? (
      <button
        onClick={signOutUser}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border border-white/10 text-muted hover:text-text transition"
        title={user.email}
      >
        {user.photoURL && <img src={user.photoURL} alt="" className="w-5 h-5 rounded-full" />}
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
  );

  return (
    <header className="sticky top-0 z-10 border-b border-white/5 bg-void/80 backdrop-blur">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <button onClick={() => go("home")} className="font-display text-lg text-text tracking-tight shrink-0">
            Astralis
          </button>

          {/* Desktop / tablet: unchanged, full row, never scrolls */}
          <nav className="hidden sm:flex gap-1">
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

          <div className="hidden sm:flex items-center gap-2 ml-auto">
            <button
              onClick={toggleSound}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-muted hover:text-text hover:border-white/25 transition"
              aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
              title={soundEnabled ? "Mute sound" : "Unmute sound"}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
            {statsBadges}
            {languageSelect}
            {authButton}
          </div>

          {/* Mobile: compact — everything else lives in the expandable menu below */}
          <div className="flex sm:hidden items-center gap-2 ml-auto">
            <button
              onClick={toggleSound}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-white/10 text-muted"
              aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-text"
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile expandable menu — every tab and control fits on screen, no swiping */}
        {mobileOpen && (
          <div className="sm:hidden mt-3 pt-3 border-t border-white/10 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => go(item.key)}
                  className={`px-3.5 py-2.5 rounded-lg text-sm text-left transition ${
                    view === item.key ? "bg-panelLight text-text" : "bg-panel text-muted"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">{statsBadges}</div>
            <div className="flex items-center gap-2">
              {languageSelect}
              {authButton}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
