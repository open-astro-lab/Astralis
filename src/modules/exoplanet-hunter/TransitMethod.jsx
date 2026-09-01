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

// Difficulty increases with round: shallower dip, more noise, harder to spot.
function generateCurve(seed, hasTransit, round) {
  const rand = seededRandom(seed);
  const points = [];
  const n = 48;
  const transitStart = 20;
  const transitEnd = 28;
  const dipStrength = Math.max(0.03, 0.18 - round * 0.004);
  const noiseLevel = Math.min(0.05, 0.02 + round * 0.001);
  for (let i = 0; i < n; i++) {
    const noise = (rand() - 0.5) * noiseLevel;
    let value = 1 + noise;
    if (hasTransit && i >= transitStart && i <= transitEnd) {
      const mid = (transitStart + transitEnd) / 2;
      const width = (transitEnd - transitStart) / 2;
      const t = (i - mid) / width;
      const dip = dipStrength * Math.max(0, 1 - t * t);
      value -= dip;
    }
    points.push(value);
  }
  return points;
}

function LightCurveSVG({ points, highlighted }) {
  const w = 200;
  const h = 70;
  const min = 0.75;
  const max = 1.05;
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <path d={path} fill="none" stroke={highlighted ? "#3FD6B0" : "#A79AF5"} strokeWidth="2" />
    </svg>
  );
}

const TOTAL_ROUNDS = 31;

export default function ExoplanetHunter({ nextLabel, onNext } = {}) {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [round, setRound] = useState(1);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);
  const [dipDepth, setDipDepth] = useState(0.02);

  const roundSeed = round * 17 + 3;
  const correctIndex = Math.floor(seededRandom(roundSeed)() * 3);
  const curves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 3; i++) {
      arr.push(generateCurve(roundSeed * 7 + i * 13, i === correctIndex, round));
    }
    return arr;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round]);

  function handleCheck() {
    setChecked(true);
    if (selected === correctIndex) {
      complete("exoplanetInvestigations", `round_${round}`);
      setCompletedRounds((n) => n + 1);
    }
  }

  function nextRound() {
    setSelected(null);
    setChecked(false);
    setRound((r) => Math.min(TOTAL_ROUNDS, r + 1));
  }

  const allRoundsDone = completedRounds >= TOTAL_ROUNDS;
  const radiusRatio = Math.sqrt(dipDepth);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <div className="flex items-center justify-between mb-1">
          <p className="text-muted text-sm">{t("exoplanet_hunter.instruction")}</p>
          <span className="font-mono text-xs text-nebulaSoft shrink-0 ml-3">
            {t("exoplanet_hunter.round_label", { round, total: TOTAL_ROUNDS })}
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
                selected === i
                  ? "border-nebula bg-void/60 shadow-glow"
                  : "border-white/10 bg-void/30 hover:border-white/25"
              }`}
            >
              <div className="text-xs text-muted mb-2 font-mono">
                {t("exoplanet_hunter.curve_label", { n: i + 1 })}
              </div>
              <LightCurveSVG points={points} highlighted={selected === i} />
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="mt-5 px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition disabled:opacity-40"
        >
          {t("exoplanet_hunter.check_button")}
        </button>

        {checked && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm border ${
              selected === correctIndex
                ? "border-verified/30 bg-verified/5 text-text/90"
                : "border-starlight/30 bg-starlight/5 text-text/90"
            }`}
          >
            {selected === correctIndex ? t("exoplanet_hunter.correct") : t("exoplanet_hunter.incorrect")}
            {selected === correctIndex && (
              <>
                <p className="text-muted mt-2">{t("exoplanet_hunter.explanation")}</p>
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

      {allRoundsDone && (
        <div className="rounded-2xl border border-white/10 bg-panel p-6">
          <h3 className="font-display text-lg">{t("exoplanet_hunter.size_challenge.heading")}</h3>
          <p className="text-muted text-sm mt-2 mb-5 leading-relaxed">
            {t("exoplanet_hunter.size_challenge.instruction")}
          </p>

          <label className="block text-sm text-muted mb-2">
            {t("exoplanet_hunter.size_challenge.depth_label")}
          </label>
          <input
            type="range"
            min="0.001"
            max="0.15"
            step="0.001"
            value={dipDepth}
            onChange={(e) => setDipDepth(parseFloat(e.target.value))}
            className="w-full accent-nebula"
          />
          <div className="font-mono text-nebulaSoft text-sm mt-1">{(dipDepth * 100).toFixed(1)}%</div>

          <div className="mt-4 rounded-xl border border-nebula/30 bg-void/60 p-5 text-center">
            <div className="text-xs uppercase tracking-widest text-muted">
              {t("exoplanet_hunter.size_challenge.ratio_label")}
            </div>
            <div className="font-mono text-3xl text-starlight mt-1">{radiusRatio.toFixed(3)}</div>
          </div>

          <div className="mt-6">
            <Quiz
              questions={[
                {
                  id: "eh_q1",
                  promptKey: "exoplanet_hunter.quiz.q1.prompt",
                  optionKeys: ["exoplanet_hunter.quiz.q1.opt1", "exoplanet_hunter.quiz.q1.opt2", "exoplanet_hunter.quiz.q1.opt3"],
                  correctIndex: 1,
                  explainKey: "exoplanet_hunter.quiz.q1.explain",
                },
                {
                  id: "eh_q2",
                  promptKey: "exoplanet_hunter.quiz.q2.prompt",
                  optionKeys: ["exoplanet_hunter.quiz.q2.opt1", "exoplanet_hunter.quiz.q2.opt2", "exoplanet_hunter.quiz.q2.opt3"],
                  correctIndex: 0,
                  explainKey: "exoplanet_hunter.quiz.q2.explain",
                },
                {
                  id: "eh_q3",
                  promptKey: "exoplanet_hunter.quiz.q3.prompt",
                  optionKeys: ["exoplanet_hunter.quiz.q3.opt1", "exoplanet_hunter.quiz.q3.opt2", "exoplanet_hunter.quiz.q3.opt3"],
                  correctIndex: 0,
                  explainKey: "exoplanet_hunter.quiz.q3.explain",
                },
              ]}
              category="exoplanetInvestigations"
              activityId="exoplanet_hunter_quiz"
              nextLabel={nextLabel}
              onNext={onNext}
            />
          </div>
        </div>
      )}
    </div>
  );
}
