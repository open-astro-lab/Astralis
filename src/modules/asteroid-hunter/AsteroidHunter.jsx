import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import MissionsPanel from "../../components/MissionsPanel.jsx";
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
  const { passport } = usePassport();
  const [activity, setActivity] = useState("blink");
  const idx = ACTIVITIES.findIndex((a) => a.key === activity);
  const Active = ACTIVITIES[idx].Component;
  const nextActivity = ACTIVITIES[idx + 1];

  const nextLabel = nextActivity
    ? t("asteroid_hunter.next_activity", { name: t(`asteroid_hunter.activities.${nextActivity.key}`) })
    : null;
  const onNext = nextActivity ? () => setActivity(nextActivity.key) : null;

  const done = passport?.asteroidInvestigations || [];
  const blinkCount = done.filter((d) => d.startsWith("round_")).length;
  const classifyCount = done.filter((d) => d.startsWith("classify_round_")).length;
  const rotationCount = done.filter((d) => d.startsWith("rotation_round_")).length;
  const hasAllQuizzes = ["asteroid_hunter_quiz", "orbit_classifier_quiz", "rotation_curve_quiz"].every((q) => done.includes(q));

  const missions = [
    { id: "blink_10", labelKey: "asteroid_hunter.missions.blink_10", done: blinkCount >= 10 },
    { id: "classify_10", labelKey: "asteroid_hunter.missions.classify_10", done: classifyCount >= 10 },
    { id: "rotation_10", labelKey: "asteroid_hunter.missions.rotation_10", done: rotationCount >= 10 },
    { id: "all_quizzes", labelKey: "asteroid_hunter.missions.all_quizzes", done: hasAllQuizzes },
  ];

  return (
    <div>
      <MissionsPanel headingKey="asteroid_hunter.missions_heading" missions={missions} category="asteroidInvestigations" />

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
