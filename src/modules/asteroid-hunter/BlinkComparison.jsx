import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import Quiz from "../../components/Quiz.jsx";

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Difficulty increases with round: more stars, smaller/closer displacement.
function generateField(seed, round) {
  const rand = seededRandom(seed);
  const starCount = 16 + round * 4;
  const stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push({ x: 5 + rand() * 90, y: 5 + rand() * 90, r: 0.6 + rand() * 1.1 });
  }
  const displacement = Math.max(8, 30 - round * 2.5);
  const asteroidStart = { x: 15 + rand() * 30, y: 15 + rand() * 30 };
  const angle = rand() * Math.PI * 2;
  const asteroidEnd = {
    x: Math.min(92, Math.max(8, asteroidStart.x + Math.cos(angle) * displacement)),
    y: Math.min(92, Math.max(8, asteroidStart.y + Math.sin(angle) * displacement)),
  };
  return { stars, asteroidStart, asteroidEnd };
}

function StarField({ stars, asteroid, onClick, showTarget }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full aspect-square rounded-lg bg-void border border-white/10"
      onClick={onClick}
    >
      {stars.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#EDEFF7" opacity="0.85" />
      ))}
      {asteroid && (
        <circle cx={asteroid.x} cy={asteroid.y} r={2.2} fill={showTarget ? "#3FD6B0" : "#F2C572"} />
      )}
    </svg>
  );
}

const TOTAL_ROUNDS = 38;

export default function AsteroidHunter() {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [round, setRound] = useState(1);
  const [result, setResult] = useState(null);
  const [completedRounds, setCompletedRounds] = useState(0);

  const field = useMemo(() => generateField(round * 13 + 7, round), [round]);

  function handleFrame2Click(e) {
    if (result === "correct") return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const dist = Math.hypot(x - field.asteroidEnd.x, y - field.asteroidEnd.y);
    const tolerance = Math.max(4, 7 - round * 0.3);

    if (dist < tolerance) {
      setResult("correct");
      complete("asteroidInvestigations", `round_${round}`);
      setCompletedRounds((n) => n + 1);
    } else {
      setResult("incorrect");
    }
  }

  function nextRound() {
    setResult(null);
    setRound((r) => Math.min(TOTAL_ROUNDS, r + 1));
  }

  const allRoundsDone = completedRounds >= TOTAL_ROUNDS;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-muted text-sm">{t("asteroid_hunter.instruction")}</p>
          <span className="font-mono text-xs text-nebulaSoft shrink-0 ml-3">
            {t("asteroid_hunter.round_label", { round, total: TOTAL_ROUNDS })}
          </span>
        </div>
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
            <StarField
              stars={field.stars}
              asteroid={field.asteroidEnd}
              onClick={handleFrame2Click}
              showTarget={result === "correct"}
            />
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
            {result === "correct" && <p className="text-muted mt-2">{t("asteroid_hunter.explanation")}</p>}
            {result === "correct" && round < TOTAL_ROUNDS && (
              <button
                onClick={nextRound}
                className="mt-3 px-4 py-2 rounded-full bg-nebula text-void text-sm font-medium hover:bg-nebulaSoft transition"
              >
                {t("asteroid_hunter.next_round")}
              </button>
            )}
          </div>
        )}
      </div>

      {allRoundsDone && (
        <Quiz
          questions={[
            {
              id: "ah_q1",
              promptKey: "asteroid_hunter.quiz.q1.prompt",
              optionKeys: ["asteroid_hunter.quiz.q1.opt1", "asteroid_hunter.quiz.q1.opt2", "asteroid_hunter.quiz.q1.opt3"],
              correctIndex: 0,
              explainKey: "asteroid_hunter.quiz.q1.explain",
            },
            {
              id: "ah_q2",
              promptKey: "asteroid_hunter.quiz.q2.prompt",
              optionKeys: ["asteroid_hunter.quiz.q2.opt1", "asteroid_hunter.quiz.q2.opt2", "asteroid_hunter.quiz.q2.opt3"],
              correctIndex: 0,
              explainKey: "asteroid_hunter.quiz.q2.explain",
            },
            {
              id: "ah_q3",
              promptKey: "asteroid_hunter.quiz.q3.prompt",
              optionKeys: ["asteroid_hunter.quiz.q3.opt1", "asteroid_hunter.quiz.q3.opt2", "asteroid_hunter.quiz.q3.opt3"],
              correctIndex: 0,
              explainKey: "asteroid_hunter.quiz.q3.explain",
            },
          ]}
          category="asteroidInvestigations"
          activityId="asteroid_hunter_quiz"
        />
      )}
    </div>
  );
}
