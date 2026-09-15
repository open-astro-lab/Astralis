import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Shows a clear "Add to Home Screen" button near the top of the home page.
 * - On Chromium/Android: uses the beforeinstallprompt event for a native install flow.
 * - On iOS Safari: shows simple instructions (no programmatic install possible).
 * - Hides itself once the app is already running in standalone mode or the user dismisses it.
 */
export default function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem("astralis_install_dismissed") === "1";
    } catch {
      return false;
    }
  });
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);

  useEffect(() => {
    // Already installed / running as PWA?
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Detect iOS (no beforeinstallprompt support)
    const ua = window.navigator.userAgent || "";
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    // If the user installs, hide the prompt
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setDismissed(true);
      try {
        localStorage.setItem("astralis_install_dismissed", "1");
      } catch {}
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  if (isStandalone || dismissed) return null;

  // Nothing to show if not installable and not iOS
  if (!deferredPrompt && !isIOS) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
      // Keep the button until they actually install or dismiss
    } else if (isIOS) {
      setShowIOSHelp(true);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem("astralis_install_dismissed", "1");
    } catch {}
  };

  return (
    <div className="mb-8 rounded-2xl border border-nebula/40 bg-void/80 backdrop-blur-sm p-4 shadow-lg shadow-nebula/10">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-nebula/20 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-nebula">
            <path d="M12 2v8m0 0l-3-3m3 3l3-3" />
            <path d="M4 14v4a2 2 0 002 2h12a2 2 0 002-2v-4" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-display text-base text-text leading-snug">
            {t("home.install_title", "Add Astralis to your home screen")}
          </p>
          <p className="text-muted text-sm mt-1">
            {t(
              "home.install_subtitle",
              "Open it like a real app — no Play Store needed."
            )}
          </p>

          {showIOSHelp && (
            <div className="mt-3 text-sm text-muted bg-void/60 rounded-lg p-3 border border-white/5">
              <p className="mb-1 font-medium text-text">
                {t("home.install_ios_steps_title", "On iPhone / iPad:")}
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>{t("home.install_ios_step1", "Tap the Share button (square with arrow)")}</li>
                <li>{t("home.install_ios_step2", "Scroll and choose “Add to Home Screen”")}</li>
                <li>{t("home.install_ios_step3", "Tap Add — done!")}</li>
              </ol>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={handleInstall}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-nebula text-void font-semibold text-sm hover:bg-nebula/90 transition shadow-md shadow-nebula/30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t("home.install_button", "Add to Home Screen")}
            </button>
            <button
              onClick={handleDismiss}
              className="px-3 py-2 rounded-xl text-muted text-sm hover:text-text transition"
            >
              {t("home.install_dismiss", "Not now")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
