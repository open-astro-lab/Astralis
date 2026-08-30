import { useTranslation } from "react-i18next";
import { usePassport } from "../context/PassportContext.jsx";

export default function GuestBanner() {
  const { t } = useTranslation();
  const { user, signIn, firebaseEnabled, authReady } = usePassport();

  if (!firebaseEnabled || !authReady || user) return null;

  return (
    <div className="bg-starlight/10 border-b border-starlight/25">
      <div className="max-w-5xl mx-auto px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="text-starlight/90">{t("auth.guest_warning")}</span>
        <button
          onClick={signIn}
          className="text-starlight underline underline-offset-2 hover:text-text transition shrink-0"
        >
          {t("auth.sign_in")}
        </button>
      </div>
    </div>
  );
}
