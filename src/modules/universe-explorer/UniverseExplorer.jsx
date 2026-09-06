import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import { useSound } from "../../context/SoundContext.jsx";
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

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function ObjectCard({ objKey, allKeys, discovered, onDiscover, t }) {
  const { playCorrect, playWrong, playClick } = useSound();
  const [guessed, setGuessed] = useState(discovered);
  const [wrongFlash, setWrongFlash] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const options = useMemo(() => {
    const rand = seededRandom(objKey.length * 97 + objKey.charCodeAt(0));
    const others = allKeys.filter((k) => k !== objKey);
    const shuffledOthers = [...others].sort(() => rand() - 0.5);
    const distractors = shuffledOthers.slice(0, 2);
    return [objKey, ...distractors].sort(() => rand() - 0.5);
  }, [objKey, allKeys]);

  function guess(candidateKey) {
    if (guessed) return;
    playClick();
    if (candidateKey === objKey) {
      playCorrect();
      setGuessed(true);
      onDiscover(objKey);
    } else {
      playWrong();
      setWrongFlash(true);
      setTimeout(() => setWrongFlash(false), 500);
    }
  }

  return (
    <div className={`rounded-2xl border p-5 transition ${wrongFlash ? "border-starlight/60" : "border-white/10"} bg-panel`}>
      <ObjectGlyph kind={objKey} />
      <p className="text-muted text-sm mt-3 leading-relaxed">
        {t(`universe_explorer.objects.${objKey}.description`)}
      </p>

      {!guessed ? (
        <div className="mt-4">
          <p className="text-nebulaSoft text-xs mb-2">{t("universe_explorer.guess_prompt")}</p>
          <div className="grid gap-2">
            {options.map((optKey) => (
              <button
                key={optKey}
                onClick={() => guess(optKey)}
                className="text-left px-3 py-2 rounded-lg border border-white/10 hover:border-nebula text-sm text-text transition"
              >
                {t(`universe_explorer.objects.${optKey}.name`)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <div className="font-display text-lg text-starlight">
            {t(`universe_explorer.objects.${objKey}.name`)}
          </div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="text-nebulaSoft text-xs mt-2"
          >
            {expanded ? "▲" : "▼"} {t("universe_explorer.tap_for_detail")}
          </button>
          {expanded && (
            <p className="text-nebulaSoft text-sm mt-2 leading-relaxed border-t border-white/10 pt-2">
              {t(`universe_explorer.objects.${objKey}.detail`)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function UniverseExplorer() {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [opened, setOpened] = useState({});
  const [scaleIndex, setScaleIndex] = useState(0);

  function discoverObject(key) {
    if (!opened[key]) {
      complete("objectsExplored", `universe_${key}`);
      setOpened((prev) => ({ ...prev, [key]: true }));
    }
  }

  const currentScale = SCALE_KEYS[scaleIndex];
  const allOpened = OBJECT_KEYS.every((k) => opened[k]);
  const discoveredCount = OBJECT_KEYS.filter((k) => opened[k]).length;

  return (
    <div>
      <div className="mb-5 text-sm font-mono text-nebulaSoft">
        🔭 {t("universe_explorer.discovered_count", { count: discoveredCount, total: OBJECT_KEYS.length })}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {OBJECT_KEYS.map((key) => (
          <ObjectCard
            key={key}
            objKey={key}
            allKeys={OBJECT_KEYS}
            discovered={!!opened[key]}
            onDiscover={discoverObject}
            t={t}
          />
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
            {
              id: "ue_q3",
              promptKey: "universe_explorer.quiz.q3.prompt",
              optionKeys: ["universe_explorer.quiz.q3.opt1", "universe_explorer.quiz.q3.opt2", "universe_explorer.quiz.q3.opt3"],
              correctIndex: 0,
              explainKey: "universe_explorer.quiz.q3.explain",
            },
            {
              id: "ue_q4",
              promptKey: "universe_explorer.quiz.q4.prompt",
              optionKeys: ["universe_explorer.quiz.q4.opt1", "universe_explorer.quiz.q4.opt2", "universe_explorer.quiz.q4.opt3"],
              correctIndex: 0,
              explainKey: "universe_explorer.quiz.q4.explain",
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
