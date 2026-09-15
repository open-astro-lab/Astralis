import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Always-visible "Add to Home Screen" button at the top of the Home page.
 * Works on every visit. Handles Android/Chrome install prompt + iOS instructions.
 */
export default function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSHelp, setShowIOSHelp] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Detect if already running as installed app
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Detect iOS
    const ua = window.navigator.userAgent || "";
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    // Capture the browser install event (Android / Chrome / Edge)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setInstalling(false);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  // Already running from home screen → show a small confirmation instead of the button
  if (isStandalone) {
    return (
      <div className="mb-6 rounded-xl border border-nebula/30 bg-nebula/10 px-4 py-3 text-center">
        <p className="text-sm text-nebula font-medium">
          {t("home.install_already", "Astralis is installed on your home screen")}
        </p>
      </div>
    );
  }

  const handleClick = async () => {
    if (deferredPrompt) {
      // Native install available (Android / Chrome)
      setInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn("Install prompt failed:", err);
      } finally {
        setInstalling(false);
      }
    } else if (isIOS) {
      // iOS – show instructions
      setShowIOSHelp((prev) => !prev);
    } else {
      // Fallback for other browsers: show generic instructions
      setShowIOSHelp((prev) => !prev);
    }
  };

  return (
    <div className="mb-8 rounded-2xl border-2 border-nebula/50 bg-void/90 backdrop-blur-sm p-4 shadow-lg shadow-nebula/20">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-nebula/25 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-nebula"
          >
            <path d="M12 2v8m0 0l-3-3m3 3l3-3" />
            <rect x="4" y="14" width="16" height="6" rx="1" />
          </svg>
        </div>

        {/* Text + Button */}
        <div className="flex-1 min-w-0">
          <p className="font-display text-lg text-text leading-snug">
            {t("home.install_title", "Add Astralis to your home screen")}
          </p>
          <p className="text-muted text-sm mt-1">
            {t(
              "home.install_subtitle",
              "Open it like a real app — no Play Store needed."
            )}
          </p>
        </div>

        {/* Main button – always visible */}
        <button
          onClick={handleClick}
          disabled={installing}
          className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-nebula text-void font-semibold text-sm hover:bg-nebula/90 active:scale-95 transition shadow-md shadow-nebula/40 disabled:opacity-70"
        >
          {installing ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-void border-t-transparent animate-spin" />
              {t("home.install_installing", "Installing…")}
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t("home.install_button", "Add to Home Screen")}
            </>
          )}
        </button>
      </div>

      {/* Help text for iOS / unsupported browsers */}
      {showIOSHelp && (
        <div className="mt-4 text-sm text-muted bg-void/70 rounded-xl p-4 border border-white/10">
          {isIOS ? (
            <>
              <p className="mb-2 font-medium text-text">
                {t("home.install_ios_steps_title", "On iPhone / iPad:")}
              </p>
              <ol className="list-decimal list-inside space-y-1.5">
                <li>{t("home.install_ios_step1", "Tap the Share button (square with arrow)")}</li>
                <li>{t("home.install_ios_step2", "Scroll and choose “Add to Home Screen”")}</li>
                <li>{t("home.install_ios_step3", "Tap Add — done!")}</li>
              </ol>
            </>
          ) : (
            <>
              <p className="mb-2 font-medium text-text">
                {t("home.install_generic_title", "How to add to home screen:")}
              </p>
              <p>
                {t(
                  "home.install_generic_text",
                  "Open the browser menu (usually ⋮ or ⋯) and look for “Add to Home screen” or “Install app”."
                )}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
