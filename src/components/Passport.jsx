import { useTranslation } from "react-i18next";
import { usePassport } from "../context/PassportContext.jsx";
import { totalCompleted, levelFor } from "../lib/passport";

const CATEGORIES = [
  "objectsExplored",
  "asteroidInvestigations",
  "exoplanetInvestigations",
  "stellarInvestigations",
  "physicsChallenges",
];

const LEVEL_THRESHOLDS = [
  { key: "level_curious", min: 0 },
  { key: "level_explorer", min: 3 },
  { key: "level_investigator", min: 8 },
  { key: "level_scientist", min: 15 },
];

export default function Passport() {
  const { t } = useTranslation();
  const { passport, syncing } = usePassport();

  const total = totalCompleted(passport);
  const level = levelFor(passport);
  const currentIdx = LEVEL_THRESHOLDS.findIndex((l) => l.key === level);
  const nextLevel = LEVEL_THRESHOLDS[currentIdx + 1];
  const prevMin = LEVEL_THRESHOLDS[currentIdx].min;
  const levelProgressPct = nextLevel
    ? Math.min(100, ((total - prevMin) / (nextLevel.min - prevMin)) * 100)
    : 100;

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl">{t("passport.title")}</h1>

      <div className="mt-6 rounded-2xl border border-starlight/30 bg-panel p-6 shadow-glowGold">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-widest text-muted">
              {t("passport.challenges_completed")}
            </div>
            <div className="font-mono text-3xl text-starlight mt-1">
              {total}
              {syncing && <span className="text-xs text-nebulaSoft ml-2 animate-pulse">{t("auth.syncing")}</span>}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-widest text-muted">Level</div>
            <div className="font-display text-xl text-text mt-1">{t(`passport.${level}`)}</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-2 rounded-full bg-void/60 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-nebula to-starlight transition-all duration-500"
              style={{ width: `${levelProgressPct}%` }}
            />
          </div>
          <p className="text-muted text-xs mt-2">
            {nextLevel
              ? t("passport.next_level_progress", {
                  remaining: nextLevel.min - total,
                  level: t(`passport.${nextLevel.key}`),
                })
              : t("passport.max_level_reached")}
          </p>
        </div>
      </div>

      {total === 0 ? (
        <p className="text-muted mt-8">{t("passport.empty")}</p>
      ) : (
        <div className="mt-8 grid sm:grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => {
            const count = passport[cat]?.length || 0;
            const maxBar = Math.max(1, ...CATEGORIES.map((c) => passport[c]?.length || 0));
            return (
              <div key={cat} className="rounded-xl border border-white/10 bg-panel p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted text-sm">{t(`passport.breakdown.${cat}`)}</span>
                  <span className="font-mono text-nebulaSoft">{count}</span>
                </div>
                <div className="h-1.5 rounded-full bg-void/60 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-nebula transition-all duration-500"
                    style={{ width: `${(count / maxBar) * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
