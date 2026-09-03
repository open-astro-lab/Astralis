import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../context/PassportContext.jsx";

export default function XpToast() {
  const { t } = useTranslation();
  const { xpEvent } = usePassport();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!xpEvent) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 1100);
    return () => clearTimeout(timer);
  }, [xpEvent]);

  if (!visible || !xpEvent) return null;

  return (
    <div
      key={xpEvent.id}
      className="fixed top-20 right-6 z-40 pointer-events-none"
      style={{ animation: "xpFloat 1.1s ease-out forwards" }}
    >
      <div className="px-3 py-1.5 rounded-full bg-verified/90 text-void font-mono text-sm font-semibold shadow-glow">
        {t("xp_toast")} XP
      </div>
    </div>
  );
}
