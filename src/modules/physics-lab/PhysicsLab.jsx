import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import MissionsPanel from "../../components/MissionsPanel.jsx";
import FormulaChallenge from "./FormulaChallenge.jsx";

const G = 6.6743e-11;

const FORMULA_IDS = ["escape_velocity", "orbital_velocity", "keplers_third_law", "inverse_square_law", "wiens_law", "stefan_boltzmann", "doppler_shift", "angular_size", "surface_gravity", "density", "schwarzschild_radius", "hubble_law", "parallax", "photon_energy", "synodic_period", "rocket_equation"];
const FORMULA_NAME_KEYS = {
  escape_velocity: "physics_lab.escape_velocity.title",
  orbital_velocity: "physics_lab.orbital_velocity.title",
  keplers_third_law: "physics_lab.kepler.title",
  inverse_square_law: "physics_lab.inverse_square.title",
  wiens_law: "physics_lab.wien.title",
  stefan_boltzmann: "physics_lab.stefan_boltzmann.title",
  doppler_shift: "physics_lab.doppler_shift.title",
  angular_size: "physics_lab.angular_size.title",
  surface_gravity: "physics_lab.surface_gravity.title",
  density: "physics_lab.density.title",
  schwarzschild_radius: "physics_lab.schwarzschild_radius.title",
  hubble_law: "physics_lab.hubble_law.title",
  parallax: "physics_lab.parallax.title",
  photon_energy: "physics_lab.photon_energy.title",
  synodic_period: "physics_lab.synodic_period.title",
  rocket_equation: "physics_lab.rocket_equation.title",
};

export default function PhysicsLab() {
  const { t } = useTranslation();
  const { passport } = usePassport();
  const refs = {
    escape_velocity: useRef(null),
    orbital_velocity: useRef(null),
    keplers_third_law: useRef(null),
    inverse_square_law: useRef(null),
    wiens_law: useRef(null),
    stefan_boltzmann: useRef(null),
    doppler_shift: useRef(null),
    angular_size: useRef(null),
    surface_gravity: useRef(null),
    density: useRef(null),
    schwarzschild_radius: useRef(null),
    hubble_law: useRef(null),
    parallax: useRef(null),
    photon_energy: useRef(null),
    synodic_period: useRef(null),
    rocket_equation: useRef(null),
  };

  function scrollToNext(currentId) {
    const idx = FORMULA_IDS.indexOf(currentId);
    const nextId = FORMULA_IDS[idx + 1];
    if (nextId && refs[nextId].current) {
      refs[nextId].current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function nextLabelFor(currentId) {
    const idx = FORMULA_IDS.indexOf(currentId);
    const nextId = FORMULA_IDS[idx + 1];
    if (!nextId) return null;
    return t("physics_lab.next_formula", { name: t(FORMULA_NAME_KEYS[nextId]) });
  }

  const done = passport?.physicsChallenges || [];
  const revealedCount = done.filter((d) => !d.endsWith("_precision") && !d.endsWith("_quiz")).length;
  const precisionCount = done.filter((d) => d.endsWith("_precision")).length;
  const quizCount = done.filter((d) => d.endsWith("_quiz")).length;

  const missions = [
    { id: "reveal_8", labelKey: "physics_lab.missions.reveal_8", done: revealedCount >= 8 },
    { id: "precision_5", labelKey: "physics_lab.missions.precision_5", done: precisionCount >= 5 },
    { id: "quiz_10", labelKey: "physics_lab.missions.quiz_10", done: quizCount >= 10 },
    { id: "master_all", labelKey: "physics_lab.missions.master_all", done: revealedCount >= 16 },
  ];

  return (
    <div className="space-y-10">
      <MissionsPanel headingKey="physics_lab.missions_heading" missions={missions} category="dailyChallenges" />
      {/* 1. Escape velocity */}
      <div ref={refs.escape_velocity}>
        <FormulaChallenge
          id="escape_velocity"
          titleKey="physics_lab.escape_velocity.title"
          promptKey="physics_lab.escape_velocity.prompt"
          resultLabelKey="physics_lab.escape_velocity.result_label"
          sanityCheckKey="physics_lab.escape_velocity.sanity_check"
          formulaText="v = √(2GM / R)"
          formulaExplainerKey="physics_lab.escape_velocity.formula_explainer"
          resultUnit="km/s"
          inputs={[
            { key: "massE24", labelKey: "physics_lab.escape_velocity.mass_label", min: 0.01, max: 2000, step: 0.01, unit: "× 10²⁴ kg", initial: 5.972 },
            { key: "radiusKm", labelKey: "physics_lab.escape_velocity.radius_label", min: 100, max: 80000, step: 10, unit: "km", initial: 6371 },
          ]}
          compute={({ massE24, radiusKm }) => {
            const massKg = massE24 * 1e24;
            const radiusM = radiusKm * 1000;
            return Math.sqrt((2 * G * massKg) / radiusM) / 1000;
          }}
          quizQuestions={[
            { id: "ev_q1", promptKey: "physics_lab.escape_velocity.quiz.q1.prompt", optionKeys: ["physics_lab.escape_velocity.quiz.q1.opt1", "physics_lab.escape_velocity.quiz.q1.opt2", "physics_lab.escape_velocity.quiz.q1.opt3"], correctIndex: 1, explainKey: "physics_lab.escape_velocity.quiz.q1.explain" },
            { id: "ev_q2", promptKey: "physics_lab.escape_velocity.quiz.q2.prompt", optionKeys: ["physics_lab.escape_velocity.quiz.q2.opt1", "physics_lab.escape_velocity.quiz.q2.opt2", "physics_lab.escape_velocity.quiz.q2.opt3"], correctIndex: 1, explainKey: "physics_lab.escape_velocity.quiz.q2.explain" },
            { id: "ev_q3", promptKey: "physics_lab.escape_velocity.quiz.q3.prompt", optionKeys: ["physics_lab.escape_velocity.quiz.q3.opt1", "physics_lab.escape_velocity.quiz.q3.opt2", "physics_lab.escape_velocity.quiz.q3.opt3"], correctIndex: 0, explainKey: "physics_lab.escape_velocity.quiz.q3.explain" },
            { id: "ev_q4", promptKey: "physics_lab.escape_velocity.quiz.q4.prompt", optionKeys: ["physics_lab.escape_velocity.quiz.q4.opt1", "physics_lab.escape_velocity.quiz.q4.opt2", "physics_lab.escape_velocity.quiz.q4.opt3"], correctIndex: 0, explainKey: "physics_lab.escape_velocity.quiz.q4.explain" },
            { id: "ev_q5", promptKey: "physics_lab.escape_velocity.quiz.q5.prompt", optionKeys: ["physics_lab.escape_velocity.quiz.q5.opt1", "physics_lab.escape_velocity.quiz.q5.opt2", "physics_lab.escape_velocity.quiz.q5.opt3"], correctIndex: 1, explainKey: "physics_lab.escape_velocity.quiz.q5.explain" },
            { id: "ev_q6", promptKey: "physics_lab.escape_velocity.quiz.q6.prompt", optionKeys: ["physics_lab.escape_velocity.quiz.q6.opt1", "physics_lab.escape_velocity.quiz.q6.opt2", "physics_lab.escape_velocity.quiz.q6.opt3"], correctIndex: 0, explainKey: "physics_lab.escape_velocity.quiz.q6.explain" },
          ]}
          challengeLabelKey="physics_lab.escape_velocity.challenge_label"
          challengeTarget={5.03}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("escape_velocity")}
          onNext={() => scrollToNext("escape_velocity")}
        />
      </div>

      {/* 2. Orbital velocity */}
      <div ref={refs.orbital_velocity}>
        <FormulaChallenge
          id="orbital_velocity"
          titleKey="physics_lab.orbital_velocity.title"
          promptKey="physics_lab.orbital_velocity.prompt"
          resultLabelKey="physics_lab.orbital_velocity.result_label"
          sanityCheckKey="physics_lab.orbital_velocity.sanity_check"
          formulaText="v = √(GM / r)"
          formulaExplainerKey="physics_lab.orbital_velocity.formula_explainer"
          resultUnit="km/s"
          inputs={[
            { key: "massE24", labelKey: "physics_lab.orbital_velocity.mass_label", min: 0.01, max: 2000, step: 0.01, unit: "× 10²⁴ kg", initial: 5.972 },
            { key: "orbitKm", labelKey: "physics_lab.orbital_velocity.orbit_label", min: 6500, max: 100000, step: 10, unit: "km", initial: 6771 },
          ]}
          compute={({ massE24, orbitKm }) => {
            const massKg = massE24 * 1e24;
            const rM = orbitKm * 1000;
            return Math.sqrt((G * massKg) / rM) / 1000;
          }}
          quizQuestions={[
            { id: "ov_q1", promptKey: "physics_lab.orbital_velocity.quiz.q1.prompt", optionKeys: ["physics_lab.orbital_velocity.quiz.q1.opt1", "physics_lab.orbital_velocity.quiz.q1.opt2", "physics_lab.orbital_velocity.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.orbital_velocity.quiz.q1.explain" },
            { id: "ov_q2", promptKey: "physics_lab.orbital_velocity.quiz.q2.prompt", optionKeys: ["physics_lab.orbital_velocity.quiz.q2.opt1", "physics_lab.orbital_velocity.quiz.q2.opt2", "physics_lab.orbital_velocity.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.orbital_velocity.quiz.q2.explain" },
            { id: "ov_q3", promptKey: "physics_lab.orbital_velocity.quiz.q3.prompt", optionKeys: ["physics_lab.orbital_velocity.quiz.q3.opt1", "physics_lab.orbital_velocity.quiz.q3.opt2", "physics_lab.orbital_velocity.quiz.q3.opt3"], correctIndex: 1, explainKey: "physics_lab.orbital_velocity.quiz.q3.explain" },
            { id: "ov_q4", promptKey: "physics_lab.orbital_velocity.quiz.q4.prompt", optionKeys: ["physics_lab.orbital_velocity.quiz.q4.opt1", "physics_lab.orbital_velocity.quiz.q4.opt2", "physics_lab.orbital_velocity.quiz.q4.opt3"], correctIndex: 0, explainKey: "physics_lab.orbital_velocity.quiz.q4.explain" },
            { id: "ov_q5", promptKey: "physics_lab.orbital_velocity.quiz.q5.prompt", optionKeys: ["physics_lab.orbital_velocity.quiz.q5.opt1", "physics_lab.orbital_velocity.quiz.q5.opt2", "physics_lab.orbital_velocity.quiz.q5.opt3"], correctIndex: 0, explainKey: "physics_lab.orbital_velocity.quiz.q5.explain" },
            { id: "ov_q6", promptKey: "physics_lab.orbital_velocity.quiz.q6.prompt", optionKeys: ["physics_lab.orbital_velocity.quiz.q6.opt1", "physics_lab.orbital_velocity.quiz.q6.opt2", "physics_lab.orbital_velocity.quiz.q6.opt3"], correctIndex: 1, explainKey: "physics_lab.orbital_velocity.quiz.q6.explain" },
          ]}
          challengeLabelKey="physics_lab.orbital_velocity.challenge_label"
          challengeTarget={3.07}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("orbital_velocity")}
          onNext={() => scrollToNext("orbital_velocity")}
        />
      </div>

      {/* 3. Kepler's Third Law */}
      <div ref={refs.keplers_third_law}>
        <FormulaChallenge
          id="keplers_third_law"
          titleKey="physics_lab.kepler.title"
          promptKey="physics_lab.kepler.prompt"
          resultLabelKey="physics_lab.kepler.result_label"
          sanityCheckKey="physics_lab.kepler.sanity_check"
          formulaText="T² ∝ a³  (T in years, a in AU, around the Sun)"
          formulaExplainerKey="physics_lab.kepler.formula_explainer"
          resultUnit="years"
          inputs={[{ key: "auDistance", labelKey: "physics_lab.kepler.distance_label", min: 0.1, max: 40, step: 0.1, unit: "AU", initial: 1 }]}
          compute={({ auDistance }) => Math.sqrt(Math.pow(auDistance, 3))}
          quizQuestions={[
            { id: "kepler_q1", promptKey: "physics_lab.kepler.quiz.q1.prompt", optionKeys: ["physics_lab.kepler.quiz.q1.opt1", "physics_lab.kepler.quiz.q1.opt2", "physics_lab.kepler.quiz.q1.opt3"], correctIndex: 2, explainKey: "physics_lab.kepler.quiz.q1.explain" },
            { id: "kepler_q2", promptKey: "physics_lab.kepler.quiz.q2.prompt", optionKeys: ["physics_lab.kepler.quiz.q2.opt1", "physics_lab.kepler.quiz.q2.opt2", "physics_lab.kepler.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.kepler.quiz.q2.explain" },
            { id: "kepler_q3", promptKey: "physics_lab.kepler.quiz.q3.prompt", optionKeys: ["physics_lab.kepler.quiz.q3.opt1", "physics_lab.kepler.quiz.q3.opt2", "physics_lab.kepler.quiz.q3.opt3"], correctIndex: 0, explainKey: "physics_lab.kepler.quiz.q3.explain" },
            { id: "kepler_q4", promptKey: "physics_lab.kepler.quiz.q4.prompt", optionKeys: ["physics_lab.kepler.quiz.q4.opt1", "physics_lab.kepler.quiz.q4.opt2", "physics_lab.kepler.quiz.q4.opt3"], correctIndex: 0, explainKey: "physics_lab.kepler.quiz.q4.explain" },
            { id: "kepler_q5", promptKey: "physics_lab.kepler.quiz.q5.prompt", optionKeys: ["physics_lab.kepler.quiz.q5.opt1", "physics_lab.kepler.quiz.q5.opt2", "physics_lab.kepler.quiz.q5.opt3"], correctIndex: 0, explainKey: "physics_lab.kepler.quiz.q5.explain" },
            { id: "kepler_q6", promptKey: "physics_lab.kepler.quiz.q6.prompt", optionKeys: ["physics_lab.kepler.quiz.q6.opt1", "physics_lab.kepler.quiz.q6.opt2", "physics_lab.kepler.quiz.q6.opt3"], correctIndex: 0, explainKey: "physics_lab.kepler.quiz.q6.explain" },
          ]}
          challengeLabelKey="physics_lab.kepler.challenge_label"
          challengeTarget={11.86}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("keplers_third_law")}
          onNext={() => scrollToNext("keplers_third_law")}
        />
      </div>

      {/* 4. Inverse-square law */}
      <div ref={refs.inverse_square_law}>
        <FormulaChallenge
          id="inverse_square_law"
          titleKey="physics_lab.inverse_square.title"
          promptKey="physics_lab.inverse_square.prompt"
          resultLabelKey="physics_lab.inverse_square.result_label"
          sanityCheckKey="physics_lab.inverse_square.sanity_check"
          formulaText="b = L / (4πd²)"
          formulaExplainerKey="physics_lab.inverse_square.formula_explainer"
          resultUnit="× baseline brightness"
          inputs={[{ key: "distanceRatio", labelKey: "physics_lab.inverse_square.distance_label", min: 0.5, max: 10, step: 0.1, unit: "× original distance", initial: 1 }]}
          compute={({ distanceRatio }) => 1 / (distanceRatio * distanceRatio)}
          quizQuestions={[
            { id: "isl_q1", promptKey: "physics_lab.inverse_square.quiz.q1.prompt", optionKeys: ["physics_lab.inverse_square.quiz.q1.opt1", "physics_lab.inverse_square.quiz.q1.opt2", "physics_lab.inverse_square.quiz.q1.opt3"], correctIndex: 1, explainKey: "physics_lab.inverse_square.quiz.q1.explain" },
            { id: "isl_q2", promptKey: "physics_lab.inverse_square.quiz.q2.prompt", optionKeys: ["physics_lab.inverse_square.quiz.q2.opt1", "physics_lab.inverse_square.quiz.q2.opt2", "physics_lab.inverse_square.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.inverse_square.quiz.q2.explain" },
            { id: "isl_q3", promptKey: "physics_lab.inverse_square.quiz.q3.prompt", optionKeys: ["physics_lab.inverse_square.quiz.q3.opt1", "physics_lab.inverse_square.quiz.q3.opt2", "physics_lab.inverse_square.quiz.q3.opt3"], correctIndex: 1, explainKey: "physics_lab.inverse_square.quiz.q3.explain" },
            { id: "isl_q4", promptKey: "physics_lab.inverse_square.quiz.q4.prompt", optionKeys: ["physics_lab.inverse_square.quiz.q4.opt1", "physics_lab.inverse_square.quiz.q4.opt2", "physics_lab.inverse_square.quiz.q4.opt3"], correctIndex: 0, explainKey: "physics_lab.inverse_square.quiz.q4.explain" },
            { id: "isl_q5", promptKey: "physics_lab.inverse_square.quiz.q5.prompt", optionKeys: ["physics_lab.inverse_square.quiz.q5.opt1", "physics_lab.inverse_square.quiz.q5.opt2", "physics_lab.inverse_square.quiz.q5.opt3"], correctIndex: 0, explainKey: "physics_lab.inverse_square.quiz.q5.explain" },
            { id: "isl_q6", promptKey: "physics_lab.inverse_square.quiz.q6.prompt", optionKeys: ["physics_lab.inverse_square.quiz.q6.opt1", "physics_lab.inverse_square.quiz.q6.opt2", "physics_lab.inverse_square.quiz.q6.opt3"], correctIndex: 0, explainKey: "physics_lab.inverse_square.quiz.q6.explain" },
          ]}
          challengeLabelKey="physics_lab.inverse_square.challenge_label"
          challengeTarget={0.25}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("inverse_square_law")}
          onNext={() => scrollToNext("inverse_square_law")}
        />
      </div>

      {/* 5. Wien's Law */}
      <div ref={refs.wiens_law}>
        <FormulaChallenge
          id="wiens_law"
          titleKey="physics_lab.wien.title"
          promptKey="physics_lab.wien.prompt"
          resultLabelKey="physics_lab.wien.result_label"
          sanityCheckKey="physics_lab.wien.sanity_check"
          formulaText="λ_max = b / T   (b ≈ 2,897,771 nm·K)"
          formulaExplainerKey="physics_lab.wien.formula_explainer"
          resultUnit="nm"
          inputs={[{ key: "tempK", labelKey: "physics_lab.wien.temp_label", min: 500, max: 40000, step: 10, unit: "K", initial: 5778 }]}
          compute={({ tempK }) => 2897771 / tempK}
          quizQuestions={[
            { id: "wien_q1", promptKey: "physics_lab.wien.quiz.q1.prompt", optionKeys: ["physics_lab.wien.quiz.q1.opt1", "physics_lab.wien.quiz.q1.opt2", "physics_lab.wien.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.wien.quiz.q1.explain" },
            { id: "wien_q2", promptKey: "physics_lab.wien.quiz.q2.prompt", optionKeys: ["physics_lab.wien.quiz.q2.opt1", "physics_lab.wien.quiz.q2.opt2", "physics_lab.wien.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.wien.quiz.q2.explain" },
            { id: "wien_q3", promptKey: "physics_lab.wien.quiz.q3.prompt", optionKeys: ["physics_lab.wien.quiz.q3.opt1", "physics_lab.wien.quiz.q3.opt2", "physics_lab.wien.quiz.q3.opt3"], correctIndex: 0, explainKey: "physics_lab.wien.quiz.q3.explain" },
            { id: "wien_q4", promptKey: "physics_lab.wien.quiz.q4.prompt", optionKeys: ["physics_lab.wien.quiz.q4.opt1", "physics_lab.wien.quiz.q4.opt2", "physics_lab.wien.quiz.q4.opt3"], correctIndex: 0, explainKey: "physics_lab.wien.quiz.q4.explain" },
            { id: "wien_q5", promptKey: "physics_lab.wien.quiz.q5.prompt", optionKeys: ["physics_lab.wien.quiz.q5.opt1", "physics_lab.wien.quiz.q5.opt2", "physics_lab.wien.quiz.q5.opt3"], correctIndex: 0, explainKey: "physics_lab.wien.quiz.q5.explain" },
            { id: "wien_q6", promptKey: "physics_lab.wien.quiz.q6.prompt", optionKeys: ["physics_lab.wien.quiz.q6.opt1", "physics_lab.wien.quiz.q6.opt2", "physics_lab.wien.quiz.q6.opt3"], correctIndex: 0, explainKey: "physics_lab.wien.quiz.q6.explain" },
          ]}
          challengeLabelKey="physics_lab.wien.challenge_label"
          challengeTarget={828}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("wiens_law")}
          onNext={() => scrollToNext("wiens_law")}
        />
      </div>

      {/* 6. Stefan–Boltzmann Law */}
      <div ref={refs.stefan_boltzmann}>
        <FormulaChallenge
          id="stefan_boltzmann"
          titleKey="physics_lab.stefan_boltzmann.title"
          promptKey="physics_lab.stefan_boltzmann.prompt"
          resultLabelKey="physics_lab.stefan_boltzmann.result_label"
          sanityCheckKey="physics_lab.stefan_boltzmann.sanity_check"
          formulaText="L = 4πR²σT⁴  →  (in solar units) L = R² × T⁴"
          formulaExplainerKey="physics_lab.stefan_boltzmann.formula_explainer"
          resultUnit="× Sun's luminosity"
          inputs={[
            { key: "radiusRatio", labelKey: "physics_lab.stefan_boltzmann.radius_label", min: 0.01, max: 1000, step: 0.01, unit: "× R☉", initial: 1 },
            { key: "tempRatio", labelKey: "physics_lab.stefan_boltzmann.temp_label", min: 0.1, max: 10, step: 0.01, unit: "× T☉", initial: 1 },
          ]}
          compute={({ radiusRatio, tempRatio }) => Math.pow(radiusRatio, 2) * Math.pow(tempRatio, 4)}
          quizQuestions={[
            { id: "sb_q1", promptKey: "physics_lab.stefan_boltzmann.quiz.q1.prompt", optionKeys: ["physics_lab.stefan_boltzmann.quiz.q1.opt1", "physics_lab.stefan_boltzmann.quiz.q1.opt2", "physics_lab.stefan_boltzmann.quiz.q1.opt3"], correctIndex: 2, explainKey: "physics_lab.stefan_boltzmann.quiz.q1.explain" },
            { id: "sb_q2", promptKey: "physics_lab.stefan_boltzmann.quiz.q2.prompt", optionKeys: ["physics_lab.stefan_boltzmann.quiz.q2.opt1", "physics_lab.stefan_boltzmann.quiz.q2.opt2", "physics_lab.stefan_boltzmann.quiz.q2.opt3"], correctIndex: 1, explainKey: "physics_lab.stefan_boltzmann.quiz.q2.explain" },
            { id: "sb_q3", promptKey: "physics_lab.stefan_boltzmann.quiz.q3.prompt", optionKeys: ["physics_lab.stefan_boltzmann.quiz.q3.opt1", "physics_lab.stefan_boltzmann.quiz.q3.opt2", "physics_lab.stefan_boltzmann.quiz.q3.opt3"], correctIndex: 0, explainKey: "physics_lab.stefan_boltzmann.quiz.q3.explain" },
            { id: "sb_q4", promptKey: "physics_lab.stefan_boltzmann.quiz.q4.prompt", optionKeys: ["physics_lab.stefan_boltzmann.quiz.q4.opt1", "physics_lab.stefan_boltzmann.quiz.q4.opt2", "physics_lab.stefan_boltzmann.quiz.q4.opt3"], correctIndex: 0, explainKey: "physics_lab.stefan_boltzmann.quiz.q4.explain" },
            { id: "sb_q5", promptKey: "physics_lab.stefan_boltzmann.quiz.q5.prompt", optionKeys: ["physics_lab.stefan_boltzmann.quiz.q5.opt1", "physics_lab.stefan_boltzmann.quiz.q5.opt2", "physics_lab.stefan_boltzmann.quiz.q5.opt3"], correctIndex: 0, explainKey: "physics_lab.stefan_boltzmann.quiz.q5.explain" },
          ]}
          challengeLabelKey="physics_lab.stefan_boltzmann.challenge_label"
          challengeTarget={16}
          challengeTolerance={0.08}
          nextLabel={nextLabelFor("stefan_boltzmann")}
          onNext={() => scrollToNext("stefan_boltzmann")}
        />
      </div>

      {/* 7. Doppler Shift */}
      <div ref={refs.doppler_shift}>
        <FormulaChallenge
          id="doppler_shift"
          titleKey="physics_lab.doppler_shift.title"
          promptKey="physics_lab.doppler_shift.prompt"
          resultLabelKey="physics_lab.doppler_shift.result_label"
          sanityCheckKey="physics_lab.doppler_shift.sanity_check"
          formulaText="Δλ/λ = v/c"
          formulaExplainerKey="physics_lab.doppler_shift.formula_explainer"
          resultUnit="nm shift (at 500nm baseline)"
          inputs={[{ key: "velocity", labelKey: "physics_lab.doppler_shift.velocity_label", min: -300, max: 300, step: 1, unit: "km/s", initial: 20 }]}
          compute={({ velocity }) => (velocity / 299792.458) * 500}
          quizQuestions={[
            { id: "doppler_q1", promptKey: "physics_lab.doppler_shift.quiz.q1.prompt", optionKeys: ["physics_lab.doppler_shift.quiz.q1.opt1", "physics_lab.doppler_shift.quiz.q1.opt2", "physics_lab.doppler_shift.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.doppler_shift.quiz.q1.explain" },
            { id: "doppler_q2", promptKey: "physics_lab.doppler_shift.quiz.q2.prompt", optionKeys: ["physics_lab.doppler_shift.quiz.q2.opt1", "physics_lab.doppler_shift.quiz.q2.opt2", "physics_lab.doppler_shift.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.doppler_shift.quiz.q2.explain" },
          ]}
          challengeLabelKey="physics_lab.doppler_shift.challenge_label"
          challengeTarget={0.167}
          challengeTolerance={0.1}
          nextLabel={nextLabelFor("doppler_shift")}
          onNext={() => scrollToNext("doppler_shift")}
        />
      </div>

      {/* 8. Angular Size */}
      <div ref={refs.angular_size}>
        <FormulaChallenge
          id="angular_size"
          titleKey="physics_lab.angular_size.title"
          promptKey="physics_lab.angular_size.prompt"
          resultLabelKey="physics_lab.angular_size.result_label"
          sanityCheckKey="physics_lab.angular_size.sanity_check"
          formulaText="θ (degrees) = (size / distance) × (180/π)"
          formulaExplainerKey="physics_lab.angular_size.formula_explainer"
          resultUnit="degrees"
          inputs={[
            { key: "size", labelKey: "physics_lab.angular_size.size_label", min: 100, max: 2000000, step: 100, unit: "km", initial: 3474 },
            { key: "distance", labelKey: "physics_lab.angular_size.distance_label", min: 1000, max: 500000000, step: 1000, unit: "km", initial: 384400 },
          ]}
          compute={({ size, distance }) => (size / distance) * (180 / Math.PI)}
          quizQuestions={[
            { id: "angsize_q1", promptKey: "physics_lab.angular_size.quiz.q1.prompt", optionKeys: ["physics_lab.angular_size.quiz.q1.opt1", "physics_lab.angular_size.quiz.q1.opt2", "physics_lab.angular_size.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.angular_size.quiz.q1.explain" },
            { id: "angsize_q2", promptKey: "physics_lab.angular_size.quiz.q2.prompt", optionKeys: ["physics_lab.angular_size.quiz.q2.opt1", "physics_lab.angular_size.quiz.q2.opt2", "physics_lab.angular_size.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.angular_size.quiz.q2.explain" },
          ]}
          challengeLabelKey="physics_lab.angular_size.challenge_label"
          challengeTarget={0.52}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("angular_size")}
          onNext={() => scrollToNext("angular_size")}
        />
      </div>

      {/* 9. Surface Gravity */}
      <div ref={refs.surface_gravity}>
        <FormulaChallenge
          id="surface_gravity"
          titleKey="physics_lab.surface_gravity.title"
          promptKey="physics_lab.surface_gravity.prompt"
          resultLabelKey="physics_lab.surface_gravity.result_label"
          sanityCheckKey="physics_lab.surface_gravity.sanity_check"
          formulaText="g = GM / R²"
          formulaExplainerKey="physics_lab.surface_gravity.formula_explainer"
          resultUnit="m/s²"
          inputs={[
            { key: "massE24", labelKey: "physics_lab.surface_gravity.mass_label", min: 0.01, max: 2000, step: 0.01, unit: "× 10²⁴ kg", initial: 5.972 },
            { key: "radiusKm", labelKey: "physics_lab.surface_gravity.radius_label", min: 100, max: 80000, step: 10, unit: "km", initial: 6371 },
          ]}
          compute={({ massE24, radiusKm }) => (G * massE24 * 1e24) / Math.pow(radiusKm * 1000, 2)}
          quizQuestions={[
            { id: "gravity_q1", promptKey: "physics_lab.surface_gravity.quiz.q1.prompt", optionKeys: ["physics_lab.surface_gravity.quiz.q1.opt1", "physics_lab.surface_gravity.quiz.q1.opt2", "physics_lab.surface_gravity.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.surface_gravity.quiz.q1.explain" },
            { id: "gravity_q2", promptKey: "physics_lab.surface_gravity.quiz.q2.prompt", optionKeys: ["physics_lab.surface_gravity.quiz.q2.opt1", "physics_lab.surface_gravity.quiz.q2.opt2", "physics_lab.surface_gravity.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.surface_gravity.quiz.q2.explain" },
          ]}
          challengeLabelKey="physics_lab.surface_gravity.challenge_label"
          challengeTarget={3.7}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("surface_gravity")}
          onNext={() => scrollToNext("surface_gravity")}
        />
      </div>

      {/* 10. Density */}
      <div ref={refs.density}>
        <FormulaChallenge
          id="density"
          titleKey="physics_lab.density.title"
          promptKey="physics_lab.density.prompt"
          resultLabelKey="physics_lab.density.result_label"
          sanityCheckKey="physics_lab.density.sanity_check"
          formulaText="ρ = M / V"
          formulaExplainerKey="physics_lab.density.formula_explainer"
          resultUnit="g/cm³"
          inputs={[
            { key: "massE24", labelKey: "physics_lab.density.mass_label", min: 0.01, max: 2000, step: 0.01, unit: "× 10²⁴ kg", initial: 5.972 },
            { key: "volumeE12", labelKey: "physics_lab.density.volume_label", min: 0.001, max: 2000, step: 0.001, unit: "× 10¹² km³", initial: 1.083 },
          ]}
          compute={({ massE24, volumeE12 }) => (massE24 * 1e24) / (volumeE12 * 1e12 * 1e15) * 1000}
          quizQuestions={[
            { id: "density_q1", promptKey: "physics_lab.density.quiz.q1.prompt", optionKeys: ["physics_lab.density.quiz.q1.opt1", "physics_lab.density.quiz.q1.opt2", "physics_lab.density.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.density.quiz.q1.explain" },
            { id: "density_q2", promptKey: "physics_lab.density.quiz.q2.prompt", optionKeys: ["physics_lab.density.quiz.q2.opt1", "physics_lab.density.quiz.q2.opt2", "physics_lab.density.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.density.quiz.q2.explain" },
          ]}
          challengeLabelKey="physics_lab.density.challenge_label"
          challengeTarget={0.69}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("density")}
          onNext={() => scrollToNext("density")}
        />
      </div>

      {/* 11. Schwarzschild Radius */}
      <div ref={refs.schwarzschild_radius}>
        <FormulaChallenge
          id="schwarzschild_radius"
          titleKey="physics_lab.schwarzschild_radius.title"
          promptKey="physics_lab.schwarzschild_radius.prompt"
          resultLabelKey="physics_lab.schwarzschild_radius.result_label"
          sanityCheckKey="physics_lab.schwarzschild_radius.sanity_check"
          formulaText="Rs = 2GM / c²"
          formulaExplainerKey="physics_lab.schwarzschild_radius.formula_explainer"
          resultUnit="km"
          inputs={[{ key: "solarMasses", labelKey: "physics_lab.schwarzschild_radius.mass_label", min: 0.1, max: 100, step: 0.1, unit: "× M☉", initial: 1 }]}
          compute={({ solarMasses }) => (2 * G * (solarMasses * 1.989e30)) / Math.pow(299792458, 2) / 1000}
          quizQuestions={[
            { id: "schwarz_q1", promptKey: "physics_lab.schwarzschild_radius.quiz.q1.prompt", optionKeys: ["physics_lab.schwarzschild_radius.quiz.q1.opt1", "physics_lab.schwarzschild_radius.quiz.q1.opt2", "physics_lab.schwarzschild_radius.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.schwarzschild_radius.quiz.q1.explain" },
            { id: "schwarz_q2", promptKey: "physics_lab.schwarzschild_radius.quiz.q2.prompt", optionKeys: ["physics_lab.schwarzschild_radius.quiz.q2.opt1", "physics_lab.schwarzschild_radius.quiz.q2.opt2", "physics_lab.schwarzschild_radius.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.schwarzschild_radius.quiz.q2.explain" },
          ]}
          challengeLabelKey="physics_lab.schwarzschild_radius.challenge_label"
          challengeTarget={29.5}
          challengeTolerance={0.08}
          nextLabel={nextLabelFor("schwarzschild_radius")}
          onNext={() => scrollToNext("schwarzschild_radius")}
        />
      </div>

      {/* 12. Hubble's Law */}
      <div ref={refs.hubble_law}>
        <FormulaChallenge
          id="hubble_law"
          titleKey="physics_lab.hubble_law.title"
          promptKey="physics_lab.hubble_law.prompt"
          resultLabelKey="physics_lab.hubble_law.result_label"
          sanityCheckKey="physics_lab.hubble_law.sanity_check"
          formulaText="v = H₀ × d"
          formulaExplainerKey="physics_lab.hubble_law.formula_explainer"
          resultUnit="km/s"
          inputs={[{ key: "distanceMly", labelKey: "physics_lab.hubble_law.distance_label", min: 1, max: 5000, step: 1, unit: "million ly", initial: 100 }]}
          compute={({ distanceMly }) => distanceMly * (1e6 / 3.262) * (70 / 1e6)}
          quizQuestions={[
            { id: "hubble_q1", promptKey: "physics_lab.hubble_law.quiz.q1.prompt", optionKeys: ["physics_lab.hubble_law.quiz.q1.opt1", "physics_lab.hubble_law.quiz.q1.opt2", "physics_lab.hubble_law.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.hubble_law.quiz.q1.explain" },
            { id: "hubble_q2", promptKey: "physics_lab.hubble_law.quiz.q2.prompt", optionKeys: ["physics_lab.hubble_law.quiz.q2.opt1", "physics_lab.hubble_law.quiz.q2.opt2", "physics_lab.hubble_law.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.hubble_law.quiz.q2.explain" },
          ]}
          challengeLabelKey="physics_lab.hubble_law.challenge_label"
          challengeTarget={1500}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("hubble_law")}
          onNext={() => scrollToNext("hubble_law")}
        />
      </div>

      {/* 13. Parallax Distance */}
      <div ref={refs.parallax}>
        <FormulaChallenge
          id="parallax"
          titleKey="physics_lab.parallax.title"
          promptKey="physics_lab.parallax.prompt"
          resultLabelKey="physics_lab.parallax.result_label"
          sanityCheckKey="physics_lab.parallax.sanity_check"
          formulaText="d (parsecs) = 1 / p (arcseconds)"
          formulaExplainerKey="physics_lab.parallax.formula_explainer"
          resultUnit="parsecs"
          inputs={[{ key: "parallaxArcsec", labelKey: "physics_lab.parallax.parallax_label", min: 0.01, max: 1, step: 0.001, unit: "arcsec", initial: 0.768 }]}
          compute={({ parallaxArcsec }) => 1 / parallaxArcsec}
          quizQuestions={[
            { id: "parallax_q1", promptKey: "physics_lab.parallax.quiz.q1.prompt", optionKeys: ["physics_lab.parallax.quiz.q1.opt1", "physics_lab.parallax.quiz.q1.opt2", "physics_lab.parallax.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.parallax.quiz.q1.explain" },
            { id: "parallax_q2", promptKey: "physics_lab.parallax.quiz.q2.prompt", optionKeys: ["physics_lab.parallax.quiz.q2.opt1", "physics_lab.parallax.quiz.q2.opt2", "physics_lab.parallax.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.parallax.quiz.q2.explain" },
          ]}
          challengeLabelKey="physics_lab.parallax.challenge_label"
          challengeTarget={10}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("parallax")}
          onNext={() => scrollToNext("parallax")}
        />
      </div>

      {/* 14. Photon Energy */}
      <div ref={refs.photon_energy}>
        <FormulaChallenge
          id="photon_energy"
          titleKey="physics_lab.photon_energy.title"
          promptKey="physics_lab.photon_energy.prompt"
          resultLabelKey="physics_lab.photon_energy.result_label"
          sanityCheckKey="physics_lab.photon_energy.sanity_check"
          formulaText="E = hf  (h ≈ 6.626 × 10⁻³⁴ J·s)"
          formulaExplainerKey="physics_lab.photon_energy.formula_explainer"
          resultUnit="× 10⁻¹⁹ joules"
          inputs={[{ key: "freqE14", labelKey: "physics_lab.photon_energy.frequency_label", min: 1, max: 20, step: 0.01, unit: "× 10¹⁴ Hz", initial: 5.5 }]}
          compute={({ freqE14 }) => (6.626e-34 * freqE14 * 1e14) / 1e-19}
          quizQuestions={[
            { id: "photon_q1", promptKey: "physics_lab.photon_energy.quiz.q1.prompt", optionKeys: ["physics_lab.photon_energy.quiz.q1.opt1", "physics_lab.photon_energy.quiz.q1.opt2", "physics_lab.photon_energy.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.photon_energy.quiz.q1.explain" },
            { id: "photon_q2", promptKey: "physics_lab.photon_energy.quiz.q2.prompt", optionKeys: ["physics_lab.photon_energy.quiz.q2.opt1", "physics_lab.photon_energy.quiz.q2.opt2", "physics_lab.photon_energy.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.photon_energy.quiz.q2.explain" },
          ]}
          challengeLabelKey="physics_lab.photon_energy.challenge_label"
          challengeTarget={4.97}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("photon_energy")}
          onNext={() => scrollToNext("photon_energy")}
        />
      </div>

      {/* 15. Synodic Period */}
      <div ref={refs.synodic_period}>
        <FormulaChallenge
          id="synodic_period"
          titleKey="physics_lab.synodic_period.title"
          promptKey="physics_lab.synodic_period.prompt"
          resultLabelKey="physics_lab.synodic_period.result_label"
          sanityCheckKey="physics_lab.synodic_period.sanity_check"
          formulaText="1/S = |1/T_Earth − 1/T_planet|"
          formulaExplainerKey="physics_lab.synodic_period.formula_explainer"
          resultUnit="years"
          inputs={[
            { key: "earthPeriod", labelKey: "physics_lab.synodic_period.period1_label", min: 0.5, max: 2, step: 0.01, unit: "years", initial: 1 },
            { key: "otherPeriod", labelKey: "physics_lab.synodic_period.period2_label", min: 0.2, max: 165, step: 0.01, unit: "years", initial: 1.88 },
          ]}
          compute={({ earthPeriod, otherPeriod }) => 1 / Math.abs(1 / earthPeriod - 1 / otherPeriod)}
          quizQuestions={[
            { id: "synodic_q1", promptKey: "physics_lab.synodic_period.quiz.q1.prompt", optionKeys: ["physics_lab.synodic_period.quiz.q1.opt1", "physics_lab.synodic_period.quiz.q1.opt2", "physics_lab.synodic_period.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.synodic_period.quiz.q1.explain" },
            { id: "synodic_q2", promptKey: "physics_lab.synodic_period.quiz.q2.prompt", optionKeys: ["physics_lab.synodic_period.quiz.q2.opt1", "physics_lab.synodic_period.quiz.q2.opt2", "physics_lab.synodic_period.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.synodic_period.quiz.q2.explain" },
          ]}
          challengeLabelKey="physics_lab.synodic_period.challenge_label"
          challengeTarget={2.135}
          challengeTolerance={0.05}
          nextLabel={nextLabelFor("synodic_period")}
          onNext={() => scrollToNext("synodic_period")}
        />
      </div>

      {/* 16. The Rocket Equation */}
      <div ref={refs.rocket_equation}>
        <FormulaChallenge
          id="rocket_equation"
          titleKey="physics_lab.rocket_equation.title"
          promptKey="physics_lab.rocket_equation.prompt"
          resultLabelKey="physics_lab.rocket_equation.result_label"
          sanityCheckKey="physics_lab.rocket_equation.sanity_check"
          formulaText="Δv = v_e × ln(m₀ / m_f)"
          formulaExplainerKey="physics_lab.rocket_equation.formula_explainer"
          resultUnit="km/s"
          inputs={[
            { key: "exhaustVelocity", labelKey: "physics_lab.rocket_equation.exhaust_velocity_label", min: 1, max: 10, step: 0.1, unit: "km/s", initial: 3 },
            { key: "massRatio", labelKey: "physics_lab.rocket_equation.mass_ratio_label", min: 1.1, max: 30, step: 0.1, unit: "×", initial: 10 },
          ]}
          compute={({ exhaustVelocity, massRatio }) => exhaustVelocity * Math.log(massRatio)}
          quizQuestions={[
            { id: "rocket_q1", promptKey: "physics_lab.rocket_equation.quiz.q1.prompt", optionKeys: ["physics_lab.rocket_equation.quiz.q1.opt1", "physics_lab.rocket_equation.quiz.q1.opt2", "physics_lab.rocket_equation.quiz.q1.opt3"], correctIndex: 0, explainKey: "physics_lab.rocket_equation.quiz.q1.explain" },
            { id: "rocket_q2", promptKey: "physics_lab.rocket_equation.quiz.q2.prompt", optionKeys: ["physics_lab.rocket_equation.quiz.q2.opt1", "physics_lab.rocket_equation.quiz.q2.opt2", "physics_lab.rocket_equation.quiz.q2.opt3"], correctIndex: 0, explainKey: "physics_lab.rocket_equation.quiz.q2.explain" },
          ]}
          challengeLabelKey="physics_lab.rocket_equation.challenge_label"
          challengeTarget={6.9}
          challengeTolerance={0.05}
          nextLabel={null}
          onNext={null}
        />
      </div>
    </div>
  );
}
