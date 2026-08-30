import { useState } from "react";
import { useTranslation } from "react-i18next";
import BlinkComparison from "./BlinkComparison.jsx";
import OrbitClassifier from "./OrbitClassifier.jsx";
import RotationCurveReader from "./RotationCurveReader.jsx";

const ACTIVITIES = [
  { key: "blink", Component: BlinkComparison },
  { key: "classify", Component: OrbitClassifier },
  { key: "rotation", Component: RotationCurveReader },
];

export default function AsteroidHunter() {
  const { t } = useTranslation();
  const [activity, setActivity] = useState("blink");
  const Active = ACTIVITIES.find((a) => a.key === activity).Component;

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {ACTIVITIES.map((a) => (
          <button
            key={a.key}
            onClick={() => setActivity(a.key)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              activity === a.key
                ? "bg-nebula text-void font-medium"
                : "border border-white/10 text-muted hover:text-text hover:border-white/25"
            }`}
          >
            {t(`asteroid_hunter.activities.${a.key}`)}
          </button>
        ))}
      </div>
      <Active />
    </div>
  );
}
