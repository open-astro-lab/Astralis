import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import { useSound } from "../../context/SoundContext.jsx";

function temperatureToRGB(kelvin) {
  const temp = kelvin / 100;
  let r, g, b;
  if (temp <= 66) r = 255;
  else {
    r = Math.min(255, Math.max(0, 329.698727446 * Math.pow(temp - 60, -0.1332047592)));
  }
  if (temp <= 66) g = Math.min(255, Math.max(0, 99.4708025861 * Math.log(temp) - 161.1195681661));
  else g = Math.min(255, Math.max(0, 288.1221695283 * Math.pow(temp - 60, -0.0755148492)));
  if (temp >= 66) b = 255;
  else if (temp <= 19) b = 0;
  else b = Math.min(255, Math.max(0, 138.5177312231 * Math.log(temp - 10) - 305.0447927307));
  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

let nextPlanetId = 1;

export default function StarSystemBuilder() {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const { playClick, playCorrect } = useSound();

  const [temp, setTemp] = useState(5778);
  const [starMass, setStarMass] = useState(1);
  const [starRadius, setStarRadius] = useState(1);
  const [planets, setPlanets] = useState([{ id: 0, distance: 1 }]);
  const [everHitHabitable, setEverHitHabitable] = useState(false);

  const color = useMemo(() => temperatureToRGB(temp), [temp]);
  const luminosity = useMemo(
    () => Math.pow(starRadius, 2) * Math.pow(temp / 5778, 4),
    [starRadius, temp]
  );
  const habitableDistance = useMemo(() => Math.sqrt(luminosity), [luminosity]);

  function addPlanet() {
    playClick();
    const id = nextPlanetId++;
    setPlanets((prev) => [...prev, { id, distance: 1 }]);
    if (planets.length === 0) {
      complete("systemBuilder", "first_planet");
    }
  }

  function removePlanet(id) {
    playClick();
    setPlanets((prev) => prev.filter((p) => p.id !== id));
  }

  function updateDistance(id, distance) {
    setPlanets((prev) => prev.map((p) => (p.id === id ? { ...p, distance } : p)));
  }

  function inZone(distance) {
    return Math.abs(distance - habitableDistance) <= habitableDistance * 0.2;
  }

  function orbitalPeriod(distance) {
    return Math.sqrt(Math.pow(distance, 3) / starMass);
  }

  // Fire the habitable-world celebration once, the first time any planet lands in the zone.
  const anyInZone = planets.some((p) => inZone(p.distance));
  useEffect(() => {
    if (anyInZone && !everHitHabitable) {
      setEverHitHabitable(true);
      complete("systemBuilder", "habitable_world");
      playCorrect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anyInZone]);

  const maxDistance = Math.max(5, ...planets.map((p) => p.distance), habitableDistance * 1.3);

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <h2 className="font-display text-lg mb-4">{t("system_builder.star_heading")}</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm text-muted mb-2">{t("system_builder.temp_label")}</label>
              <input
                type="range" min="2500" max="40000" step="50" value={temp}
                onChange={(e) => setTemp(parseInt(e.target.value, 10))}
                className="w-full accent-nebula"
              />
              <div className="font-mono text-nebulaSoft text-sm mt-1">{temp.toLocaleString()} K</div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">{t("system_builder.mass_label")}</label>
              <input
                type="range" min="0.1" max="20" step="0.1" value={starMass}
                onChange={(e) => setStarMass(parseFloat(e.target.value))}
                className="w-full accent-nebula"
              />
              <div className="font-mono text-nebulaSoft text-sm mt-1">{starMass.toFixed(1)} × M☉</div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-2">{t("system_builder.radius_label")}</label>
              <input
                type="range" min="0.1" max="20" step="0.1" value={starRadius}
                onChange={(e) => setStarRadius(parseFloat(e.target.value))}
                className="w-full accent-nebula"
              />
              <div className="font-mono text-nebulaSoft text-sm mt-1">{starRadius.toFixed(1)} × R☉</div>
            </div>
          </div>

          <div className="rounded-xl border border-nebula/30 bg-void/60 p-5 flex flex-col items-center justify-center text-center">
            <div
              className="rounded-full mb-3"
              style={{
                width: `${Math.min(90, 30 + starRadius * 4)}px`,
                height: `${Math.min(90, 30 + starRadius * 4)}px`,
                backgroundColor: color,
                boxShadow: `0 0 50px 8px ${color}66`,
              }}
            />
            <div className="text-xs uppercase tracking-widest text-muted">
              {t("system_builder.luminosity_label")}
            </div>
            <div className="font-mono text-2xl text-starlight mt-1">{luminosity.toFixed(2)}×</div>
            <div className="text-xs text-muted mt-3">
              {t("system_builder.habitable_zone_label")}: {habitableDistance.toFixed(2)} AU
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <div className="relative w-full aspect-[2/1] rounded-xl border border-white/10 bg-void/60 overflow-hidden mb-6">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {planets.map((p) => {
              const r = 30 + (p.distance / maxDistance) * 160;
              return <circle key={p.id} cx="200" cy="100" r={r} fill="none" stroke="#7C6CF0" strokeOpacity="0.25" strokeDasharray="2 3" />;
            })}
            <circle cx="200" cy="100" r={Math.min(18, 8 + starRadius)} fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
            {planets.map((p) => {
              const r = 30 + (p.distance / maxDistance) * 160;
              const habitable = inZone(p.distance);
              return (
                <circle
                  key={p.id}
                  cx={200 + r}
                  cy="100"
                  r="6"
                  fill={habitable ? "#3FD6B0" : "#8B93AE"}
                />
              );
            })}
          </svg>
        </div>

        <h3 className="font-display text-lg mb-4">{t("system_builder.planets_heading")}</h3>
        <div className="space-y-5">
          {planets.map((p, i) => (
            <div key={p.id} className="rounded-xl border border-white/10 bg-void/40 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-text">{t("system_builder.planet", { n: i + 1 })}</span>
                <button onClick={() => removePlanet(p.id)} className="text-xs text-muted hover:text-starlight transition">
                  {t("system_builder.remove_planet")}
                </button>
              </div>
              <label className="block text-xs text-muted mb-1.5">{t("system_builder.distance_label")}</label>
              <input
                type="range" min="0.05" max="20" step="0.05" value={p.distance}
                onChange={(e) => updateDistance(p.id, parseFloat(e.target.value))}
                className="w-full accent-nebula"
              />
              <div className="flex items-center justify-between mt-1.5">
                <span className="font-mono text-nebulaSoft text-xs">{p.distance.toFixed(2)} AU</span>
                <span className="font-mono text-muted text-xs">
                  {t("system_builder.orbital_period_label")}: {orbitalPeriod(p.distance).toFixed(2)}y
                </span>
              </div>
              <div className={`text-xs mt-2 font-medium ${inZone(p.distance) ? "text-verified" : "text-muted"}`}>
                {inZone(p.distance) ? t("system_builder.in_zone") : t("system_builder.out_zone")}
              </div>
            </div>
          ))}
        </div>

        {planets.length < 6 && (
          <button
            onClick={addPlanet}
            className="mt-5 px-5 py-2.5 rounded-full border border-white/15 text-sm text-text hover:border-nebula transition"
          >
            {t("system_builder.add_planet")}
          </button>
        )}
      </div>
    </div>
  );
}
