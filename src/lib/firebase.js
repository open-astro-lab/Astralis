import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// If Firebase env vars aren't set, the app still runs — it just falls back
// to local-only (per-device) progress instead of account sync. This means
// the app never hard-crashes for a contributor who hasn't set up Firebase yet.
export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

export const app = firebaseEnabled ? initializeApp(firebaseConfig) : null;
export const auth = firebaseEnabled ? getAuth(app) : null;
export const db = firebaseEnabled ? getFirestore(app) : null;
export const googleProvider = firebaseEnabled ? new GoogleAuthProvider() : null;
