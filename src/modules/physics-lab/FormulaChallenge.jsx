import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import Quiz from "../../components/Quiz.jsx";

/**
 * Generic single-formula interactive challenge card, with an optional
 * "Precision Challenge" mini-game: hit a real target value by tuning the
 * sliders, with a live proximity meter.
 */
export default function FormulaChallenge({
  id,
  titleKey,
  promptKey,
  resultLabelKey,
  sanityCheckKey,
  formulaText,
  formulaExplainerKey,
  inputs,
  compute,
  resultUnit,
  quizQuestions,
  nextLabel,
  onNext,
  challengeLabelKey,
  challengeTarget,
  challengeTolerance = 0.05,
}) {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [values, setValues] = useState(() =>
    Object.fromEntries(inputs.map((i) => [i.key, i.initial]))
  );
  const [revealed, setRevealed] = useState(false);
  const [challengeHit, setChallengeHit] = useState(false);

  const result = useMemo(() => compute(values), [values]);

  const hasChallenge = challengeTarget != null;
  const relDiff = hasChallenge && Number.isFinite(result)
    ? Math.abs(result - challengeTarget) / challengeTarget
    : null;
  const withinTolerance = hasChallenge && relDiff !== null && relDiff <= challengeTolerance;
  const proximityPct = hasChallenge && relDiff !== null
    ? Math.max(0, Math.min(100, 100 - (relDiff / (challengeTolerance * 6)) * 100))
    : 0;

  useEffect(() => {
    if (withinTolerance && !challengeHit) {
      setChallengeHit(true);
      complete("physicsChallenges", `${id}_precision`);
    }
  }, [withinTolerance, challengeHit, complete, id]);

  function handleReveal() {
    setRevealed(true);
    complete("physicsChallenges", id);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-panel p-6 md:p-8 shadow-glow">
      <h2 className="font-display text-2xl text-text">{t(titleKey)}</h2>
      <p className="mt-2 text-muted max-w-xl">{t(promptKey)}</p>

      {hasChallenge && (
        <div
          className={`mt-5 rounded-xl border p-4 transition-colors ${
            withinTolerance ? "border-verified/50 bg-verified/5" : "border-starlight/30 bg-starlight/5"
          }`}
        >
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-text/90">{t("physics_lab.challenge_heading")}</div>
            {withinTolerance && (
              <span className="text-verified text-xs font-medium">
                {t("physics_lab.challenge_nailed")}
              </span>
            )}
          </div>
          <p className="text-muted text-xs mt-1">{t(challengeLabelKey)}</p>
          <div className="mt-3 h-2 rounded-full bg-void/60 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                withinTolerance ? "bg-verified" : "bg-starlight"
              }`}
              style={{ width: `${proximityPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr] items-start">
        <div className="space-y-5">
          {inputs.map((inp) => (
            <div key={inp.key}>
              <label className="block text-sm text-muted mb-2">{t(inp.labelKey)}</label>
              <input
                type="range"
                min={inp.min}
                max={inp.max}
                step={inp.step}
                value={values[inp.key]}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [inp.key]: parseFloat(e.target.value) }))
                }
                className="w-full accent-nebula"
              />
              <div className="font-mono text-nebulaSoft text-sm mt-1">
                {values[inp.key].toLocaleString(undefined, { maximumFractionDigits: 4 })}{" "}
                {inp.unit}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-nebula/30 bg-void/60 p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-widest text-muted">
            {t(resultLabelKey)}
          </div>
          <div className="font-mono text-3xl md:text-4xl text-starlight mt-2 tabular-nums">
            {Number.isFinite(result) ? result.toFixed(4) : "—"}
          </div>
          <div className="text-muted text-sm mt-1">{resultUnit}</div>
          {sanityCheckKey && (
            <div className="text-xs text-muted/70 mt-4">{t(sanityCheckKey)}</div>
          )}
        </div>
      </div>

      <div className="mt-6">
        {!revealed ? (
          <button
            onClick={handleReveal}
            className="px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition"
          >
            {t("physics_lab.reveal_button")}
          </button>
        ) : (
          <div className="rounded-xl border border-verified/30 bg-verified/5 p-4 text-sm text-text/90">
            <div className="font-mono text-verified mb-2">{formulaText}</div>
            <p className="text-muted">{t(formulaExplainerKey)}</p>
          </div>
        )}
      </div>

      {revealed && quizQuestions && (
        <div className="mt-5">
          <Quiz
            questions={quizQuestions}
            category="physicsChallenges"
            activityId={`${id}_quiz`}
            nextLabel={nextLabel}
            onNext={onNext}
          />
        </div>
      )}
    </div>
  );
}
