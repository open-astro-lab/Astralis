import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../../context/PassportContext.jsx";
import { useSound } from "../../context/SoundContext.jsx";
import Quiz from "../../components/Quiz.jsx";

const SYNODIC_MONTH_DAYS = 29.53058867;
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

const CONSTELLATIONS = [
  "ursa_major", "orion", "cassiopeia",
  "ursa_minor", "leo", "scorpius", "taurus", "cygnus", "sagittarius",
];

function ConstellationCard({ ckey }) {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const [expanded, setExpanded] = useState(false);
  const [opened, setOpened] = useState(false);

  function toggle() {
    if (!opened) {
      complete("objectsExplored", `constellation_${ckey}`);
      setOpened(true);
    }
    setExpanded((e) => !e);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-panel p-5">
      <button onClick={toggle} className="text-left w-full">
        <div className="font-display text-base">{t(`sky_explorer.constellations.${ckey}.name`)}</div>
        <p className="text-muted text-sm mt-2 leading-relaxed">{t(`sky_explorer.constellations.${ckey}.text`)}</p>
        <p className="text-nebulaSoft text-xs mt-3">
          {expanded ? "▲" : "▼"} {t("universe_explorer.tap_for_detail")}
        </p>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4 border-t border-white/10 pt-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-starlight/80 mb-1">
              {t("sky_explorer.constellation_labels.mythology_heading")}
            </div>
            <p className="text-muted text-sm leading-relaxed">{t(`sky_explorer.constellations.${ckey}.mythology`)}</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-starlight/80 mb-1">
              {t("sky_explorer.constellation_labels.tricks_heading")}
            </div>
            <p className="text-muted text-sm leading-relaxed">{t(`sky_explorer.constellations.${ckey}.tricks`)}</p>
          </div>
          <div>
            <div className="text-xs uppercase tracking-widest text-starlight/80 mb-1">
              {t("sky_explorer.constellation_labels.season_heading")}
            </div>
            <p className="text-muted text-sm leading-relaxed">{t(`sky_explorer.constellations.${ckey}.season`)}</p>
          </div>

          <div className="pt-2">
            <div className="text-xs uppercase tracking-widest text-nebulaSoft mb-2">
              {t("sky_explorer.constellation_labels.quiz_heading")}
            </div>
            <Quiz
              questions={[
                {
                  id: `${ckey}_q1`,
                  promptKey: `sky_explorer.constellations.${ckey}.quiz.q1.prompt`,
                  optionKeys: [
                    `sky_explorer.constellations.${ckey}.quiz.q1.opt1`,
                    `sky_explorer.constellations.${ckey}.quiz.q1.opt2`,
                    `sky_explorer.constellations.${ckey}.quiz.q1.opt3`,
                  ],
                  correctIndex: 0,
                  explainKey: `sky_explorer.constellations.${ckey}.quiz.q1.explain`,
                },
                {
                  id: `${ckey}_q2`,
                  promptKey: `sky_explorer.constellations.${ckey}.quiz.q2.prompt`,
                  optionKeys: [
                    `sky_explorer.constellations.${ckey}.quiz.q2.opt1`,
                    `sky_explorer.constellations.${ckey}.quiz.q2.opt2`,
                    `sky_explorer.constellations.${ckey}.quiz.q2.opt3`,
                  ],
                  correctIndex: 0,
                  explainKey: `sky_explorer.constellations.${ckey}.quiz.q2.explain`,
                },
                {
                  id: `${ckey}_q3`,
                  promptKey: `sky_explorer.constellations.${ckey}.quiz.q3.prompt`,
                  optionKeys: [
                    `sky_explorer.constellations.${ckey}.quiz.q3.opt1`,
                    `sky_explorer.constellations.${ckey}.quiz.q3.opt2`,
                    `sky_explorer.constellations.${ckey}.quiz.q3.opt3`,
                  ],
                  correctIndex: 0,
                  explainKey: `sky_explorer.constellations.${ckey}.quiz.q3.explain`,
                },
              ]}
              category="objectsExplored"
              activityId={`${ckey}_quiz`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const PHASE_OPTIONS = [
  "new_moon", "waxing_crescent", "first_quarter", "waxing_gibbous",
  "full_moon", "waning_gibbous", "last_quarter", "waning_crescent",
];

export default function SkyExplorer() {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const { playClick, playCorrect, playWrong } = useSound();
  const moon = useMemo(() => getMoonPhase(), []);
  const [moonGuess, setMoonGuess] = useState(null);
  const [moonRevealed, setMoonRevealed] = useState(false);
  const [planetAnswered, setPlanetAnswered] = useState(false);
  const [planetCorrect, setPlanetCorrect] = useState(false);

  function guessMoonPhase(key) {
    playClick();
    setMoonGuess(key);
  }

  function revealMoon() {
    playClick();
    setMoonRevealed(true);
    complete("objectsExplored", "moon_phase_guess");
  }

  function answerPlanet(choice) {
    if (planetAnswered) return;
    playClick();
    const correct = choice === "planet";
    setPlanetAnswered(true);
    setPlanetCorrect(correct);
    if (correct) {
      playCorrect();
      complete("objectsExplored", "planet_or_star_game");
    } else {
      playWrong();
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <h3 className="font-display text-lg mb-4">{t("sky_explorer.moon.heading")}</h3>

        {!moonRevealed ? (
          <div>
            <p className="text-text text-sm mb-4">{t("sky_explorer.moon_game.prompt")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PHASE_OPTIONS.map((key) => (
                <button
                  key={key}
                  onClick={() => guessMoonPhase(key)}
                  className={`px-3 py-2 rounded-lg border text-xs transition ${
                    moonGuess === key ? "border-nebula bg-panelLight text-text" : "border-white/10 text-muted hover:border-white/25"
                  }`}
                >
                  {t(`sky_explorer.moon.phases.${key}`)}
                </button>
              ))}
            </div>
            <button
              onClick={revealMoon}
              disabled={!moonGuess}
              className="mt-4 px-5 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition disabled:opacity-40"
            >
              {t("sky_explorer.moon_game.reveal_button")}
            </button>
          </div>
        ) : (
          <>
            <p className={`text-sm font-medium mb-4 ${moonGuess === moon.phaseKey ? "text-verified" : "text-starlight"}`}>
              {moonGuess === moon.phaseKey ? t("sky_explorer.moon_game.correct") : t("sky_explorer.moon_game.close")}
            </p>
            <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
              <MoonVisual fraction={moon.fraction} />
              <div>
                <div className="flex gap-8">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted">{t("sky_explorer.moon.phase_label")}</div>
                    <div className="font-display text-lg text-text mt-1">{t(`sky_explorer.moon.phases.${moon.phaseKey}`)}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted">{t("sky_explorer.moon.illumination_label")}</div>
                    <div className="font-mono text-lg text-starlight mt-1">{Math.round(moon.illumination * 100)}%</div>
                  </div>
                </div>
                <p className="text-muted text-sm mt-4 leading-relaxed">{t("sky_explorer.moon.explainer")}</p>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-panel p-6">
        <h3 className="font-display text-lg mb-3">{t("sky_explorer.planets.heading")}</h3>
        <p className="text-muted text-sm leading-relaxed mb-5">{t("sky_explorer.planets.text")}</p>

        <div className="rounded-xl border border-nebula/30 bg-void/50 p-4">
          <div className="text-xs uppercase tracking-widest text-nebulaSoft mb-2">
            {t("sky_explorer.planet_game.heading")}
          </div>
          <p className="text-text text-sm mb-3">{t("sky_explorer.planet_game.prompt")}</p>
          <div className="flex gap-2">
            <button
              onClick={() => answerPlanet("planet")}
              disabled={planetAnswered}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                planetAnswered && planetCorrect ? "border-verified/60 bg-verified/10" : "border-white/10 hover:border-white/25"
              }`}
            >
              {t("sky_explorer.planet_game.opt_planet")}
            </button>
            <button
              onClick={() => answerPlanet("star")}
              disabled={planetAnswered}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                planetAnswered && !planetCorrect ? "border-starlight/60 bg-starlight/10" : "border-white/10 hover:border-white/25"
              }`}
            >
              {t("sky_explorer.planet_game.opt_star")}
            </button>
          </div>
          {planetAnswered && (
            <p className={`text-xs mt-3 leading-relaxed ${planetCorrect ? "text-verified" : "text-starlight"}`}>
              {planetCorrect ? t("sky_explorer.planet_game.correct") : t("sky_explorer.planet_game.incorrect")}
            </p>
          )}
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg mb-4">{t("sky_explorer.constellations.heading")}</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {CONSTELLATIONS.map((ckey) => (
            <ConstellationCard key={ckey} ckey={ckey} />
          ))}
        </div>
      </div>
    </div>
  );
}
