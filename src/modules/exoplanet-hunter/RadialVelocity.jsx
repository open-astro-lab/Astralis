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

function generateWobble(seed, hasWobble, round) {
  const rand = seededRandom(seed);
  const n = 48;
  const points = [];
  const amplitude = Math.max(0.08, 0.3 - round * 0.006);
  const noise = Math.min(0.12, 0.04 + round * 0.002);
  for (let i = 0; i < n; i++) {
    const phase = (i / n) * 4 * Math.PI;
    let value = (rand() - 0.5) * noise;
    if (hasWobble) value += amplitude * Math.sin(phase);
    points.push(value);
  }
  return points;
}

function WobbleSVG({ points, highlighted }) {
  const w = 200;
  const h = 70;
  const min = -0.4;
  const max = 0.4;
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <line x1="0" y1={h / 2} x2={w} y2={h / 2} stroke="#4B4F6B" strokeWidth="0.5" />
      <path d={path} fill="none" stroke={highlighted ? "#3FD6B0" : "#A79AF5"} strokeWidth="2" />
    </svg>
  );
}

const TOTAL_ROUNDS = 15;

export default function RadialVelocity() {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [round, setRound] = useState(1);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);

  const roundSeed = round * 19 + 4;
  const correctIndex = Math.floor(seededRandom(roundSeed)() * 3);
  const curves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 3; i++) {
      arr.push(generateWobble(roundSeed * 5 + i * 11, i === correctIndex, round));
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function handleCheck() {
    setChecked(true);
    if (selected === correctIndex) {
      complete("exoplanetInvestigations", `rv_round_${round}`);
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
        <div className="flex items-center justify-between mb-1">
          <p className="text-muted text-sm max-w-md">{t("exoplanet_hunter.radial_velocity.instruction")}</p>
          <span className="font-mono text-xs text-nebulaSoft shrink-0 ml-3">
            {t("exoplanet_hunter.radial_velocity.round_label", { round, total: TOTAL_ROUNDS })}
          </span>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 mt-4">
          {curves.map((points, i) => (
            <button
              key={i}
              onClick={() => {
                setSelected(i);
                setChecked(false);
              }}
              className={`rounded-xl border p-4 text-left transition ${
                selected === i ? "border-nebula bg-void/60 shadow-glow" : "border-white/10 bg-void/30 hover:border-white/25"
              }`}
            >
              <div className="text-xs text-muted mb-2 font-mono">
                {t("exoplanet_hunter.radial_velocity.curve_label", { n: i + 1 })}
              </div>
              <WobbleSVG points={points} highlighted={selected === i} />
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="mt-5 px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition disabled:opacity-40"
        >
          {t("exoplanet_hunter.radial_velocity.check_button")}
        </button>

        {checked && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm border ${
              selected === correctIndex ? "border-verified/30 bg-verified/5 text-text/90" : "border-starlight/30 bg-starlight/5 text-text/90"
            }`}
          >
            {selected === correctIndex ? t("exoplanet_hunter.radial_velocity.correct") : t("exoplanet_hunter.radial_velocity.incorrect")}
            {selected === correctIndex && (
              <>
                <p className="text-muted mt-2">{t("exoplanet_hunter.radial_velocity.explanation")}</p>
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
                id: "rv_q1",
                promptKey: "exoplanet_hunter.radial_velocity.quiz.q1.prompt",
                optionKeys: ["exoplanet_hunter.radial_velocity.quiz.q1.opt1", "exoplanet_hunter.radial_velocity.quiz.q1.opt2", "exoplanet_hunter.radial_velocity.quiz.q1.opt3"],
                correctIndex: 0,
                explainKey: "exoplanet_hunter.radial_velocity.quiz.q1.explain",
              },
              {
                id: "rv_q2",
                promptKey: "exoplanet_hunter.radial_velocity.quiz.q2.prompt",
                optionKeys: ["exoplanet_hunter.radial_velocity.quiz.q2.opt1", "exoplanet_hunter.radial_velocity.quiz.q2.opt2", "exoplanet_hunter.radial_velocity.quiz.q2.opt3"],
                correctIndex: 0,
                explainKey: "exoplanet_hunter.radial_velocity.quiz.q2.explain",
              },
              {
                id: "rv_q3",
                promptKey: "exoplanet_hunter.radial_velocity.quiz.q3.prompt",
                optionKeys: ["exoplanet_hunter.radial_velocity.quiz.q3.opt1", "exoplanet_hunter.radial_velocity.quiz.q3.opt2", "exoplanet_hunter.radial_velocity.quiz.q3.opt3"],
                correctIndex: 0,
                explainKey: "exoplanet_hunter.radial_velocity.quiz.q3.explain",
              },
            ]}
          category="exoplanetInvestigations"
          activityId="radial_velocity_quiz"
        />
      )}
    </div>
  );
}
