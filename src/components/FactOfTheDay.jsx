import { useTranslation } from "react-i18next";

function dayOfYear() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start;
  return Math.floor(diff / 86400000);
}

export default function FactOfTheDay() {
  const { t, i18n } = useTranslation();
  const facts = t("home.facts", { returnObjects: true });
  const list = Array.isArray(facts) ? facts : [];
  const fact = list.length ? list[dayOfYear() % list.length] : "";

  if (!fact) return null;

  return (
    <div className="rounded-2xl border border-starlight/25 bg-gradient-to-br from-panel to-panelLight p-6 mb-10">
      <div className="flex items-start gap-3">
        <div className="text-2xl leading-none">✨</div>
        <div>
          <div className="text-xs uppercase tracking-widest text-starlight/80 mb-1">
            {t("home.fact_heading")}
          </div>
          <p className="text-text/90 text-sm leading-relaxed">{fact}</p>
        </div>
      </div>
    </div>
  );
}
