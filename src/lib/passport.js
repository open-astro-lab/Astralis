const STORAGE_KEY = "astralis_passport_v1";

const EMPTY_PASSPORT = {
  objectsExplored: [],
  asteroidInvestigations: [],
  exoplanetInvestigations: [],
  stellarInvestigations: [],
  physicsChallenges: [],
};

export function loadPassport() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_PASSPORT };
    return { ...EMPTY_PASSPORT, ...JSON.parse(raw) };
  } catch {
    return { ...EMPTY_PASSPORT };
  }
}

export function savePassport(passport) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(passport));
}

// Records a completed activity by id (e.g. "escape_velocity"), avoiding duplicates.
export function completeActivity(category, activityId) {
  const passport = loadPassport();
  if (!passport[category]) passport[category] = [];
  if (!passport[category].includes(activityId)) {
    passport[category].push(activityId);
    savePassport(passport);
  }
  return passport;
}

export function totalCompleted(passport) {
  return Object.values(passport).reduce((sum, arr) => sum + arr.length, 0);
}

export function levelFor(passport) {
  const total = totalCompleted(passport);
  if (total >= 15) return "level_scientist";
  if (total >= 8) return "level_investigator";
  if (total >= 3) return "level_explorer";
  return "level_curious";
}
