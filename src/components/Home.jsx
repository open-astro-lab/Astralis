import { useTranslation } from "react-i18next";
import AuthPrompt from "./AuthPrompt.jsx";
import Starfield from "./Starfield.jsx";
import FactOfTheDay from "./FactOfTheDay.jsx";
import DailyChallenge from "./DailyChallenge.jsx";
import OnboardingGuide from "./OnboardingGuide.jsx";
import OrbitalMap from "./OrbitalMap.jsx";
import { usePassport } from "../context/PassportContext.jsx";
import { totalCompleted, levelFor } from "../lib/passport";

export default function Home({ setView }) {
  const { t } = useTranslation();
  const { passport } = usePassport();
  const hasProgress = totalCompleted(passport) > 0;
  const levelKey = levelFor(passport);

  return (
    <div className="relative">
      <Starfield />
      <div className="relative max-w-5xl mx-auto px-6 py-16" style={{ zIndex: 1 }}>
        <OnboardingGuide />
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl md:text-5xl leading-tight text-text">
            {hasProgress
              ? t("home.welcome_back", { level: t(`passport.levels.${levelKey}`) })
              : t("home.heading")}
          </h1>
          <p className="text-muted text-lg mt-4">
            {hasProgress ? t("home.welcome_back_subtitle") : t("home.subheading")}
          </p>
        </div>

        <div className="mt-10">
          <AuthPrompt />
        </div>

        <h2 className="font-display text-sm uppercase tracking-widest text-muted mb-4 text-center">
          {t("home.modules_heading")}
        </h2>
        <OrbitalMap setView={setView} />

        <div className="mt-14 grid md:grid-cols-2 gap-4 items-start">
          <DailyChallenge />
          <FactOfTheDay />
        </div>
      </div>
    </div>
  );
}
