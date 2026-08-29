import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { completeActivity } from "../../lib/passport";

const G = 6.6743e-11; // gravitational constant

// Real reference bodies, so results can be sanity-checked against known values.
const PRESETS = {
  earth: { massE24: 5.972, radiusKm: 6371 },
  moon: { massE24: 0.073, radiusKm: 1737 },
  jupiter: { massE24: 1898, radiusKm: 69911 },
};

function computeEscapeVelocityKmS(massE24, radiusKm) {
  const massKg = massE24 * 1e24;
  const radiusM = radiusKm * 1000;
  if (massKg <= 0 || radiusM <= 0) return 0;
  const vMs = Math.sqrt((2 * G * massKg) / radiusM);
  return vMs / 1000;
}

export default function EscapeVelocity() {
  const { t } = useTranslation();
  const [massE24, setMassE24] = useState(PRESETS.earth.massE24);
  const [radiusKm, setRadiusKm] = useState(PRESETS.earth.radiusKm);
  const [revealed, setRevealed] = useState(false);

  const velocity = useMemo(
    () => computeEscapeVelocityKmS(massE24, radiusKm),
    [massE24, radiusKm]
  );

  function applyPreset(name) {
    setMassE24(PRESETS[name].massE24);
    setRadiusKm(PRESETS[name].radiusKm);
  }

  function handleReveal() {
    setRevealed(true);
    completeActivity("physicsChallenges", "escape_velocity");
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-panel p-6 md:p-8 shadow-glow">
      <h2 className="font-display text-2xl text-text">
        {t("physics_lab.escape_velocity.title")}
      </h2>
      <p className="mt-2 text-muted max-w-xl">
        {t("physics_lab.escape_velocity.prompt")}
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_1fr] items-start">
        {/* Controls */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-muted mb-2">
              {t("physics_lab.escape_velocity.mass_label")}
            </label>
            <input
              type="range"
              min="0.01"
              max="2000"
              step="0.01"
              value={massE24}
              onChange={(e) => setMassE24(parseFloat(e.target.value))}
              className="w-full accent-nebula"
            />
            <div className="font-mono text-nebulaSoft text-sm mt-1">
              {massE24.toLocaleString(undefined, { maximumFractionDigits: 2 })} × 10²⁴ kg
            </div>
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">
              {t("physics_lab.escape_velocity.radius_label")}
            </label>
            <input
              type="range"
              min="100"
              max="80000"
              step="10"
              value={radiusKm}
              onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
              className="w-full accent-nebula"
            />
            <div className="font-mono text-nebulaSoft text-sm mt-1">
              {radiusKm.toLocaleString()} km
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              onClick={() => applyPreset("earth")}
              className="px-3 py-1.5 rounded-full text-xs border border-white/15 text-muted hover:text-text hover:border-nebula transition"
            >
              {t("physics_lab.escape_velocity.try_earth")}
            </button>
            <button
              onClick={() => applyPreset("moon")}
              className="px-3 py-1.5 rounded-full text-xs border border-white/15 text-muted hover:text-text hover:border-nebula transition"
            >
              {t("physics_lab.escape_velocity.try_moon")}
            </button>
            <button
              onClick={() => applyPreset("jupiter")}
              className="px-3 py-1.5 rounded-full text-xs border border-white/15 text-muted hover:text-text hover:border-nebula transition"
            >
              {t("physics_lab.escape_velocity.try_jupiter")}
            </button>
          </div>
        </div>

        {/* Instrument readout */}
        <div className="rounded-xl border border-nebula/30 bg-void/60 p-6 flex flex-col items-center justify-center text-center">
          <div className="text-xs uppercase tracking-widest text-muted">
            {t("physics_lab.escape_velocity.result_label")}
          </div>
          <div className="font-mono text-4xl md:text-5xl text-starlight mt-2 tabular-nums">
            {velocity.toFixed(2)}
          </div>
          <div className="text-muted text-sm mt-1">km/s</div>
          <div className="text-xs text-muted/70 mt-4">
            {t("physics_lab.escape_velocity.sanity_check")}
          </div>
        </div>
      </div>

      <div className="mt-6">
        {!revealed ? (
          <button
            onClick={handleReveal}
            className="px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition"
          >
            {t("physics_lab.escape_velocity.reveal_button")}
          </button>
        ) : (
          <div className="rounded-xl border border-verified/30 bg-verified/5 p-4 text-sm text-text/90">
            <div className="font-mono text-verified mb-2">
              v = √(2GM / R)
            </div>
            <p className="text-muted">
              {t("physics_lab.escape_velocity.formula_explainer")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
