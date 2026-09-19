import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import { useSound } from "../../context/SoundContext.jsx";
import { JOKE_IDS } from "./jokeData.js";

/**
 * Cosmic Comedy – learn real astronomy through clean, funny jokes.
 * Interactive: setup → reveal punchline → science takeaway.
 */
export default function CosmicComedy() {
  const { t } = useTranslation();
  const { passport, complete } = usePassport();
  const { playClick, playCorrect } = useSound();

  const completed = useMemo(
    () => new Set(passport?.cosmicComedy || []),
    [passport]
  );

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [showScience, setShowScience] = useState(false);

  const jokeId = JOKE_IDS[index];
  const isDone = completed.has(jokeId);
  const total = JOKE_IDS.length;
  const doneCount = completed.size;

  function reveal() {
    playClick();
    setRevealed(true);
  }

  function learnScience() {
    playClick();
    setShowScience(true);
    if (!isDone) {
      playCorrect();
      complete("cosmicComedy", jokeId);
    }
  }

  function goNext() {
    playClick();
    const next = (index + 1) % total;
    setIndex(next);
    setRevealed(false);
    setShowScience(false);
  }

  function goPrev() {
    playClick();
    const prev = (index - 1 + total) % total;
    setIndex(prev);
    setRevealed(false);
    setShowScience(false);
  }

  function jumpTo(i) {
    playClick();
    setIndex(i);
    setRevealed(false);
    setShowScience(false);
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {t("cosmic_comedy.progress", { done: doneCount, total })}
        </p>
        <div className="flex-1 h-2 rounded-full bg-panel overflow-hidden max-w-[180px]">
          <div
            className="h-full bg-nebula transition-all duration-500"
            style={{ width: `${(doneCount / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Joke card */}
      <div className="rounded-2xl border border-nebula/30 bg-panel p-6 sm:p-8 shadow-glow">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">😄</span>
          <span className="text-xs uppercase tracking-widest text-nebulaSoft font-medium">
            {t(`cosmic_comedy.jokes.${jokeId}.topic`)}
          </span>
          {isDone && (
            <span className="ml-auto text-xs text-verified bg-verified/10 border border-verified/30 px-2 py-0.5 rounded-full">
              {t("cosmic_comedy.learned")}
            </span>
          )}
        </div>

        {/* Setup */}
        <p className="font-display text-xl sm:text-2xl text-text leading-snug mb-6">
          {t(`cosmic_comedy.jokes.${jokeId}.setup`)}
        </p>

        {/* Punchline area */}
        {!revealed ? (
          <button
            onClick={reveal}
            className="w-full py-4 rounded-xl bg-nebula text-void font-semibold text-base hover:bg-nebulaSoft active:scale-[0.98] transition shadow-md shadow-nebula/30"
          >
            {t("cosmic_comedy.reveal_button")}
          </button>
        ) : (
          <div className="space-y-5">
            <div className="rounded-xl bg-starlight/10 border border-starlight/30 px-5 py-4">
              <p className="text-starlight font-medium text-lg leading-snug">
                {t(`cosmic_comedy.jokes.${jokeId}.punchline`)}
              </p>
            </div>

            {!showScience ? (
              <button
                onClick={learnScience}
                className="w-full py-3.5 rounded-xl border-2 border-nebula/50 text-nebulaSoft font-medium hover:bg-nebula/10 transition"
              >
                {t("cosmic_comedy.science_button")}
              </button>
            ) : (
              <div className="rounded-xl bg-void/60 border border-white/10 px-5 py-4 space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted">
                  {t("cosmic_comedy.science_label")}
                </p>
                <p className="text-text text-sm sm:text-base leading-relaxed">
                  {t(`cosmic_comedy.jokes.${jokeId}.science`)}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          onClick={goPrev}
          className="px-4 py-2.5 rounded-xl border border-white/15 text-muted hover:text-text transition text-sm"
        >
          ← {t("cosmic_comedy.prev")}
        </button>
        <span className="text-sm text-muted font-mono">
          {index + 1} / {total}
        </span>
        <button
          onClick={goNext}
          className="px-4 py-2.5 rounded-xl border border-white/15 text-muted hover:text-text transition text-sm"
        >
          {t("cosmic_comedy.next")} →
        </button>
      </div>

      {/* Joke picker dots */}
      <div className="mt-8 flex flex-wrap justify-center gap-1.5">
        {JOKE_IDS.map((id, i) => (
          <button
            key={id}
            onClick={() => jumpTo(i)}
            title={t(`cosmic_comedy.jokes.${id}.topic`)}
            className={`w-2.5 h-2.5 rounded-full transition ${
              i === index
                ? "bg-nebula scale-125"
                : completed.has(id)
                ? "bg-verified/70"
                : "bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted mt-4">
        {t("cosmic_comedy.hint")}
      </p>
    </div>
  );
}
