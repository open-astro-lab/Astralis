import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Always-visible "Add to Home Screen" button.
 * Tries the native one-tap install first.
 * Only shows short visual help when the browser itself does not support direct install.
 */
export default function InstallPrompt() {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    const ua = window.navigator.userAgent || "";
    const ios =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(ios);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setInstalling(false);
      setShowHelp(false);
    });

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (isStandalone) {
    return (
      <div className="mb-6 rounded-xl border border-nebula/30 bg-nebula/10 px-4 py-3 text-center">
        <p className="text-sm text-nebula font-medium">
          {t("home.install_already")}
        </p>
      </div>
    );
  }

  const handleClick = async () => {
    // Best case: browser gives us a native install dialog → one tap, no steps
    if (deferredPrompt) {
      setInstalling(true);
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
        } else {
          // User cancelled the native dialog – do nothing extra
        }
      } catch (err) {
        console.warn("Install prompt failed:", err);
        setShowHelp(true);
      } finally {
        setInstalling(false);
      }
      return;
    }

    // Native prompt not available → show the simplest possible visual help
    setShowHelp((prev) => !prev);
  };

  return (
    <div className="mb-8 rounded-2xl border-2 border-nebula/50 bg-void/90 backdrop-blur-sm p-4 shadow-lg shadow-nebula/20">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-nebula/25 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-nebula">
            <path d="M12 2v8m0 0l-3-3m3 3l3-3" />
            <rect x="4" y="14" width="16" height="6" rx="1" />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display text-lg text-text leading-snug">
            {t("home.install_title")}
          </p>
          <p className="text-muted text-sm mt-1">
            {t("home.install_subtitle")}
          </p>
        </div>

        <button
          onClick={handleClick}
          disabled={installing}
          className="flex-shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-nebula text-void font-semibold text-sm hover:bg-nebula/90 active:scale-95 transition shadow-md shadow-nebula/40 disabled:opacity-70"
        >
          {installing ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-void border-t-transparent animate-spin" />
              {t("home.install_installing")}
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {t("home.install_button")}
            </>
          )}
        </button>
      </div>

      {/* Only shown when the browser cannot do a direct install */}
      {showHelp && (
        <div className="mt-4 rounded-xl bg-panel border border-white/10 p-4 space-y-4">
          {isIOS ? (
            <>
              <p className="text-text font-medium text-center">
                {t("home.install_ios_simple")}
              </p>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 rounded-lg bg-void/60 p-3">
                  <div className="w-10 h-10 rounded-full bg-nebula/20 flex items-center justify-center text-xl shrink-0">1</div>
                  <div className="flex-1">
                    <p className="text-sm text-text">{t("home.install_ios_step1")}</p>
                    <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 rounded bg-panelLight text-xs text-muted">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" />
                        <polyline points="16 6 12 2 8 6" />
                        <line x1="12" y1="2" x2="12" y2="15" />
                      </svg>
                      Share
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-void/60 p-3">
                  <div className="w-10 h-10 rounded-full bg-nebula/20 flex items-center justify-center text-xl shrink-0">2</div>
                  <p className="text-sm text-text">{t("home.install_ios_step2")}</p>
                </div>
                <div className="flex items-center gap-3 rounded-lg bg-void/60 p-3">
                  <div className="w-10 h-10 rounded-full bg-nebula/20 flex items-center justify-center text-xl shrink-0">3</div>
                  <p className="text-sm text-text">{t("home.install_ios_step3")}</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-text font-medium text-center">
                {t("home.install_android_simple")}
              </p>
              <div className="flex items-center gap-3 rounded-lg bg-void/60 p-3">
                <div className="w-10 h-10 rounded-full bg-nebula/20 flex items-center justify-center text-xl shrink-0">⋮</div>
                <p className="text-sm text-text">{t("home.install_generic_text")}</p>
              </div>
              <p className="text-xs text-muted text-center">
                {t("home.install_chrome_tip")}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
