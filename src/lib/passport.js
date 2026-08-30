const STORAGE_KEY = "astralis_passport_v1";

export function EMPTY_PASSPORT_SHAPE() {
  return {
    objectsExplored: [],
    asteroidInvestigations: [],
    exoplanetInvestigations: [],
    stellarInvestigations: [],
    physicsChallenges: [],
  };
}

// Local (guest / per-device) storage — used only when signed out.
export function loadPassport() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PASSPORT_SHAPE();
    return { ...EMPTY_PASSPORT_SHAPE(), ...JSON.parse(raw) };
  } catch {
    return EMPTY_PASSPORT_SHAPE();
  }
}

export function savePassport(passport) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passport));
}

export function totalCompleted(passport) {
  return Object.values(passport).reduce((sum, arr) => sum + (arr?.length || 0), 0);
}

export function levelFor(passport) {
  const total = totalCompleted(passport);
  if (total >= 15) return "level_scientist";
  if (total >= 8) return "level_investigator";
  if (total >= 3) return "level_explorer";
  return "level_curious";
}
