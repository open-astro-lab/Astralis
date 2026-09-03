import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function OnboardingGuide() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-nebulaSoft text-sm underline underline-offset-2 hover:text-text transition mb-6 block"
      >
        {t("onboarding.link_label")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-w-lg w-full max-h-[85vh] overflow-y-auto rounded-2xl border border-nebula/30 bg-panel p-6 md:p-8 shadow-glow"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-2xl text-text mb-6">{t("onboarding.title")}</h2>

            <div className="space-y-5">
              <div>
                <h3 className="text-starlight text-sm uppercase tracking-widest mb-1.5">
                  {t("onboarding.what_is_astronomy_heading")}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {t("onboarding.what_is_astronomy_text")}
                </p>
              </div>
              <div>
                <h3 className="text-starlight text-sm uppercase tracking-widest mb-1.5">
                  {t("onboarding.modules_heading")}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{t("onboarding.modules_text")}</p>
              </div>
              <div>
                <h3 className="text-starlight text-sm uppercase tracking-widest mb-1.5">
                  {t("onboarding.how_challenges_work_heading")}
                </h3>
                <p className="text-muted text-sm leading-relaxed">
                  {t("onboarding.how_challenges_work_text")}
                </p>
              </div>
              <div>
                <h3 className="text-starlight text-sm uppercase tracking-widest mb-1.5">
                  {t("onboarding.passport_heading")}
                </h3>
                <p className="text-muted text-sm leading-relaxed">{t("onboarding.passport_text")}</p>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-7 px-6 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition"
            >
              {t("onboarding.close_button")}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
