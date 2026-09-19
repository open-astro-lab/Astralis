import { useState } from "react";
import { useTranslation } from "react-i18next";

/**
 * Full-screen, senior-friendly tutorial that appears after language selection.
 * Shows every time the app is opened (so people who skipped earlier can still learn).
 * Big Skip button + clear Next steps. Fully translated.
 */
export default function Tutorial({ onFinish }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const steps = [
    {
      key: "welcome",
      title: t("tutorial.welcome_title"),
      body: t("tutorial.welcome_body"),
      icon: "🌌",
    },
    {
      key: "navigate",
      title: t("tutorial.navigate_title"),
      body: t("tutorial.navigate_body"),
      icon: "🧭",
    },
    {
      key: "modules",
      title: t("tutorial.modules_title"),
      body: t("tutorial.modules_body"),
      icon: "🪐",
    },
    {
      key: "passport",
      title: t("tutorial.passport_title"),
      body: t("tutorial.passport_body"),
      icon: "📘",
    },
    {
      key: "extra",
      title: t("tutorial.extra_title"),
      body: t("tutorial.extra_body"),
      icon: "✨",
    },
    {
      key: "language",
      title: t("tutorial.language_title"),
      body: t("tutorial.language_body"),
      icon: "🌐",
    },
    {
      key: "ready",
      title: t("tutorial.ready_title"),
      body: t("tutorial.ready_body"),
      icon: "🚀",
      isLast: true,
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;

  function next() {
    if (isLast) {
      onFinish();
    } else {
      setStep((s) => s + 1);
    }
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-void/95 backdrop-blur-md">
      {/* Top progress bar */}
      <div className="h-1.5 w-full bg-panel">
        <div
          className="h-full bg-nebula transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main content – scrollable if needed */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8 overflow-y-auto">
        <div className="w-full max-w-lg">
          {/* Step counter */}
          <p className="text-center text-muted text-sm mb-6 font-mono">
            {t("tutorial.step_of", { current: step + 1, total: steps.length })}
          </p>

          {/* Icon */}
          <div className="text-5xl text-center mb-6 select-none">{current.icon}</div>

          {/* Title */}
          <h1 className="font-display text-2xl sm:text-3xl text-text text-center leading-tight mb-4">
            {current.title}
          </h1>

          {/* Body */}
          <p className="text-muted text-base sm:text-lg leading-relaxed text-center whitespace-pre-line">
            {current.body}
          </p>

          {/* Visual hint box for some steps */}
          {current.key === "navigate" && (
            <div className="mt-6 rounded-xl border border-nebula/40 bg-nebula/10 px-4 py-3 text-center">
              <p className="text-sm text-nebulaSoft">
                {t("tutorial.navigate_hint")}
              </p>
            </div>
          )}
          {current.key === "modules" && (
            <div className="mt-6 rounded-xl border border-starlight/30 bg-starlight/5 px-4 py-3 text-center">
              <p className="text-sm text-starlight">
                {t("tutorial.modules_hint")}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom controls – always visible, big targets */}
      <div className="border-t border-white/10 bg-panel/90 px-5 py-5 pb-8 safe-area-bottom">
        <div className="max-w-lg mx-auto flex flex-col gap-3">
          {/* Primary action */}
          <button
            onClick={next}
            className="w-full py-4 rounded-2xl bg-nebula text-void font-display font-semibold text-lg hover:bg-nebulaSoft active:scale-[0.98] transition shadow-glow"
          >
            {isLast
              ? t("tutorial.ready_button")
              : t("tutorial.next_button")}
          </button>

          {/* Secondary row */}
          <div className="flex gap-3">
            {step > 0 && (
              <button
                onClick={back}
                className="flex-1 py-3.5 rounded-xl border border-white/15 text-muted font-medium text-base hover:text-text hover:border-white/30 transition"
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
