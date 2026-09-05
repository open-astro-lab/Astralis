import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../context/PassportContext.jsx";
import { useSound } from "../context/SoundContext.jsx";
import { shuffledPool } from "../lib/triviaPool.js";

const ROUND_SECONDS = 60;

export default function TriviaBlitz() {
  const { t } = useTranslation();
  const { passport, complete, submitTriviaScore, bumpCombo, resetCombo } = usePassport();
  const { playClick, playCorrect, playWrong } = useSound();

  const [phase, setPhase] = useState("intro"); // intro | playing | done
  const [pool, setPool] = useState([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [locked, setLocked] = useState(false);
  const [score, setScore] = useState(0);
  const [roundStreak, setRoundStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [justBeatBest, setJustBeatBest] = useState(false);
  const timerRef = useRef(null);

  const best = passport?.triviaBestScore || 0;

  function start() {
    playClick();
    setPool(shuffledPool(Date.now() % 100000));
    setIndex(0);
    setScore(0);
    setRoundStreak(0);
    setSelected(null);
    setLocked(false);
    setTimeLeft(ROUND_SECONDS);
    setJustBeatBest(false);
    setPhase("playing");
    complete("dailyChallenges", "trivia_blitz_tried");
  }

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((tval) => (tval <= 1 ? 0 : tval - 1));
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  useEffect(() => {
    if (phase === "playing" && timeLeft === 0) {
      clearInterval(timerRef.current);
      setJustBeatBest(score > best);
      submitTriviaScore(score);
      setPhase("done");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase]);

  function pickAnswer(oi) {
    if (locked || !pool.length) return;
    playClick();
    setSelected(oi);
    setLocked(true);
    const current = pool[index % pool.length];
    const correct = oi === current.correctIndex;
    if (correct) {
      playCorrect();
      setScore((s) => s + 1);
      setRoundStreak((s) => s + 1);
      bumpCombo();
    } else {
      playWrong();
      setRoundStreak(0);
      resetCombo();
    }
    setTimeout(() => {
      setIndex((i) => i + 1);
      setSelected(null);
      setLocked(false);
    }, 550);
  }

  if (phase === "intro") {
    return (
      <div className="rounded-2xl border border-nebula/30 bg-panel p-8 text-center max-w-md mx-auto">
        <div className="text-3xl mb-3">⚡</div>
        <h2 className="font-display text-2xl text-text">{t("trivia.title")}</h2>
        <p className="text-muted text-sm mt-3 leading-relaxed">{t("trivia.subtitle")}</p>
        {best > 0 && (
          <p className="text-starlight text-sm mt-4 font-mono">
            {t("trivia.best_label")}: {best}
          </p>
        )}
        <button
          onClick={start}
          className="mt-6 px-6 py-3 rounded-full bg-nebula text-void font-medium hover:bg-nebulaSoft transition shadow-glow"
        >
          {t("trivia.start_button")}
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="rounded-2xl border border-starlight/40 bg-panel p-8 text-center max-w-md mx-auto shadow-glowGold">
        <div className="text-3xl mb-3">🏁</div>
        <h2 className="font-display text-2xl text-text">{t("trivia.time_up_heading")}</h2>
        <div className="mt-4">
          <div className="text-xs uppercase tracking-widest text-muted">{t("trivia.final_score")}</div>
          <div className="font-mono text-4xl text-starlight mt-1">{score}</div>
        </div>
        {justBeatBest && <p className="text-verified text-sm mt-3 font-medium">{t("trivia.new_best")}</p>}
        <p className="text-muted text-xs mt-2">
          {t("trivia.best_label")}: {Math.max(score, best)}
        </p>
        <button
          onClick={start}
          className="mt-6 px-6 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition"
        >
          {t("trivia.play_again")}
        </button>
      </div>
    );
  }

  const current = pool[index % pool.length];
  if (!current) return null;

  return (
    <div className="rounded-2xl border border-nebula/30 bg-panel p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-4 text-xs font-mono">
        <span className="text-starlight">
          ⏱ {t("trivia.time_left")}: {timeLeft}s
        </span>
        <span className="text-nebulaSoft">
          {t("trivia.score_label")}: {score}
        </span>
        {roundStreak >= 2 && <span className="text-verified">🔥 {roundStreak}</span>}
      </div>

      <p className="text-text text-sm mb-4">{t(current.promptKey)}</p>

      <div className="grid gap-2">
        {current.optionKeys.map((optKey, oi) => {
          let stateClass = "border-white/10 hover:border-white/25";
          if (locked) {
            if (oi === current.correctIndex) stateClass = "border-verified/60 bg-verified/10";
            else if (oi === selected) stateClass = "border-starlight/60 bg-starlight/10";
          }
          return (
            <button
              key={oi}
              onClick={() => pickAnswer(oi)}
              disabled={locked}
              className={`text-left px-4 py-2.5 rounded-lg border text-sm transition ${stateClass}`}
            >
              {t(optKey)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
