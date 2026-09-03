import { useTranslation } from "react-i18next";
import { usePassport } from "../context/PassportContext.jsx";
import ConfettiBurst from "./ConfettiBurst.jsx";

export default function LevelUpModal() {
  const { t } = useTranslation();
  const { levelUpEvent, clearLevelUpEvent } = usePassport();

  if (!levelUpEvent) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/85 backdrop-blur-sm"
      onClick={clearLevelUpEvent}
    >
      <div
        className="relative max-w-sm w-full rounded-2xl border border-starlight/50 bg-panel p-8 text-center shadow-glowGold"
        style={{ animation: "levelUpPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute left-1/2 top-6 -translate-x-1/2">
          <ConfettiBurst seed={levelUpEvent.id} />
        </div>
        <div className="text-4xl mb-3">🚀</div>
        <div className="text-xs uppercase tracking-widest text-starlight/80">
          {t("level_up.title")}
        </div>
        <div className="font-display text-2xl text-text mt-2">
          {t("level_up.subtitle")} {t(`passport.levels.${levelUpEvent.levelKey}`)}
        </div>
        <button
          onClick={clearLevelUpEvent}
          className="mt-6 px-6 py-2.5 rounded-full bg-nebula text-void font-medium text-sm hover:bg-nebulaSoft transition"
        >
          {t("level_up.close")}
        </button>
      </div>
    </div>
  );
}
