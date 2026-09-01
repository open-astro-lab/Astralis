import { useRef } from "react";
import { useTranslation } from "react-i18next";
import FormulaChallenge from "./FormulaChallenge.jsx";

const G = 6.6743e-11;

const FORMULA_IDS = ["escape_velocity", "orbital_velocity", "keplers_third_law", "inverse_square_law", "wiens_law", "stefan_boltzmann"];
const FORMULA_NAME_KEYS = {
  escape_velocity: "physics_lab.escape_velocity.title",
  orbital_velocity: "physics_lab.orbital_velocity.title",
  keplers_third_law: "physics_lab.kepler.title",
  inverse_square_law: "physics_lab.inverse_square.title",
  wiens_law: "physics_lab.wien.title",
  stefan_boltzmann: "physics_lab.stefan_boltzmann.title",
};

export default function PhysicsLab() {
  const { t } = useTranslation();
  const refs = {
    escape_velocity: useRef(null),
    orbital_velocity: useRef(null),
    keplers_third_law: useRef(null),
    inverse_square_law: useRef(null),
    wiens_law: useRef(null),
    stefan_boltzmann: useRef(null),
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

  return (
    <div className="space-y-10">
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
          nextLabel={null}
          onNext={null}
        />
      </div>
    </div>
  );
}
