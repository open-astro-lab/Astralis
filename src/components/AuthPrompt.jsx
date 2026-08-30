import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../context/PassportContext.jsx";

export default function AuthPrompt() {
  const { t } = useTranslation();
  const { user, signIn, firebaseEnabled, authReady } = usePassport();
  const [dismissed, setDismissed] = useState(false);

  if (!firebaseEnabled || !authReady || user || dismissed) return null;

  return (
    <div className="rounded-2xl border border-nebula/30 bg-panel p-6 mb-10 shadow-glow">
      <h2 className="font-display text-lg text-text">{t("auth.save_progress_heading")}</h2>
      <p className="text-muted text-sm mt-1 max-w-xl">{t("auth.save_progress_subtitle")}</p>

      <div className="mt-4 flex flex-wrap items-center gap-4">
        <button
          onClick={signIn}
          className="px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition"
        >
          {t("auth.sign_in")}
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-muted text-sm hover:text-text transition underline underline-offset-2"
        >
          {t("auth.skip_button")}
        </button>
      </div>
      <p className="text-xs text-starlight/70 mt-3">{t("auth.skip_caption")}</p>
    </div>
  );
}
