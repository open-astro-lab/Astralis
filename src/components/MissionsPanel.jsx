import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { usePassport } from "../context/PassportContext.jsx";
import { useSound } from "../context/SoundContext.jsx";

/**
 * missions: [{ id, labelKey, done: boolean }]
 * category: passport category to award XP under when a mission first completes
 */
export default function MissionsPanel({ headingKey, missions, category }) {
  const { t } = useTranslation();
  const { complete } = usePassport();
  const { playCorrect } = useSound();
  const awardedRef = useRef({});

  useEffect(() => {
    missions.forEach((m) => {
      if (m.done && !awardedRef.current[m.id]) {
        awardedRef.current[m.id] = true;
        complete(category, `mission_${m.id}`);
        playCorrect();
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missions.map((m) => m.done).join(",")]);

  return (
    <div className="rounded-2xl border border-nebula/30 bg-void/50 p-6 mb-6">
      <h2 className="font-display text-lg mb-4">{t(headingKey)}</h2>
      <div className="grid sm:grid-cols-2 gap-2">
        {missions.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm transition ${
              m.done ? "border-verified/50 bg-verified/10 text-text" : "border-white/10 text-muted"
            }`}
          >
            <span>{m.done ? "✅" : "⬜"}</span>
            <span>{t(m.labelKey)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
