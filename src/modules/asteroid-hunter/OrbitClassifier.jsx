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

function classify(distanceAU) {
  if (distanceAU < 1.3) return "neo";
  if (distanceAU >= 2.1 && distanceAU <= 3.3) return "main_belt";
  return "trojan";
}

function generateDistance(seed) {
  const rand = seededRandom(seed);
  const bucket = Math.floor(rand() * 3);
  if (bucket === 0) return +(0.5 + rand() * 0.79).toFixed(2); // NEO range
  if (bucket === 1) return +(2.1 + rand() * 1.2).toFixed(2); // main belt
  return +(5.05 + rand() * 0.3).toFixed(2); // trojan
}

const TOTAL_ROUNDS = 15;
const OPTIONS = ["neo", "main_belt", "trojan"];

export default function OrbitClassifier() {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [round, setRound] = useState(1);
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [completedRounds, setCompletedRounds] = useState(0);

  const distance = generateDistance(round * 31 + 5);
  const correct = classify(distance);

  function handleCheck() {
    setChecked(true);
    if (selected === correct) {
      complete("asteroidInvestigations", `classify_round_${round}`);
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
          <p className="text-muted text-sm">{t("asteroid_hunter.classify.instruction")}</p>
          <span className="font-mono text-xs text-nebulaSoft shrink-0 ml-3">
            {t("asteroid_hunter.classify.round_label", { round, total: TOTAL_ROUNDS })}
          </span>
        </div>

        <div className="rounded-xl border border-nebula/30 bg-void/60 p-5 text-center mb-5">
          <div className="text-xs uppercase tracking-widest text-muted">
            {t("asteroid_hunter.classify.distance_label")}
          </div>
          <div className="font-mono text-3xl text-starlight mt-1">{distance} AU</div>
        </div>

        <div className="grid sm:grid-cols-3 gap-2">
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setSelected(opt);
                setChecked(false);
              }}
              className={`py-2.5 rounded-lg border text-sm transition ${
                selected === opt ? "border-nebula bg-void/60 text-text" : "border-white/10 text-muted hover:border-white/25"
              }`}
            >
              {t(`asteroid_hunter.classify.options.${opt}`)}
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={!selected}
          className="mt-5 px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition disabled:opacity-40"
        >
          {t("asteroid_hunter.classify.check_button")}
        </button>

        {checked && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm border ${
              selected === correct ? "border-verified/30 bg-verified/5 text-text/90" : "border-starlight/30 bg-starlight/5 text-text/90"
            }`}
          >
            {selected === correct ? t("asteroid_hunter.classify.correct") : t("asteroid_hunter.classify.incorrect")}
            {selected === correct && (
              <>
                <p className="text-muted mt-2">{t("asteroid_hunter.classify.explainer")}</p>
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
              id: "classify_q1",
              promptKey: "asteroid_hunter.classify.quiz.q1.prompt",
              optionKeys: ["asteroid_hunter.classify.quiz.q1.opt1", "asteroid_hunter.classify.quiz.q1.opt2", "asteroid_hunter.classify.quiz.q1.opt3"],
              correctIndex: 0,
              explainKey: "asteroid_hunter.classify.quiz.q1.explain",
            },
          ]}
          category="asteroidInvestigations"
          activityId="orbit_classifier_quiz"
        />
      )}
    </div>
  );
}
