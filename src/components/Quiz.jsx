import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../context/PassportContext.jsx";
import { useSound } from "../context/SoundContext.jsx";
import ConfettiBurst from "./ConfettiBurst.jsx";

function comboMessageKey(count) {
  if (count >= 15) return "combo.legendary";
  if (count >= 8) return "combo.unstoppable";
  if (count >= 4) return "combo.on_fire";
  return null;
}

/**
 * questions: [{ id, promptKey, optionKeys: [...], correctIndex, explainKey }]
 * On passing (all questions answered correctly in one attempt), records
 * `${category}:${activityId}` as a completed passport activity, and bumps
 * the app-wide combo streak. Any wrong submission breaks the streak.
 */
export default function Quiz({ questions, category, activityId, onPassed, nextLabel, onNext }) {
  const { t } = useTranslation();
  const { complete, combo, bumpCombo, resetCombo } = usePassport();
  const { playClick, playCorrect, playWrong } = useSound();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState(false);
  const [comboAtPass, setComboAtPass] = useState(0);

  function selectAnswer(qId, optionIndex) {
    if (submitted) return;
    playClick();
    setAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  }

  function handleSubmit() {
    const allCorrect = questions.every((q) => answers[q.id] === q.correctIndex);
    setSubmitted(true);
    setPassed(allCorrect);
    if (allCorrect) {
      playCorrect();
      complete(category, activityId);
      bumpCombo();
      setComboAtPass(combo + 1);
      onPassed?.();
    } else {
      playWrong();
      resetCombo();
    }
  }

  function retry() {
    setAnswers({});
    setSubmitted(false);
    setPassed(false);
  }

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);
  const comboKey = passed ? comboMessageKey(comboAtPass) : null;
  const onFire = passed && comboAtPass >= 4;

  return (
    <div
      className={`rounded-2xl border p-6 space-y-6 transition-shadow duration-500 ${
        onFire ? "border-starlight/60 bg-void/50 shadow-glowGold" : "border-nebula/30 bg-void/50"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-widest text-nebulaSoft">
          {t("quiz.heading")}
        </div>
        {combo >= 2 && !submitted && (
          <div className="text-xs font-mono text-starlight">
            🔥 {t("combo.label", { count: combo })}
          </div>
        )}
      </div>

      {questions.map((q, qi) => (
        <div key={q.id}>
          <p className="text-text text-sm mb-3">
            {qi + 1}. {t(q.promptKey)}
          </p>
          <div className="grid gap-2">
            {q.optionKeys.map((optKey, oi) => {
              const isSelected = answers[q.id] === oi;
              const isCorrect = oi === q.correctIndex;
              let stateClass = "border-white/10 hover:border-white/25";
              if (submitted) {
                if (isCorrect) stateClass = "border-verified/60 bg-verified/10";
                else if (isSelected) stateClass = "border-starlight/60 bg-starlight/10";
              } else if (isSelected) {
                stateClass = "border-nebula bg-panelLight";
              }
              return (
                <button
                  key={oi}
                  onClick={() => selectAnswer(q.id, oi)}
                  className={`text-left px-4 py-2.5 rounded-lg border text-sm transition ${stateClass}`}
                >
                  {t(optKey)}
                </button>
              );
            })}
          </div>
          {submitted && (
            <p className="text-muted text-xs mt-2 leading-relaxed">{t(q.explainKey)}</p>
          )}
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition disabled:opacity-40"
        >
          {t("quiz.submit")}
        </button>
      ) : passed ? (
        <div className="animate-[fadeInScale_0.4s_ease-out]">
          <div className="flex items-center gap-2 relative">
            <div className="absolute left-3.5 top-3.5">
              <ConfettiBurst seed={activityId ? activityId.length + comboAtPass : 1} />
            </div>
            <div className="w-7 h-7 rounded-full bg-verified/20 border border-verified flex items-center justify-center text-verified text-sm shrink-0">
              ✓
            </div>
            <div className="text-verified text-sm font-medium">{t("quiz.passed")}</div>
          </div>
          {comboAtPass >= 2 && (
            <div className={`mt-2 text-xs font-mono ${onFire ? "text-starlight" : "text-nebulaSoft"}`}>
              🔥 {t("combo.label", { count: comboAtPass })}
              {comboKey && <span className="ml-2">{t(comboKey)}</span>}
            </div>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="mt-3 px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition"
            >
              {nextLabel || t("quiz.next_default")}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-starlight text-sm font-medium">{t("quiz.failed")}</div>
          <button
            onClick={() => { playClick(); retry(); }}
            className="px-5 py-2.5 rounded-full border border-white/15 text-sm text-text hover:border-nebula transition"
          >
            {t("quiz.retry")}
          </button>
        </div>
      )}
    </div>
  );
}
