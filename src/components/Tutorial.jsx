import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Interactive, visual guided tutorial.
 * Each step shows a simplified picture of the real UI element the user should look for.
 * Fully translated (English + Hindi).
 */
export default function Tutorial({ onFinish }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const steps = [
    { key: "welcome", icon: "🌌" },
    { key: "navigate", icon: "🧭" },
    { key: "modules", icon: "🪐" },
    { key: "passport", icon: "📘" },
    { key: "extra", icon: "✨" },
    { key: "language", icon: "🌐" },
    { key: "ready", icon: "🚀", isLast: true },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  function next() {
    if (isLast) onFinish();
    else setStep((s) => s + 1);
  }
  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  // ---- Visual mockups that look like the real app ----
  function Visual() {
    switch (current.key) {
      case "welcome":
        return (
          <div className="mt-6 rounded-2xl border border-nebula/40 bg-panel p-5 text-center">
            <div className="text-4xl mb-2">🌟</div>
            <p className="font-display text-lg text-text">Astralis</p>
            <p className="text-muted text-sm mt-1">{t("tutorial.welcome_visual")}</p>
          </div>
        );

      case "navigate":
        return (
          <div className="mt-6 space-y-3">
            {/* Fake top bar */}
            <div className="rounded-xl border-2 border-nebula bg-panel p-3 relative">
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-text">Astralis</span>
                <div className="flex gap-1">
                  <span className="px-2.5 py-1 rounded-full text-xs bg-panelLight text-text">{t("nav.home")}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs text-muted">{t("nav.passport")}</span>
                  <span className="px-2.5 py-1 rounded-full text-xs text-muted">…</span>
                </div>
              </div>
              {/* Arrow pointing at menu */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-nebula text-sm font-medium bg-void px-2 rounded">
                ↑ {t("tutorial.navigate_visual_label")}
              </div>
            </div>
            {/* Mobile version */}
            <div className="rounded-xl border border-white/10 bg-panel/60 p-3">
              <div className="w-full py-2.5 rounded-lg border border-nebula/50 bg-nebula/15 text-center text-sm text-text font-medium">
                {t("nav.menu_label")}
              </div>
              <p className="text-xs text-muted text-center mt-2">
                {t("tutorial.navigate_mobile_hint")}
              </p>
            </div>
          </div>
        );

      case "modules":
        return (
          <div className="mt-6">
            <div className="grid grid-cols-3 gap-2">
              {["🪐", "🌌", "☄️", "🌍", "⭐", "🔬"].map((emoji, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-xl border flex flex-col items-center justify-center text-2xl
                    ${i === 0 ? "border-nebula bg-nebula/20 ring-2 ring-nebula scale-105" : "border-white/10 bg-panel"}`}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-nebulaSoft mt-3 font-medium">
              ← {t("tutorial.modules_visual_label")}
            </p>
          </div>
        );

      case "passport":
        return (
          <div className="mt-6 rounded-xl border-2 border-starlight/50 bg-panel p-4 relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-starlight/20 flex items-center justify-center text-2xl">📘</div>
              <div>
                <p className="font-display text-text">{t("nav.passport")}</p>
                <p className="text-xs text-muted">⭐ XP · 🔥 Streak · Level</p>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 bg-nebula text-void text-xs font-bold px-2 py-1 rounded-full">
              {t("tutorial.passport_visual_label")}
            </div>
          </div>
        );

      case "extra":
        return (
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { label: t("nav.glossary"), emoji: "📖" },
              { label: t("nav.collection"), emoji: "🗂" },
              { label: t("nav.trivia"), emoji: "⚡" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-white/15 bg-panel p-3 text-center">
                <div className="text-2xl mb-1">{item.emoji}</div>
                <p className="text-xs text-text leading-tight">{item.label}</p>
              </div>
            ))}
          </div>
        );

      case "language":
        return (
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <div className="rounded-full border-2 border-nebula bg-panel px-5 py-2.5 flex items-center gap-2">
                <span className="text-sm text-text">English / हिन्दी</span>
                <span className="text-muted text-xs">▼</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-nebula text-xs font-medium whitespace-nowrap">
                ↑ {t("tutorial.language_visual_label")}
              </div>
            </div>
          </div>
        );

      case "ready":
        return (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-nebula/20 text-4xl mb-2">
              ✅
            </div>
            <p className="text-muted text-sm">{t("tutorial.ready_visual")}</p>
          </div>
        );

      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-void/95 backdrop-blur-md">
      {/* Progress */}
      <div className="h-1.5 w-full bg-panel">
        <div
          className="h-full bg-nebula transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-5 py-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <p className="text-center text-muted text-sm mb-4 font-mono">
            {t("tutorial.step_of", { current: step + 1, total: steps.length })}
          </p>

          <div className="text-5xl text-center mb-4 select-none">{current.icon}</div>

          <h1 className="font-display text-2xl sm:text-3xl text-text text-center leading-tight mb-3">
            {t(`tutorial.${current.key}_title`)}
          </h1>

          <p className="text-muted text-base leading-relaxed text-center whitespace-pre-line">
            {t(`tutorial.${current.key}_body`)}
          </p>

          {/* Interactive visual that shows WHERE the feature is */}
          <Visual />
        </div>
      </div>

      {/* Bottom controls – large touch targets */}
      <div className="border-t border-white/10 bg-panel/95 px-5 py-5 pb-8">
        <div className="max-w-md mx-auto flex flex-col gap-3">
          <button
            onClick={next}
            className="w-full py-4 rounded-2xl bg-nebula text-void font-display font-semibold text-lg hover:bg-nebulaSoft active:scale-[0.98] transition shadow-glow"
          >
            {isLast ? t("tutorial.ready_button") : t("tutorial.next_button")}
          </button>

          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={back}
                className="flex-1 py-3.5 rounded-xl border border-white/15 text-muted font-medium text-base hover:text-text transition"
              >
                {t("tutorial.back_button")}
              </button>
            )}
            <button
              onClick={onFinish}
              className={`py-3.5 rounded-xl border-2 border-white/20 text-text font-medium text-base hover:bg-white/5 transition ${
                step > 0 ? "flex-1" : "w-full"
              }`}
            >
              {t("tutorial.skip_button")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
