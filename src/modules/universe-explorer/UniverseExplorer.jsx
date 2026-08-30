import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import Quiz from "../../components/Quiz.jsx";

const OBJECT_KEYS = [
  "galaxies", "nebulae", "black_holes", "stars",
  "supernovae", "star_clusters", "cmb", "dark_matter",
  "solar_system", "comets", "habitable_zone", "andromeda",
];
const SCALE_KEYS = ["earth", "sun", "solar_system", "nearest_star", "milky_way", "observable_universe"];

const GLOW_COLORS = {
  galaxies: ["#F2C572", "#7C6CF0"],
  nebulae: ["#A79AF5", "#F2C572"],
  black_holes: ["#F2C572", "#7C6CF0"],
  stars: ["#FFFFFF", "#F2C572"],
  supernovae: ["#FFFFFF", "#FF7A59"],
  star_clusters: ["#F2C572", "#FFFFFF"],
  cmb: ["#3FD6B0", "#A79AF5"],
  dark_matter: ["#4B4F6B", "#7C6CF0"],
  solar_system: ["#F2C572", "#3FD6B0"],
  comets: ["#A79AF5", "#FFFFFF"],
  habitable_zone: ["#3FD6B0", "#F2C572"],
  andromeda: ["#7C6CF0", "#FFFFFF"],
};

function ObjectGlyph({ kind }) {
  const [c1, c2] = GLOW_COLORS[kind] || ["#7C6CF0", "#F2C572"];
  const id = `glow-${kind}`;
  return (
    <svg viewBox="0 0 100 60" className="w-full h-28 rounded-lg">
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.9" />
          <stop offset="45%" stopColor={c2} stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0B0E1A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="50" cy="30" rx="38" ry="14" fill={`url(#${id})`} />
    </svg>
  );
}

export default function UniverseExplorer() {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [opened, setOpened] = useState({});
  const [expanded, setExpanded] = useState({});
  const [scaleIndex, setScaleIndex] = useState(0);

  function openObject(key) {
    if (!opened[key]) {
      complete("objectsExplored", `universe_${key}`);
      setOpened((prev) => ({ ...prev, [key]: true }));
    }
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  const currentScale = SCALE_KEYS[scaleIndex];
  const allOpened = OBJECT_KEYS.every((k) => opened[k]);

  return (
    <div>
      <div className="grid sm:grid-cols-2 gap-4">
        {OBJECT_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => openObject(key)}
            className="text-left rounded-2xl border border-white/10 bg-panel p-5 hover:border-nebula hover:shadow-glow transition"
          >
            <ObjectGlyph kind={key} />
            <div className="font-display text-lg mt-3">
              {t(`universe_explorer.objects.${key}.name`)}
            </div>
            <p className="text-muted text-sm mt-2 leading-relaxed">
              {t(`universe_explorer.objects.${key}.description`)}
            </p>
            {expanded[key] ? (
              <p className="text-nebulaSoft text-sm mt-3 leading-relaxed border-t border-white/10 pt-3">
                {t(`universe_explorer.objects.${key}.detail`)}
              </p>
            ) : (
              <p className="text-nebulaSoft text-xs mt-3">
                {t("universe_explorer.tap_for_detail")} →
              </p>
            )}
          </button>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-panel p-6">
        <h3 className="font-display text-lg">{t("universe_explorer.scale_heading")}</h3>
        <p className="text-muted text-sm mt-1 mb-6">{t("universe_explorer.scale_instruction")}</p>

        <input
          type="range"
          min="0"
          max={SCALE_KEYS.length - 1}
          step="1"
          value={scaleIndex}
          onChange={(e) => {
            const idx = parseInt(e.target.value, 10);
            setScaleIndex(idx);
            complete("objectsExplored", `scale_${SCALE_KEYS[idx]}`);
          }}
          className="w-full accent-nebula"
        />

        <div className="mt-6 rounded-xl border border-nebula/30 bg-void/60 p-5 text-center">
          <div className="font-display text-xl text-starlight">
            {t(`universe_explorer.scale_steps.${currentScale}.label`)}
          </div>
          <div className="font-mono text-nebulaSoft text-sm mt-1">
            {t(`universe_explorer.scale_steps.${currentScale}.value`)}
          </div>
          <p className="text-muted text-sm mt-3 max-w-md mx-auto">
            {t(`universe_explorer.scale_steps.${currentScale}.blurb`)}
          </p>
        </div>
      </div>

      {allOpened && (
        <div className="mt-8">
          <Quiz
            questions={[
              {
                id: "ue_q1",
                promptKey: "universe_explorer.quiz.q1.prompt",
                optionKeys: ["universe_explorer.quiz.q1.opt1", "universe_explorer.quiz.q1.opt2", "universe_explorer.quiz.q1.opt3"],
                correctIndex: 1,
                explainKey: "universe_explorer.quiz.q1.explain",
              },
              {
                id: "ue_q2",
                promptKey: "universe_explorer.quiz.q2.prompt",
                optionKeys: ["universe_explorer.quiz.q2.opt1", "universe_explorer.quiz.q2.opt2", "universe_explorer.quiz.q2.opt3"],
                correctIndex: 2,
                explainKey: "universe_explorer.quiz.q2.explain",
              },
            ]}
            category="objectsExplored"
            activityId="universe_explorer_quiz"
          />
        </div>
      )}
    </div>
  );
}
