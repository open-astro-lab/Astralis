import { LEVELS } from "./levels.js";

const STORAGE_KEY = "astralis_passport_v1";

export const CATEGORY_KEYS = [
  "objectsExplored",
  "asteroidInvestigations",
  "exoplanetInvestigations",
  "stellarInvestigations",
  "physicsChallenges",
  "dailyChallenges",
  "systemBuilder",
];

export { LEVELS };

export function EMPTY_PASSPORT_SHAPE() {
  return {
    objectsExplored: [],
    asteroidInvestigations: [],
    exoplanetInvestigations: [],
    stellarInvestigations: [],
    physicsChallenges: [],
    dailyChallenges: [],
    systemBuilder: [],
    triviaBestScore: 0,
    streak: { count: 0, lastVisitDate: null },
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

// Only sums the real challenge categories — never the streak object, which
// isn't a completion count.
export function totalCompleted(passport) {
  return CATEGORY_KEYS.reduce((sum, key) => sum + (passport[key]?.length || 0), 0);
}

// LEVELS is sorted ascending by threshold; find the highest level whose
// minimum is at or below the current total.
export function levelFor(passport) {
  const total = totalCompleted(passport);
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (total >= lvl.min) current = lvl;
    else break;
  }
  return `level_${current.key}`;
}

export function levelProgress(passport) {
  const total = totalCompleted(passport);
  let idx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (total >= LEVELS[i].min) idx = i;
    else break;
  }
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] || null;
  const pct = next ? Math.min(100, ((total - current.min) / (next.min - current.min)) * 100) : 100;
  return { current, next, pct, total };
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

// Returns an updated passport with the visit streak bumped, only if today
// hasn't already been counted. Consecutive calendar days increment the
// streak; a gap of more than one day resets it to 1.
export function bumpStreak(passport) {
  const today = todayStr();
  const streak = passport.streak || { count: 0, lastVisitDate: null };
  if (streak.lastVisitDate === today) return passport; // already counted today

  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const newCount = streak.lastVisitDate === yesterday ? streak.count + 1 : 1;

  return { ...passport, streak: { count: newCount, lastVisitDate: today } };
}
