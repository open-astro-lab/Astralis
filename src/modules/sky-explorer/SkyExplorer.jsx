import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import Quiz from "../../components/Quiz.jsx";

const SYNODIC_MONTH_DAYS = 29.53058867;
// Reference new moon: 2000-01-06 18:14 UTC — a standard epoch used for phase calculations.
const REFERENCE_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14, 0);

function getMoonPhase(date = new Date()) {
  const daysSince = (date.getTime() - REFERENCE_NEW_MOON) / 86400000;
  const phaseFraction = ((daysSince % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS / SYNODIC_MONTH_DAYS;
  const illumination = (1 - Math.cos(2 * Math.PI * phaseFraction)) / 2;

  const phases = [
    "new_moon", "waxing_crescent", "first_quarter", "waxing_gibbous",
    "full_moon", "waning_gibbous", "last_quarter", "waning_crescent",
  ];
  const idx = Math.floor(phaseFraction * 8 + 0.5) % 8;
  return { phaseKey: phases[idx], illumination, fraction: phaseFraction };
}

function MoonVisual({ fraction }) {
  // Approximate lit-fraction visual using two overlapping circles.
  const waxing = fraction < 0.5;
  const litWidth = Math.abs(Math.cos(fraction * 2 * Math.PI)) * 50;
  return (
    <div className="relative w-24 h-24 rounded-full bg-void border border-white/10 overflow-hidden mx-auto shadow-glowGold">
      <div className="absolute inset-0 rounded-full bg-panelLight" />
      <div
        className="absolute top-0 h-full bg-starlight"
        style={{
          width: "50%",
          left: waxing ? `${50 - litWidth}%` : "50%",
          borderRadius: waxing ? "999px 0 0 999px" : "0 999px 999px 0",
          opacity: 0.9,
        }}
      />
    </div>
  );
}

const CONSTELLATIONS = ["ursa_major", "orion", "cassiopeia"];

export default function SkyExplorer() {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [openedConstellations, setOpenedConstellations] = useState({});
  const moon = useMemo(() => getMoonPhase(), []);

  function openConstellation(key) {
    if (!openedConstellations[key]) {
      complete("objectsExplored", `constellation_${key}`);
      setOpenedConstellations((prev) => ({ ...prev, [key]: true }));
    }
  }

  const allConstellationsOpened = CONSTELLATIONS.every((k) => openedConstellations[k]);

  return (
    <div className="space-y-8">
      {/* Moon */}
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <h3 className="font-display text-lg mb-4">{t("sky_explorer.moon.heading")}</h3>
        <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
          <MoonVisual fraction={moon.fraction} />
          <div>
            <div className="flex gap-8">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted">
                  {t("sky_explorer.moon.phase_label")}
                </div>
                <div className="font-display text-lg text-text mt-1">
                  {t(`sky_explorer.moon.phases.${moon.phaseKey}`)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted">
                  {t("sky_explorer.moon.illumination_label")}
                </div>
                <div className="font-mono text-lg text-starlight mt-1">
                  {Math.round(moon.illumination * 100)}%
                </div>
              </div>
            </div>
            <p className="text-muted text-sm mt-4 leading-relaxed">
              {t("sky_explorer.moon.explainer")}
            </p>
          </div>
        </div>
      </div>

      {/* Planets */}
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <h3 className="font-display text-lg mb-3">{t("sky_explorer.planets.heading")}</h3>
        <p className="text-muted text-sm leading-relaxed">{t("sky_explorer.planets.text")}</p>
      </div>

      {/* Constellations */}
      <div>
        <h3 className="font-display text-lg mb-4">{t("sky_explorer.constellations.heading")}</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {CONSTELLATIONS.map((key) => (
            <button
              key={key}
              onClick={() => openConstellation(key)}
              className="text-left rounded-2xl border border-white/10 bg-panel p-5 hover:border-nebula hover:shadow-glow transition"
            >
              <div className="font-display text-base">
                {t(`sky_explorer.constellations.${key}.name`)}
              </div>
              <p className="text-muted text-sm mt-2 leading-relaxed">
                {t(`sky_explorer.constellations.${key}.text`)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {allConstellationsOpened && (
        <Quiz
          questions={[
            {
              id: "se_q1",
              promptKey: "sky_explorer.quiz.q1.prompt",
              optionKeys: ["sky_explorer.quiz.q1.opt1", "sky_explorer.quiz.q1.opt2", "sky_explorer.quiz.q1.opt3"],
              correctIndex: 0,
              explainKey: "sky_explorer.quiz.q1.explain",
            },
            {
              id: "se_q2",
              promptKey: "sky_explorer.quiz.q2.prompt",
              optionKeys: ["sky_explorer.quiz.q2.opt1", "sky_explorer.quiz.q2.opt2", "sky_explorer.quiz.q2.opt3"],
              correctIndex: 1,
              explainKey: "sky_explorer.quiz.q2.explain",
            },
          ]}
          category="objectsExplored"
          activityId="sky_explorer_quiz"
        />
      )}
    </div>
  );
}
