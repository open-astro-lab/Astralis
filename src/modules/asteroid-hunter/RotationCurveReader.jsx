import { useState } from "react";
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

// Generates a periodic brightness curve (two brightness peaks per rotation,
// since an irregular asteroid usually shows its longer and shorter face once each).
function generateCurve(periodHours, noiseLevel, seed) {
  const rand = seededRandom(seed);
  const totalHours = 24;
  const points = [];
  const n = 60;
  for (let i = 0; i < n; i++) {
    const hours = (i / n) * totalHours;
    const phase = (hours / periodHours) * 2 * Math.PI;
    const noise = (rand() - 0.5) * noiseLevel;
    const value = 1 + 0.12 * Math.sin(phase * 2) + noise;
    points.push(value);
  }
  return points;
}

function CurveSVG({ points }) {
  const w = 220;
  const h = 80;
  const min = 0.8;
  const max = 1.2;
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24">
      <path d={path} fill="none" stroke="#A79AF5" strokeWidth="2" />
    </svg>
  );
}

const TOTAL_ROUNDS = 15;
const PERIOD_OPTIONS_HOURS = [4, 6, 8, 12];

export default function RotationCurveReader() {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [round, setRound] = useState(1);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);

  const seed = round * 41 + 9;
  const rand = seededRandom(seed);
  const correctPeriod = PERIOD_OPTIONS_HOURS[Math.floor(rand() * PERIOD_OPTIONS_HOURS.length)];
  const noiseLevel = Math.min(0.06, 0.01 + round * 0.003);
  const points = generateCurve(correctPeriod, noiseLevel, seed * 3 + 1);

  function handleCheck() {
    setChecked(true);
    if (selected === correctPeriod) {
      complete("asteroidInvestigations", `rotation_round_${round}`);
      setCompletedRounds((n) => n + 1);
    }
  }

  function nextRound() {
    setSelected(null);
    setChecked(false);
    setRound((r) => Math.min(TOTAL_ROUNDS, r + 1));
  }

  const allDone = completedRounds >= TOTAL_ROUNDS;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-muted text-sm">{t("asteroid_hunter.rotation.instruction")}</p>
          <span className="font-mono text-xs text-nebulaSoft shrink-0 ml-3">
            {t("asteroid_hunter.rotation.round_label", { round, total: TOTAL_ROUNDS })}
          </span>
        </div>

        <div className="rounded-xl border border-nebula/30 bg-void/60 p-4 mb-5">
          <div className="text-xs uppercase tracking-widest text-muted mb-2">
            {t("asteroid_hunter.rotation.chart_label")}
          </div>
          <CurveSVG points={points} />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {PERIOD_OPTIONS_HOURS.map((p) => (
            <button
              key={p}
              onClick={() => {
                setSelected(p);
                setChecked(false);
              }}
              className={`py-2.5 rounded-lg border font-mono text-sm transition ${
                selected === p ? "border-nebula bg-void/60 text-text" : "border-white/10 text-muted hover:border-white/25"
              }`}
            >
              {p}h
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={!selected}
          className="mt-5 px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition disabled:opacity-40"
        >
          {t("asteroid_hunter.rotation.check_button")}
        </button>

        {checked && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm border ${
              selected === correctPeriod ? "border-verified/30 bg-verified/5 text-text/90" : "border-starlight/30 bg-starlight/5 text-text/90"
            }`}
          >
            {selected === correctPeriod ? t("asteroid_hunter.rotation.correct") : t("asteroid_hunter.rotation.incorrect")}
            {selected === correctPeriod && (
              <>
                <p className="text-muted mt-2">{t("asteroid_hunter.rotation.explainer")}</p>
                {round < TOTAL_ROUNDS && (
                  <button
                    onClick={nextRound}
                    className="mt-3 px-4 py-2 rounded-full bg-nebula text-void text-sm font-medium hover:bg-nebulaSoft transition"
                  >
                    {t("asteroid_hunter.next_round")}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {allDone && (
        <Quiz
          questions={[
              {
                id: "rotation_q1",
                promptKey: "asteroid_hunter.rotation.quiz.q1.prompt",
                optionKeys: ["asteroid_hunter.rotation.quiz.q1.opt1", "asteroid_hunter.rotation.quiz.q1.opt2", "asteroid_hunter.rotation.quiz.q1.opt3"],
                correctIndex: 0,
                explainKey: "asteroid_hunter.rotation.quiz.q1.explain",
              },
              {
                id: "rotation_q2",
                promptKey: "asteroid_hunter.rotation.quiz.q2.prompt",
                optionKeys: ["asteroid_hunter.rotation.quiz.q2.opt1", "asteroid_hunter.rotation.quiz.q2.opt2", "asteroid_hunter.rotation.quiz.q2.opt3"],
                correctIndex: 0,
                explainKey: "asteroid_hunter.rotation.quiz.q2.explain",
              },
              {
                id: "rotation_q3",
                promptKey: "asteroid_hunter.rotation.quiz.q3.prompt",
                optionKeys: ["asteroid_hunter.rotation.quiz.q3.opt1", "asteroid_hunter.rotation.quiz.q3.opt2", "asteroid_hunter.rotation.quiz.q3.opt3"],
                correctIndex: 0,
                explainKey: "asteroid_hunter.rotation.quiz.q3.explain",
              },
            ]}
          category="asteroidInvestigations"
          activityId="rotation_curve_quiz"
        />
      )}
    </div>
  );
}
