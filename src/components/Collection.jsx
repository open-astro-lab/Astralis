import { useTranslation } from "react-i18next";
import { usePassport } from "../context/PassportContext.jsx";

const UNIVERSE_CARDS = [
  { key: "galaxies", emoji: "🌌" }, { key: "nebulae", emoji: "🌫️" },
  { key: "black_holes", emoji: "⚫" }, { key: "stars", emoji: "⭐" },
  { key: "supernovae", emoji: "💥" }, { key: "star_clusters", emoji: "✨" },
  { key: "cmb", emoji: "📡" }, { key: "dark_matter", emoji: "🌑" },
  { key: "solar_system", emoji: "☀️" }, { key: "comets", emoji: "☄️" },
  { key: "habitable_zone", emoji: "🌍" }, { key: "andromeda", emoji: "🌠" },
  { key: "quasars", emoji: "💫" }, { key: "pulsars", emoji: "🔆" },
  { key: "brown_dwarfs", emoji: "🟤" }, { key: "local_group", emoji: "🌀" },
  { key: "big_bang", emoji: "💠" }, { key: "gravitational_waves", emoji: "🌊" },
];

const CONSTELLATION_CARDS = [
  { key: "ursa_major", emoji: "🐻" }, { key: "orion", emoji: "🏹" },
  { key: "cassiopeia", emoji: "👑" }, { key: "ursa_minor", emoji: "🐾" },
  { key: "leo", emoji: "🦁" }, { key: "scorpius", emoji: "🦂" },
  { key: "taurus", emoji: "🐂" }, { key: "cygnus", emoji: "🦢" },
  { key: "sagittarius", emoji: "🏹" },
];

function Card({ emoji, name, fact, unlocked, lockedLabel }) {
  return (
    <div
      className={`rounded-xl border p-4 text-center transition ${
        unlocked ? "border-nebula/40 bg-panel shadow-glow" : "border-white/10 bg-panel/40"
      }`}
    >
      <div className={`text-3xl mb-2 ${unlocked ? "" : "opacity-20 grayscale"}`}>{unlocked ? emoji : "❔"}</div>
      <div className={`font-display text-sm ${unlocked ? "text-text" : "text-muted"}`}>
        {unlocked ? name : lockedLabel}
      </div>
      {unlocked && <p className="text-muted text-xs mt-1.5 leading-relaxed">{fact}</p>}
    </div>
  );
}

export default function Collection() {
  const { t } = useTranslation();
  const { passport } = usePassport();
  const explored = passport?.objectsExplored || [];

  const universeCards = UNIVERSE_CARDS.map((c) => ({
    ...c,
    unlocked: explored.includes(`universe_${c.key}`),
    name: t(`universe_explorer.objects.${c.key}.name`),
    fact: t(`universe_explorer.objects.${c.key}.description`),
  }));
  const constellationCards = CONSTELLATION_CARDS.map((c) => ({
    ...c,
    unlocked: explored.includes(`${c.key}_quiz`),
    name: t(`sky_explorer.constellations.${c.key}.name`),
    fact: t(`sky_explorer.constellations.${c.key}.text`),
  }));

  const allCards = [...universeCards, ...constellationCards];
  const unlockedCount = allCards.filter((c) => c.unlocked).length;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl">{t("collection.title")}</h1>
      <p className="text-muted mt-2">{t("collection.subtitle")}</p>
      <div className="font-mono text-nebulaSoft text-sm mt-3">
        {t("collection.progress", { unlocked: unlockedCount, total: allCards.length })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8">
        {allCards.map((c) => (
          <Card
            key={c.key}
            emoji={c.emoji}
            name={c.name}
            fact={c.fact}
            unlocked={c.unlocked}
            lockedLabel={t("collection.locked_label")}
          />
        ))}
      </div>
    </div>
  );
}
