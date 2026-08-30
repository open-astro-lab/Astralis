import { useState } from "react";
import { useTranslation } from "react-i18next";
import TransitMethod from "./TransitMethod.jsx";
import RadialVelocity from "./RadialVelocity.jsx";
import HabitableZoneCalculator from "./HabitableZoneCalculator.jsx";

const ACTIVITIES = [
  { key: "transit", Component: TransitMethod },
  { key: "radial_velocity", Component: RadialVelocity },
  { key: "habitable_zone", Component: HabitableZoneCalculator },
];

export default function ExoplanetHunter() {
  const { t } = useTranslation();
  const [activity, setActivity] = useState("transit");
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
            {t(`exoplanet_hunter.activities.${a.key}`)}
          </button>
        ))}
      </div>
      <Active />
    </div>
  );
}
