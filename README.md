# Astralis

A free, multilingual, interactive astronomy-learning web app for complete beginners — built for the Hack Club Stardance challenge.

Astralis is designed for people who currently think astronomy is too difficult or too distant, and turns it into something you experience hands-on rather than read about.

## Status

🚧 Early build. Live so far:
- Language picker + full i18n framework (English, Hindi — French/German can be added as new translation files with no code changes)
- **Astrophysics Lab → Escape Velocity**: a working interactive challenge — adjust a planet's mass and radius and see escape velocity calculated live, then reveal the real formula (`v = √(2GM/R)`)
- **Astronomy Passport**: tracks completed challenges in the browser (no login required) and computes a level (Curious → Explorer → Investigator → Scientist)

## Coming next

Universe Explorer, Sky Explorer, Exoplanet Hunter, Asteroid Hunter, and Stellar Detective modules, built one at a time.

## Tech stack

- React + Vite
- Tailwind CSS
- i18next / react-i18next for translations
- 100% client-side — no backend, no accounts, no API keys required. Progress is stored in the browser via `localStorage`.

## Running locally

```bash
npm install
npm run dev
```

## Scientific accuracy

All real astronomical values used (planet masses, radii, physical constants) are drawn from standard published data. Anything simulated for learning purposes is labeled as a simulation, not presented as real data.

## License

MIT
