import { useTranslation } from "react-i18next";
import { LANGUAGES } from "../i18n";

export default function LanguagePicker({ onChosen }) {
  const { t, i18n } = useTranslation();

  function choose(code) {
    i18n.changeLanguage(code);
    localStorage.setItem("astralis_lang", code);
    onChosen();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="font-display text-3xl text-text mb-1">Astralis</div>
        <h1 className="font-display text-xl text-nebulaSoft mt-6">
          {t("language_picker.title")}
        </h1>
        <p className="text-muted text-sm mt-2 mb-8">
          {t("language_picker.subtitle")}
        </p>
        <div className="grid gap-3">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => choose(lang.code)}
              className="w-full py-3.5 rounded-xl border border-white/10 bg-panel hover:border-nebula hover:shadow-glow transition font-medium"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
