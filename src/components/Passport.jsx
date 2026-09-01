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

const BADGES = [
  { key: "first_steps", check: (total) => total >= 1 },
  { key: "getting_curious", check: (total) => total >= 5 },
  { key: "dedicated_explorer", check: (total) => total >= 15 },
  { key: "cosmic_scholar", check: (total) => total >= 30 },
  { key: "master_astronomer", check: (total) => total >= 50 },
  { key: "week_streak", check: (total, streak) => streak >= 7 },
];

export default function Passport() {
  const { t } = useTranslation();
  const { passport, syncing } = usePassport();

  const total = totalCompleted(passport);
  const streakCount = passport?.streak?.count || 0;
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
            {streakCount > 0 && (
              <div className="text-xs text-starlight mt-2">
                🔥 {streakCount} {t("passport.streak_label")}
              </div>
            )}
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

      <div className="mt-10">
        <h2 className="font-display text-sm uppercase tracking-widest text-muted mb-4">
          {t("passport.badges_heading")}
        </h2>
        <div className="grid sm:grid-cols-3 gap-3">
          {BADGES.map((badge) => {
            const unlocked = badge.check(total, streakCount);
            return (
              <div
                key={badge.key}
                className={`rounded-xl border p-4 text-center transition ${
                  unlocked
                    ? "border-starlight/50 bg-starlight/5 shadow-glowGold"
                    : "border-white/10 bg-panel opacity-50"
                }`}
              >
                <div className="text-2xl mb-1">{unlocked ? "🏅" : "🔒"}</div>
                <div className="font-display text-sm text-text">
                  {t(`passport.badges.${badge.key}.name`)}
                </div>
                <div className="text-muted text-xs mt-1">
                  {t(`passport.badges.${badge.key}.desc`)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
