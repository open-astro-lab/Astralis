import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function Glossary() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");

  const terms = t("glossary.terms", { returnObjects: true });
  const entries = useMemo(() => {
    const list = Object.entries(terms || {}).map(([key, val]) => ({ key, ...val }));
    list.sort((a, b) => a.name.localeCompare(b.name, i18n.language));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const filtered = useMemo(() => {
    if (!query.trim()) return entries;
    const q = query.trim().toLowerCase();
    return entries.filter(
      (e) => e.name.toLowerCase().includes(q) || e.def.toLowerCase().includes(q)
    );
  }, [entries, query]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display text-3xl">{t("glossary.title")}</h1>
      <p className="text-muted mt-2 mb-6">{t("glossary.subtitle")}</p>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t("glossary.search_placeholder")}
        className="w-full px-4 py-3 rounded-xl bg-panel border border-white/10 text-text placeholder:text-muted focus:outline-none focus:border-nebula transition"
      />

      <div className="text-xs text-muted mt-2 mb-6 font-mono">
        {filtered.length} / {entries.length}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">{t("glossary.no_results")}</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <div key={entry.key} className="rounded-xl border border-white/10 bg-panel p-4">
              <div className="font-display text-base text-starlight">{entry.name}</div>
              <p className="text-muted text-sm mt-1.5 leading-relaxed">{entry.def}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
