import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { completeActivity } from "../../lib/passport";

// Deterministic pseudo-random generator so the three curves are stable across renders.
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function generateCurve(seed, hasTransit) {
  const rand = seededRandom(seed);
  const points = [];
  const n = 48;
  const transitStart = 20;
  const transitEnd = 28;
  for (let i = 0; i < n; i++) {
    const noise = (rand() - 0.5) * 0.03;
    let value = 1 + noise;
    if (hasTransit && i >= transitStart && i <= transitEnd) {
      const mid = (transitStart + transitEnd) / 2;
      const width = (transitEnd - transitStart) / 2;
      const t = (i - mid) / width;
      const dip = 0.18 * Math.max(0, 1 - t * t); // smooth symmetric dip
      value -= dip;
    }
    points.push(value);
  }
  return points;
}

function LightCurveSVG({ points, highlighted }) {
  const w = 200;
  const h = 70;
  const min = 0.75;
  const max = 1.05;
  const path = points
    .map((v, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((v - min) / (max - min)) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20">
      <path
        d={path}
        fill="none"
        stroke={highlighted ? "#3FD6B0" : "#A79AF5"}
        strokeWidth="2"
      />
    </svg>
  );
}

export default function ExoplanetHunter() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [checked, setChecked] = useState(false);
  const [dipDepth, setDipDepth] = useState(0.02);

  // Curve B (index 1) is the one with a real transit.
  const curves = useMemo(
    () => [
      generateCurve(11, false),
      generateCurve(22, true),
      generateCurve(33, false),
    ],
    []
  );
  const correctIndex = 1;

  function handleCheck() {
    setChecked(true);
    if (selected === correctIndex) {
      completeActivity("exoplanetInvestigations", "transit_identification");
    }
  }

  const radiusRatio = Math.sqrt(dipDepth);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <p className="text-muted text-sm mb-5">{t("exoplanet_hunter.instruction")}</p>
        <div className="grid sm:grid-cols-3 gap-4">
          {curves.map((points, i) => (
            <button
              key={i}
              onClick={() => {
                setSelected(i);
                setChecked(false);
              }}
              className={`rounded-xl border p-4 text-left transition ${
                selected === i
                  ? "border-nebula bg-void/60 shadow-glow"
                  : "border-white/10 bg-void/30 hover:border-white/25"
              }`}
            >
              <div className="text-xs text-muted mb-2 font-mono">
                {t("exoplanet_hunter.curve_label", { n: i + 1 })}
              </div>
              <LightCurveSVG points={points} highlighted={selected === i} />
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={selected === null}
          className="mt-5 px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition disabled:opacity-40"
        >
          {t("exoplanet_hunter.check_button")}
        </button>

        {checked && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm border ${
              selected === correctIndex
                ? "border-verified/30 bg-verified/5 text-text/90"
                : "border-starlight/30 bg-starlight/5 text-text/90"
            }`}
          >
            {selected === correctIndex
              ? t("exoplanet_hunter.correct")
              : t("exoplanet_hunter.incorrect")}
            {selected === correctIndex && (
              <p className="text-muted mt-2">{t("exoplanet_hunter.explanation")}</p>
            )}
          </div>
        )}
      </div>

      {checked && selected === correctIndex && (
        <div className="rounded-2xl border border-white/10 bg-panel p-6">
          <h3 className="font-display text-lg">
            {t("exoplanet_hunter.size_challenge.heading")}
          </h3>
          <p className="text-muted text-sm mt-2 mb-5 leading-relaxed">
            {t("exoplanet_hunter.size_challenge.instruction")}
          </p>

          <label className="block text-sm text-muted mb-2">
            {t("exoplanet_hunter.size_challenge.depth_label")}
          </label>
          <input
            type="range"
            min="0.001"
            max="0.15"
            step="0.001"
            value={dipDepth}
            onChange={(e) => setDipDepth(parseFloat(e.target.value))}
            className="w-full accent-nebula"
          />
          <div className="font-mono text-nebulaSoft text-sm mt-1">
            {(dipDepth * 100).toFixed(1)}%
          </div>

          <div className="mt-4 rounded-xl border border-nebula/30 bg-void/60 p-5 text-center">
            <div className="text-xs uppercase tracking-widest text-muted">
              {t("exoplanet_hunter.size_challenge.ratio_label")}
            </div>
            <div className="font-mono text-3xl text-starlight mt-1">
              {radiusRatio.toFixed(3)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
