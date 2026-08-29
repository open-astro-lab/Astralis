import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { completeActivity } from "../../lib/passport";

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateField(seed, starCount = 22) {
  const rand = seededRandom(seed);
  const stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: 5 + rand() * 90,
      y: 5 + rand() * 90,
      r: 0.6 + rand() * 1.2,
    });
  }
  // The "asteroid" is a distinct point that will move between frames.
  const asteroidStart = { x: 15 + rand() * 20, y: 15 + rand() * 20 };
  const asteroidEnd = {
    x: asteroidStart.x + 30 + rand() * 20,
    y: asteroidStart.y + 15 + rand() * 25,
  };
  return { stars, asteroidStart, asteroidEnd };
}

function StarField({ stars, asteroid, onAsteroidClick, showTarget }) {
  return (
    <svg viewBox="0 0 100 100" className="w-full aspect-square rounded-lg bg-void border border-white/10">
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#EDEFF7" opacity="0.85" />
      ))}
      {asteroid && (
        <circle
          cx={asteroid.x}
          cy={asteroid.y}
          r={2.2}
          fill={showTarget ? "#3FD6B0" : "#F2C572"}
          className={onAsteroidClick ? "cursor-pointer" : ""}
          onClick={onAsteroidClick}
        />
      )}
    </svg>
  );
}

export default function AsteroidHunter() {
  const { t } = useTranslation();
  const [guess, setGuess] = useState(null); // {x,y}
  const [result, setResult] = useState(null); // "correct" | "incorrect"

  const field = useMemo(() => generateField(7), []);

  function handleFrame2Click(e) {
    if (result === "correct") return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const dx = x - field.asteroidEnd.x;
    const dy = y - field.asteroidEnd.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 6) {
      setResult("correct");
      completeActivity("asteroidInvestigations", "blink_comparison");
    } else {
      setResult("incorrect");
    }
    setGuess({ x, y });
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-panel p-6">
      <p className="text-muted text-sm mb-1">{t("asteroid_hunter.instruction")}</p>
      <p className="text-xs text-starlight/80 mb-5">{t("asteroid_hunter.simulated_label")}</p>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted mb-2">
            {t("asteroid_hunter.frame1_label")}
          </div>
          <StarField stars={field.stars} asteroid={field.asteroidStart} />
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest text-muted mb-2">
            {t("asteroid_hunter.frame2_label")}
          </div>
          <div onClick={handleFrame2Click}>
            <StarField
              stars={field.stars}
              asteroid={field.asteroidEnd}
              onAsteroidClick={() => {}}
              showTarget={result === "correct"}
            />
          </div>
        </div>
      </div>

      {result && (
        <div
          className={`mt-5 rounded-xl p-4 text-sm border ${
            result === "correct"
              ? "border-verified/30 bg-verified/5 text-text/90"
              : "border-starlight/30 bg-starlight/5 text-text/90"
          }`}
        >
          {result === "correct" ? t("asteroid_hunter.correct") : t("asteroid_hunter.incorrect")}
          {result === "correct" && (
            <p className="text-muted mt-2">{t("asteroid_hunter.explanation")}</p>
          )}
        </div>
      )}
    </div>
  );
}
