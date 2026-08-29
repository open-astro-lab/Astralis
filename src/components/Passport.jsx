import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { loadPassport, totalCompleted, levelFor } from "../lib/passport";

const CATEGORIES = [
  "objectsExplored",
  "asteroidInvestigations",
  "exoplanetInvestigations",
  "stellarInvestigations",
  "physicsChallenges",
];

export default function Passport() {
  const { t } = useTranslation();
  const [passport, setPassport] = useState(loadPassport());

  useEffect(() => {
    setPassport(loadPassport());
  }, []);

  const total = totalCompleted(passport);
  const level = levelFor(passport);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl">{t("passport.title")}</h1>

      <div className="mt-6 rounded-2xl border border-starlight/30 bg-panel p-6 flex items-center justify-between shadow-glowGold">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted">
            {t("passport.challenges_completed")}
          </div>
          <div className="font-mono text-3xl text-starlight mt-1">{total}</div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-widest text-muted">Level</div>
          <div className="font-display text-xl text-text mt-1">{t(`passport.${level}`)}</div>
        </div>
      </div>

      {total === 0 ? (
        <p className="text-muted mt-8">{t("passport.empty")}</p>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat}
              className="rounded-xl border border-white/10 bg-panel p-4 flex items-center justify-between"
            >
              <span className="text-muted text-sm">{t(`passport.breakdown.${cat}`)}</span>
              <span className="font-mono text-nebulaSoft">{passport[cat]?.length || 0}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
