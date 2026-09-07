import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import MissionsPanel from "../../components/MissionsPanel.jsx";
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
  const { passport } = usePassport();
  const [activity, setActivity] = useState("transit");
  const idx = ACTIVITIES.findIndex((a) => a.key === activity);
  const Active = ACTIVITIES[idx].Component;
  const nextActivity = ACTIVITIES[idx + 1];

  const nextLabel = nextActivity
    ? t("exoplanet_hunter.next_activity", { name: t(`exoplanet_hunter.activities.${nextActivity.key}`) })
    : null;
  const onNext = nextActivity ? () => setActivity(nextActivity.key) : null;

  const done = passport?.exoplanetInvestigations || [];
  const transitCount = done.filter((d) => d.startsWith("round_")).length;
  const rvCount = done.filter((d) => d.startsWith("rv_round_")).length;
  const habitableUsed = done.includes("habitable_zone_calculator");
  const hasAllQuizzes = ["exoplanet_hunter_quiz", "radial_velocity_quiz", "habitable_zone_quiz"].every((q) => done.includes(q));

  const missions = [
    { id: "transit_10", labelKey: "exoplanet_hunter.missions.transit_10", done: transitCount >= 10 },
    { id: "rv_10", labelKey: "exoplanet_hunter.missions.rv_10", done: rvCount >= 10 },
    { id: "habitable_used", labelKey: "exoplanet_hunter.missions.habitable_used", done: habitableUsed },
    { id: "all_quizzes", labelKey: "exoplanet_hunter.missions.all_quizzes", done: hasAllQuizzes },
  ];

  return (
    <div>
      <MissionsPanel headingKey="exoplanet_hunter.missions_heading" missions={missions} category="exoplanetInvestigations" />

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
      <Active nextLabel={nextLabel} onNext={onNext} />
    </div>
  );
}
