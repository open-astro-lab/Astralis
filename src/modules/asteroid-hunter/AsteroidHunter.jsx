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
  const idx = ACTIVITIES.findIndex((a) => a.key === activity);
  const Active = ACTIVITIES[idx].Component;
  const nextActivity = ACTIVITIES[idx + 1];

  const nextLabel = nextActivity
    ? t("asteroid_hunter.next_activity", { name: t(`asteroid_hunter.activities.${nextActivity.key}`) })
    : null;
  const onNext = nextActivity ? () => setActivity(nextActivity.key) : null;

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
      <Active nextLabel={nextLabel} onNext={onNext} />
    </div>
  );
}
