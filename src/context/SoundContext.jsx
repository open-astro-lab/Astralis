import { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import * as sound from "../lib/sound.js";

const SoundContext = createContext(null);

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used within SoundProvider");
  return ctx;
}

export function SoundProvider({ children }) {
  const [enabled, setEnabled] = useState(() => {
    const stored = localStorage.getItem("astralis_sound_enabled");
    return stored === null ? true : stored === "true";
  });
  const unlockedRef = useRef(false);

  // Browsers block audio until a real user gesture — start the ambient pad
  // on the very first tap/click anywhere, if sound is enabled.
  useEffect(() => {
    function unlock() {
      if (unlockedRef.current) return;
      unlockedRef.current = true;
      if (enabled) sound.startAmbient();
      document.removeEventListener("pointerdown", unlock);
    }
    document.addEventListener("pointerdown", unlock);
    return () => document.removeEventListener("pointerdown", unlock);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("astralis_sound_enabled", String(enabled));
    if (enabled && unlockedRef.current) {
      sound.startAmbient();
    } else {
      sound.stopAmbient();
    }
  }, [enabled]);

  const toggle = useCallback(() => setEnabled((e) => !e), []);
  const playClick = useCallback(() => { if (enabled) sound.playClick(); }, [enabled]);
  const playCorrect = useCallback(() => { if (enabled) sound.playCorrect(); }, [enabled]);
  const playWrong = useCallback(() => { if (enabled) sound.playWrong(); }, [enabled]);
  const playLevelUp = useCallback(() => { if (enabled) sound.playLevelUp(); }, [enabled]);

  return (
    <SoundContext.Provider value={{ enabled, toggle, playClick, playCorrect, playWrong, playLevelUp }}>
      {children}
    </SoundContext.Provider>
  );
}
