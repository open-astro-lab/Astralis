import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { completeActivity } from "../../lib/passport";

const CLASS_ORDER = ["O", "B", "A", "F", "G", "K", "M"];

function classifyTemperature(k) {
  if (k > 30000) return "O";
  if (k > 10000) return "B";
  if (k > 7500) return "A";
  if (k > 6000) return "F";
  if (k > 5200) return "G";
  if (k > 3700) return "K";
  return "M";
}

// Approximate blackbody temperature → RGB (based on the well-known
// Tanner Helland approximation), used purely for the visual preview.
function temperatureToRGB(kelvin) {
  const temp = kelvin / 100;
  let r, g, b;

  if (temp <= 66) {
    r = 255;
  } else {
    r = temp - 60;
    r = 329.698727446 * Math.pow(r, -0.1332047592);
    r = Math.min(255, Math.max(0, r));
  }

  if (temp <= 66) {
    g = temp;
    g = 99.4708025861 * Math.log(g) - 161.1195681661;
  } else {
    g = temp - 60;
    g = 288.1221695283 * Math.pow(g, -0.0755148492);
  }
  g = Math.min(255, Math.max(0, g));

  if (temp >= 66) {
    b = 255;
  } else if (temp <= 19) {
    b = 0;
  } else {
    b = temp - 10;
    b = 138.5177312231 * Math.log(b) - 305.0447927307;
    b = Math.min(255, Math.max(0, b));
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}

export default function StellarDetective() {
  const { t } = useTranslation();
  const [temperature, setTemperature] = useState(5778);
  const [selectedClass, setSelectedClass] = useState(null);
  const [checked, setChecked] = useState(false);

  const color = useMemo(() => temperatureToRGB(temperature), [temperature]);
  const correctClass = classifyTemperature(temperature);

  function handleCheck() {
    setChecked(true);
    if (selectedClass === correctClass) {
      completeActivity("stellarInvestigations", `classify_${Math.round(temperature / 1000)}k`);
    }
  }

  function handleTemperatureChange(v) {
    setTemperature(v);
    setChecked(false);
    setSelectedClass(null);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-panel p-6 md:p-8">
      <div className="grid sm:grid-cols-[auto_1fr] gap-8 items-center">
        <div
          className="w-28 h-28 rounded-full mx-auto shadow-glow"
          style={{ backgroundColor: color, boxShadow: `0 0 45px 5px ${color}55` }}
        />
        <div>
          <label className="block text-sm text-muted mb-2">
            {t("stellar_detective.temperature_label")}
          </label>
          <input
            type="range"
            min="2500"
            max="40000"
            step="50"
            value={temperature}
            onChange={(e) => handleTemperatureChange(parseInt(e.target.value, 10))}
            className="w-full accent-nebula"
          />
          <div className="font-mono text-nebulaSoft text-sm mt-1">{temperature.toLocaleString()} K</div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-text mb-4">{t("stellar_detective.question")}</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {CLASS_ORDER.map((cls) => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClass(cls);
                setChecked(false);
              }}
              className={`py-2.5 rounded-lg border font-mono text-sm transition ${
                selectedClass === cls
                  ? "border-nebula bg-void/60 text-text"
                  : "border-white/10 text-muted hover:border-white/25"
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        <button
          onClick={handleCheck}
          disabled={!selectedClass}
          className="mt-5 px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition disabled:opacity-40"
        >
          {t("stellar_detective.check_button")}
        </button>

        {checked && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm border ${
              selectedClass === correctClass
                ? "border-verified/30 bg-verified/5 text-text/90"
                : "border-starlight/30 bg-starlight/5 text-text/90"
            }`}
          >
            {selectedClass === correctClass
              ? t("stellar_detective.correct")
              : t("stellar_detective.incorrect")}
          </div>
        )}

        <div className="mt-6 rounded-xl border border-white/10 bg-void/40 p-4 text-xs text-muted space-y-1 font-mono">
          {CLASS_ORDER.map((cls) => (
            <div key={cls}>{t(`stellar_detective.classes.${cls}`)}</div>
          ))}
        </div>

        <p className="text-muted text-sm mt-5 leading-relaxed">
          {t("stellar_detective.explainer")}
        </p>
      </div>
    </div>
  );
}
