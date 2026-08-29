import { useTranslation } from "react-i18next";

export default function Home({ setView }) {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl md:text-5xl leading-tight text-text">
          {t("home.heading")}
        </h1>
        <p className="text-muted text-lg mt-4">{t("home.subheading")}</p>
        <button
          onClick={() => setView("physics_lab")}
          className="mt-8 px-6 py-3 rounded-full bg-nebula text-void font-medium hover:bg-nebulaSoft transition shadow-glow"
        >
          {t("home.start_button")}
        </button>
      </div>

      <h2 className="font-display text-sm uppercase tracking-widest text-muted mt-16 mb-4">
        {t("home.modules_heading")}
      </h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={() => setView("physics_lab")}
          className="text-left rounded-2xl border border-white/10 bg-panel p-6 hover:border-nebula hover:shadow-glow transition"
        >
          <div className="text-starlight text-xs font-mono mb-2">01</div>
          <div className="font-display text-lg">{t("physics_lab.title")}</div>
          <div className="text-muted text-sm mt-1">{t("physics_lab.subtitle")}</div>
        </button>
      </div>
    </div>
  );
}
