# Astralis

A free, multilingual, interactive astronomy-learning web app for complete beginners — built for the Hack Club Stardance challenge.

Astralis turns astronomy into something you experience hands-on: real formulas you try before you're told the answer, real detection methods turned into games, and a Passport that tracks what you've genuinely completed.

## What's live

**Six modules:**
- **Astrophysics Lab** — 5 real formulas (escape velocity, orbital velocity, Kepler's Third Law, inverse-square law of light, Wien's Law), each interactive, each followed by a quiz
- **Universe Explorer** — 8 real astronomical concepts (galaxies, nebulae, black holes, stars, supernovae, star clusters, the Cosmic Microwave Background, dark matter/energy) + an interactive cosmic-scale slider + quiz
- **Sky Explorer** — real-time Moon phase (calculated, not fake), visible planets, 3 constellations + quiz
- **Exoplanet Hunter** — identify a real transit light curve, then estimate planet size from dip depth + quiz
- **Asteroid Hunter** — 8 rounds of increasing-difficulty blink-comparison challenges (the real technique astronomers use) + quiz
- **Stellar Detective** — classify stars by real temperature-to-color-to-spectral-class relationships across 5 rounds + quiz

**Every quiz counts as a completed challenge** and only passing it marks that concept complete in the Passport — it's not just decorative.

**Astronomy Passport** — tracks every completed activity by category and computes a level (Curious → Explorer → Investigator → Scientist).

**Accounts** — optional Google Sign-In via Firebase. Signed in: your Passport is tied to your account and follows you across every device. Signed out (guest mode): progress is saved locally to that one device/browser only, with a visible banner explaining this.

## Tech stack

- React + Vite, Tailwind CSS
- i18next / react-i18next — English and Hindi complete (matching key structure, ready for more languages)
- Firebase Authentication (Google Sign-In) + Firestore (per-account passport sync)
- 100% free-tier hosting on Vercel/Netlify

## Setting up Firebase (required for login + cross-device sync)

The app runs and is fully playable without this — it just falls back to local-only guest progress. To enable accounts:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → Add project (free).
2. In your project, go to **Build → Authentication → Sign-in method** and enable **Google**.
3. Go to **Build → Firestore Database → Create database** (start in production mode).
4. In Firestore → **Rules**, paste the contents of `firestore.rules` from this repo and publish.
5. Go to **Project settings → General → Your apps → Add app (Web)**. Copy the config values shown.
6. Copy `.env.example` to `.env` and fill in those values (for local dev).
7. In your Vercel project → **Settings → Environment Variables**, add the same 6 `VITE_FIREBASE_*` values, then redeploy.

## Running locally

```bash
npm install
npm run dev
```

## Scientific accuracy

All real astronomical values, formulas, and constants used are standard published figures. Anything simulated for learning purposes (asteroid star fields, exoplanet light curves) is clearly labeled as a simulation, never presented as real data.

## License

MIT
