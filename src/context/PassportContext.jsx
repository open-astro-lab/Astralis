import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, firebaseEnabled } from "../lib/firebase";
import { loadPassport, savePassport, EMPTY_PASSPORT_SHAPE } from "../lib/passport";

const PassportContext = createContext(null);

export function usePassport() {
  const ctx = useContext(PassportContext);
  if (!ctx) throw new Error("usePassport must be used within PassportProvider");
  return ctx;
}

async function fetchCloudPassport(uid) {
  try {
    const ref = doc(db, "passports", uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      return { ...EMPTY_PASSPORT_SHAPE(), ...snap.data() };
    }
    return EMPTY_PASSPORT_SHAPE();
  } catch (err) {
    // Never fall back to leaving stale (possibly another account's) data on
    // screen — an unreadable cloud passport must render as empty, not as
    // whatever was there before.
    console.error("Failed to load cloud passport:", err);
    return EMPTY_PASSPORT_SHAPE();
  }
}

async function writeCloudPassport(uid, passport) {
  const ref = doc(db, "passports", uid);
  await setDoc(ref, passport);
}

export function PassportProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(!firebaseEnabled);
  const [passport, setPassport] = useState(() => loadPassport());
  const [syncing, setSyncing] = useState(false);

  // Track auth state.
  useEffect(() => {
    if (!firebaseEnabled) return;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setAuthReady(true);

      if (firebaseUser) {
        // Signed in: the account's cloud passport is the single source of truth
        // for that account, on every device. CRITICAL: clear immediately so
        // the previous account's (or guest's) data is never shown, even
        // briefly, while the real data for this account is still loading —
        // that gap was exactly what caused progress to visually "leak"
        // between accounts.
        setPassport(EMPTY_PASSPORT_SHAPE());
        setSyncing(true);
        const cloud = await fetchCloudPassport(firebaseUser.uid);
        setPassport(cloud);
        setSyncing(false);
      } else {
        // Signed out: fall back to this device's local guest progress.
        setPassport(loadPassport());
      }
    });
    return unsubscribe;
  }, []);

  const complete = useCallback(
    async (category, activityId) => {
      setPassport((prev) => {
        const next = { ...prev };
        if (!next[category]) next[category] = [];
        if (!next[category].includes(activityId)) {
          next[category] = [...next[category], activityId];
        }
        // Persist in the background to whichever backend is active.
        if (user && firebaseEnabled) {
          writeCloudPassport(user.uid, next);
        } else {
          savePassport(next);
        }
        return next;
      });
    },
    [user]
  );

  const signIn = useCallback(async () => {
    if (!firebaseEnabled) return;
    await signInWithPopup(auth, googleProvider);
  }, []);

  const signOutUser = useCallback(async () => {
    if (!firebaseEnabled) return;
    await firebaseSignOut(auth);
  }, []);

  return (
    <PassportContext.Provider
      value={{ user, authReady, passport, complete, signIn, signOutUser, syncing, firebaseEnabled }}
    >
      {children}
    </PassportContext.Provider>
  );
}
