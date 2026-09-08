import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../context/PassportContext.jsx";
import { useSound } from "../context/SoundContext.jsx";

export default function StreakToast() {
  const { t } = useTranslation();
  const { streakEvent, clearStreakEvent } = usePassport();
  const { playCorrect } = useSound();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!streakEvent) return;
    setVisible(true);
    playCorrect();
    const timer = setTimeout(() => {
      setVisible(false);
      clearStreakEvent();
    }, 2600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streakEvent]);

  if (!visible || !streakEvent) return null;

  return (
    <div
      className="fixed top-20 left-1/2 -translate-x-1/2 z-40 pointer-events-none"
      style={{ animation: "fadeInScale 0.35s ease-out" }}
    >
      <div className="px-4 py-2 rounded-full bg-starlight/90 text-void font-mono text-sm font-semibold shadow-glowGold">
        {t("passport.streak_bonus_toast", { count: streakEvent.count })}
      </div>
    </div>
  );
}
