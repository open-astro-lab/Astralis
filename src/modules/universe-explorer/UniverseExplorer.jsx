import { useState } from "react";
import { useTranslation } from "react-i18next";
import { completeActivity } from "../../lib/passport";

const OBJECT_KEYS = ["galaxies", "nebulae", "black_holes", "stars"];
const SCALE_KEYS = ["earth", "sun", "solar_system", "nearest_star", "milky_way", "observable_universe"];

// Small SVG "signature" glow renderers — avoids external images while still
// giving each object type a distinct, characterful visual identity.
function ObjectGlyph({ kind }) {
  const common = "w-full h-28 rounded-lg";
  if (kind === "galaxies") {
    return (
      <svg viewBox="0 0 100 60" className={common}>
        <defs>
          <radialGradient id="gGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#F2C572" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#7C6CF0" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0B0E1A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="60" fill="transparent" />
        <ellipse cx="50" cy="30" rx="40" ry="10" fill="url(#gGlow)" />
        <ellipse cx="50" cy="30" rx="26" ry="6" fill="url(#gGlow)" opacity="0.8" transform="rotate(20 50 30)" />
      </svg>
    );
  }
  if (kind === "nebulae") {
    return (
      <svg viewBox="0 0 100 60" className={common}>
        <defs>
          <radialGradient id="nGlow" cx="40%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#A79AF5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0B0E1A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nGlow2" cx="65%" cy="55%" r="45%">
            <stop offset="0%" stopColor="#F2C572" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#0B0E1A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="60" fill="url(#nGlow)" />
        <rect width="100" height="60" fill="url(#nGlow2)" />
      </svg>
    );
  }
  if (kind === "black_holes") {
    return (
      <svg viewBox="0 0 100 60" className={common}>
        <defs>
          <radialGradient id="bhDisk" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B0E1A" />
            <stop offset="35%" stopColor="#0B0E1A" />
            <stop offset="45%" stopColor="#F2C572" />
            <stop offset="60%" stopColor="#7C6CF0" />
            <stop offset="100%" stopColor="#0B0E1A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="50" cy="30" rx="42" ry="14" fill="url(#bhDisk)" />
        <circle cx="50" cy="30" r="9" fill="#0B0E1A" stroke="#F2C572" strokeWidth="0.6" />
      </svg>
    );
  }
  // stars
  return (
    <svg viewBox="0 0 100 60" className={common}>
      <defs>
        <radialGradient id="sGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#F2C572" />
          <stop offset="100%" stopColor="#0B0E1A" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="30" r="22" fill="url(#sGlow)" />
    </svg>
  );
}

export default function UniverseExplorer() {
  const { t } = useTranslation();
  const [opened, setOpened] = useState({});
  const [scaleIndex, setScaleIndex] = useState(0);

  function openObject(key) {
    if (!opened[key]) {
      completeActivity("objectsExplored", `universe_${key}`);
      setOpened((prev) => ({ ...prev, [key]: true }));
    }
  }

  const currentScale = SCALE_KEYS[scaleIndex];

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
          </button>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-panel p-6">
        <h3 className="font-display text-lg">{t("universe_explorer.scale_heading")}</h3>
        <p className="text-muted text-sm mt-1 mb-6">
          {t("universe_explorer.scale_instruction")}
        </p>

        <input
          type="range"
          min="0"
          max={SCALE_KEYS.length - 1}
          step="1"
          value={scaleIndex}
          onChange={(e) => {
            const idx = parseInt(e.target.value, 10);
            setScaleIndex(idx);
            completeActivity("objectsExplored", `scale_${SCALE_KEYS[idx]}`);
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
    </div>
  );
}
