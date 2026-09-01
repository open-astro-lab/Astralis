import { useTranslation } from "react-i18next";
import Quiz from "./Quiz.jsx";
import { dayOfYear, todayISO } from "../lib/date.js";

// A curated pool of real, already-verified questions spanning every module.
// The day-of-year picks a different one each day; with 20 entries the
// rotation genuinely varies week to week rather than repeating immediately.
const POOL = [
  { promptKey: "physics_lab.escape_velocity.quiz.q1.prompt", opts: "physics_lab.escape_velocity.quiz.q1", correctIndex: 1, explainKey: "physics_lab.escape_velocity.quiz.q1.explain" },
  { promptKey: "physics_lab.orbital_velocity.quiz.q1.prompt", opts: "physics_lab.orbital_velocity.quiz.q1", correctIndex: 0, explainKey: "physics_lab.orbital_velocity.quiz.q1.explain" },
  { promptKey: "physics_lab.kepler.quiz.q1.prompt", opts: "physics_lab.kepler.quiz.q1", correctIndex: 2, explainKey: "physics_lab.kepler.quiz.q1.explain" },
  { promptKey: "physics_lab.inverse_square.quiz.q1.prompt", opts: "physics_lab.inverse_square.quiz.q1", correctIndex: 1, explainKey: "physics_lab.inverse_square.quiz.q1.explain" },
  { promptKey: "physics_lab.wien.quiz.q1.prompt", opts: "physics_lab.wien.quiz.q1", correctIndex: 0, explainKey: "physics_lab.wien.quiz.q1.explain" },
  { promptKey: "physics_lab.stefan_boltzmann.quiz.q1.prompt", opts: "physics_lab.stefan_boltzmann.quiz.q1", correctIndex: 2, explainKey: "physics_lab.stefan_boltzmann.quiz.q1.explain" },
  { promptKey: "universe_explorer.quiz.q1.prompt", opts: "universe_explorer.quiz.q1", correctIndex: 1, explainKey: "universe_explorer.quiz.q1.explain" },
  { promptKey: "universe_explorer.quiz.q3.prompt", opts: "universe_explorer.quiz.q3", correctIndex: 0, explainKey: "universe_explorer.quiz.q3.explain" },
  { promptKey: "sky_explorer.constellations.orion.quiz.q1.prompt", opts: "sky_explorer.constellations.orion.quiz.q1", correctIndex: 0, explainKey: "sky_explorer.constellations.orion.quiz.q1.explain" },
  { promptKey: "sky_explorer.constellations.leo.quiz.q1.prompt", opts: "sky_explorer.constellations.leo.quiz.q1", correctIndex: 0, explainKey: "sky_explorer.constellations.leo.quiz.q1.explain" },
  { promptKey: "sky_explorer.constellations.scorpius.quiz.q1.prompt", opts: "sky_explorer.constellations.scorpius.quiz.q1", correctIndex: 0, explainKey: "sky_explorer.constellations.scorpius.quiz.q1.explain" },
  { promptKey: "sky_explorer.constellations.taurus.quiz.q1.prompt", opts: "sky_explorer.constellations.taurus.quiz.q1", correctIndex: 0, explainKey: "sky_explorer.constellations.taurus.quiz.q1.explain" },
  { promptKey: "sky_explorer.constellations.cygnus.quiz.q1.prompt", opts: "sky_explorer.constellations.cygnus.quiz.q1", correctIndex: 0, explainKey: "sky_explorer.constellations.cygnus.quiz.q1.explain" },
  { promptKey: "asteroid_hunter.quiz.q1.prompt", opts: "asteroid_hunter.quiz.q1", correctIndex: 0, explainKey: "asteroid_hunter.quiz.q1.explain" },
  { promptKey: "asteroid_hunter.classify.quiz.q1.prompt", opts: "asteroid_hunter.classify.quiz.q1", correctIndex: 0, explainKey: "asteroid_hunter.classify.quiz.q1.explain" },
  { promptKey: "asteroid_hunter.rotation.quiz.q1.prompt", opts: "asteroid_hunter.rotation.quiz.q1", correctIndex: 0, explainKey: "asteroid_hunter.rotation.quiz.q1.explain" },
  { promptKey: "exoplanet_hunter.quiz.q1.prompt", opts: "exoplanet_hunter.quiz.q1", correctIndex: 1, explainKey: "exoplanet_hunter.quiz.q1.explain" },
  { promptKey: "exoplanet_hunter.radial_velocity.quiz.q1.prompt", opts: "exoplanet_hunter.radial_velocity.quiz.q1", correctIndex: 0, explainKey: "exoplanet_hunter.radial_velocity.quiz.q1.explain" },
  { promptKey: "exoplanet_hunter.habitable_zone.quiz.q1.prompt", opts: "exoplanet_hunter.habitable_zone.quiz.q1", correctIndex: 0, explainKey: "exoplanet_hunter.habitable_zone.quiz.q1.explain" },
  { promptKey: "stellar_detective.quiz.q1.prompt", opts: "stellar_detective.quiz.q1", correctIndex: 2, explainKey: "stellar_detective.quiz.q1.explain" },
];

export default function DailyChallenge() {
  const { t } = useTranslation();
  const today = new Date();
  const dateKey = todayISO(today);
  const entry = POOL[dayOfYear(today) % POOL.length];

  const question = {
    id: `daily_${dateKey}`,
    promptKey: entry.promptKey,
    optionKeys: [`${entry.opts}.opt1`, `${entry.opts}.opt2`, `${entry.opts}.opt3`],
    correctIndex: entry.correctIndex,
    explainKey: entry.explainKey,
  };

  return (
    <div className="rounded-2xl border border-nebula/30 bg-panel p-6 mb-10">
      <div className="text-xs uppercase tracking-widest text-nebulaSoft mb-3">
        {t("home.daily_challenge_heading")} · {dateKey}
      </div>
      <Quiz
        questions={[question]}
        category="dailyChallenges"
        activityId={`daily_${dateKey}`}
      />
    </div>
  );
}
