import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import Quiz from "../../components/Quiz.jsx";

export default function HabitableZoneCalculator() {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [luminosity, setLuminosity] = useState(1);
  const [planetDistance, setPlanetDistance] = useState(1);
  const [interacted, setInteracted] = useState(false);

  const habitableDistance = useMemo(() => Math.sqrt(luminosity), [luminosity]);
  const inZone = Math.abs(planetDistance - habitableDistance) <= habitableDistance * 0.2;

  function handleInteract() {
    if (!interacted) {
      setInteracted(true);
      complete("exoplanetInvestigations", "habitable_zone_calculator");
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-panel p-6 md:p-8">
        <h3 className="font-display text-lg">{t("exoplanet_hunter.habitable_zone.heading")}</h3>
        <p className="text-muted text-sm mt-2 mb-6 leading-relaxed max-w-xl">
          {t("exoplanet_hunter.habitable_zone.instruction")}
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-muted mb-2">
              {t("exoplanet_hunter.habitable_zone.luminosity_label")}
            </label>
            <input
              type="range"
              min="0.01"
              max="20"
              step="0.01"
              value={luminosity}
              onChange={(e) => {
                setLuminosity(parseFloat(e.target.value));
                handleInteract();
              }}
              className="w-full accent-nebula"
            />
            <div className="font-mono text-nebulaSoft text-sm mt-1">{luminosity.toFixed(2)} × L☉</div>

            <label className="block text-sm text-muted mb-2 mt-5">
              {t("exoplanet_hunter.habitable_zone.planet_distance_label")}
            </label>
            <input
              type="range"
              min="0.05"
              max="10"
              step="0.01"
              value={planetDistance}
              onChange={(e) => {
                setPlanetDistance(parseFloat(e.target.value));
                handleInteract();
              }}
              className="w-full accent-nebula"
            />
            <div className="font-mono text-nebulaSoft text-sm mt-1">{planetDistance.toFixed(2)} AU</div>
          </div>

          <div className="rounded-xl border border-nebula/30 bg-void/60 p-5 text-center flex flex-col justify-center">
            <div className="text-xs uppercase tracking-widest text-muted">
              {t("exoplanet_hunter.habitable_zone.result_label")}
            </div>
            <div className="font-mono text-3xl text-starlight mt-1">{habitableDistance.toFixed(2)} AU</div>
            <div className={`text-sm mt-4 font-medium ${inZone ? "text-verified" : "text-starlight/80"}`}>
              {inZone
                ? t("exoplanet_hunter.habitable_zone.verdict_in_zone")
                : t("exoplanet_hunter.habitable_zone.verdict_out_zone")}
            </div>
          </div>
        </div>
      </div>

      {interacted && (
        <Quiz
          questions={[
            {
              id: "hz_q1",
              promptKey: "exoplanet_hunter.habitable_zone.quiz.q1.prompt",
              optionKeys: [
                "exoplanet_hunter.habitable_zone.quiz.q1.opt1",
                "exoplanet_hunter.habitable_zone.quiz.q1.opt2",
                "exoplanet_hunter.habitable_zone.quiz.q1.opt3",
              ],
              correctIndex: 0,
              explainKey: "exoplanet_hunter.habitable_zone.quiz.q1.explain",
            },
          ]}
          category="exoplanetInvestigations"
          activityId="habitable_zone_quiz"
        />
      )}
    </div>
  );
}
