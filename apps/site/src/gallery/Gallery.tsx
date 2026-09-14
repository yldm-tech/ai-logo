import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Code } from "../components/Code";
import { CopyButton } from "../components/Copy";
import { CDN, entries, type IconEntry, PKG, preferred, stats } from "../registry";
import { galleryRegistry } from "./registry";
import { type Filter, useStore } from "../store";

const FILTERS: { count: number; id: Filter; key: string }[] = [
  { count: stats.brands, id: "all", key: "all" },
  { count: stats.provider, id: "provider", key: "providers" },
  { count: stats.model, id: "model", key: "models" },
  { count: stats.application, id: "application", key: "apps" },
];

const VARIANTS = ["Color", "Avatar", "Text", "Combine"] as const;

/** A toc entry with no matching export would render an empty hole in the grid; filtering once here means nothing downstream has to guard against it. */
const available = entries.filter((entry) => galleryRegistry[entry.id]);

const Cell = ({
  entry,
  onSelect,
  selected,
}: {
  entry: IconEntry;
  onSelect: () => void;
  selected: boolean;
}) => {
  const Icon = preferred(galleryRegistry[entry.id], entry);
  if (!Icon) return null;

  return (
    <button
      aria-pressed={selected}
      className={`group flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border bg-surface px-2 pt-5 pb-3.5 transition duration-150 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-16px_rgb(0_0_0/40%)] ${
        selected ? "border-accent bg-accent-soft" : "border-line hover:border-line-strong"
      }`}
      onClick={onSelect}
      type="button"
    >
      <span className="text-ink transition-transform duration-150 group-hover:scale-110">
        <Icon size={28} />
      </span>
      <span className="max-w-full truncate text-[11px] text-dim group-hover:text-ink">
        {entry.fullTitle || entry.id}
      </span>
    </button>
  );
};

/** The brand's own files on the CDN. The slug is the component name lower-cased — see scripts/svgWorkflow, which names every export that way. */
const assetLinks = (entry: IconEntry) => {
  const slug = entry.id.toLowerCase();
  const colour = entry.param.hasColor ? `${slug}-color` : slug;
  return [
    { href: `${CDN}/svg/${colour}.svg`, label: "SVG" },
    { href: `${CDN}/png/light/${colour}.png`, label: "PNG" },
    { href: `${CDN}/webp/light/${colour}.webp`, label: "WebP" },
    ...(entry.param.hasAvatar ? [{ href: `${CDN}/avatar/${slug}.webp`, label: "Avatar" }] : []),
  ];
};

const Detail = ({ entry, onClose }: { entry: IconEntry; onClose: () => void }) => {
  const { t } = useTranslation();
  const Icon = galleryRegistry[entry.id];
  if (!Icon) return null;
  const importLine = `import { ${entry.id} } from "${PKG}";`;

  return (
    <motion.section
      animate={{ height: "auto", opacity: 1 }}
      className="overflow-hidden"
      exit={{ height: 0, opacity: 0 }}
      initial={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="mb-4 rounded-2xl border border-line bg-surface p-5 shadow-[0_18px_40px_-28px_rgb(0_0_0/45%)]">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-[17px] font-semibold tracking-tight text-ink">
            {entry.fullTitle || entry.id}
          </h2>
          {entry.group && (
            <span className="rounded-full bg-elevated px-2.5 py-0.5 text-[11px] text-dim">
              {entry.group}
            </span>
          )}
          {entry.color && (
            <span className="flex items-center gap-1.5 rounded-full bg-elevated px-2.5 py-0.5 font-mono text-[11px] text-dim">
              <span
                className="size-2.5 rounded-full ring-1 ring-line"
                style={{ background: entry.color }}
              />
              {entry.color}
            </span>
          )}
          <button
            className="ms-auto cursor-pointer rounded-lg border border-line px-2.5 py-1 text-[11px] text-dim transition hover:text-ink"
            onClick={onClose}
            type="button"
          >
            {t("gallery.close")}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
          {[undefined, ...VARIANTS].map((key) => {
            const Variant = key ? Icon[key] : Icon;
            if (!Variant) return null;
            const wide = key === "Text" || key === "Combine";
            return (
              <div
                className={`flex min-h-[6.5rem] flex-col items-center justify-center gap-2.5 overflow-hidden rounded-xl border border-dashed border-line px-3 py-4 ${
                  wide ? "col-span-2 sm:col-span-3 lg:col-span-3" : "lg:col-span-2"
                }`}
                key={key ?? "mono"}
              >
                <span className="grid max-w-full place-items-center text-ink [&>*]:max-w-full">
                  <Variant size={wide ? 22 : 34} />
                </span>
                <span className="max-w-full truncate font-mono text-[10.5px] text-faint" dir="ltr">
                  &lt;{entry.id}
                  {key ? `.${key}` : ""} /&gt;
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid gap-2.5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <Code code={importLine} copy={false} />
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton label={t("copy.copyImport")} value={importLine} />
            {assetLinks(entry).map(({ href, label }) => (
              <a
                className="rounded-lg border border-line px-2.5 py-1.5 text-[11px] font-medium text-dim transition hover:border-line-strong hover:bg-elevated hover:text-ink"
                href={href}
                key={label}
                rel="noreferrer"
                target="_blank"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export const Gallery = () => {
  const { clear, filter, query, select, selectedId, setFilter, setQuery } = useStore();
  const { t } = useTranslation();

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pool = available.filter((entry) => filter === "all" || entry.group === filter);
    if (!needle) return pool;
    return pool.filter(
      (entry) =>
        entry.id.toLowerCase().includes(needle) ||
        String(entry.fullTitle ?? "")
          .toLowerCase()
          .includes(needle) ||
        String(entry.group ?? "")
          .toLowerCase()
          .includes(needle),
    );
  }, [filter, query]);

  const selected = matches.find((entry) => entry.id === selectedId);

  // A filter that hides the open brand would otherwise leave the panel describing something the grid no longer shows. Clearing beats substituting the first match: picking a different brand on the reader's behalf is a decision nobody asked for.
  useEffect(() => {
    if (selectedId && !matches.some((entry) => entry.id === selectedId)) clear();
  }, [clear, matches, selectedId]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <label className="mb-4 block sm:hidden">
        <input
          aria-label={t("gallery.search")}
          className="w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none placeholder:text-faint focus:border-accent"
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("gallery.search")}
          type="search"
          value={query}
        />
      </label>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map(({ count, id, key }) => (
            <button
              className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] transition ${
                filter === id
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line bg-surface text-dim hover:border-line-strong hover:text-ink"
              }`}
              key={id}
              onClick={() => setFilter(id)}
              type="button"
            >
              {t(`gallery.${key}`)}
              <span className="ms-1.5 text-[11px] text-faint tabular-nums">{count}</span>
            </button>
          ))}
        </div>
        <span className="ms-auto text-[12.5px] text-faint tabular-nums">
          {t("gallery.shown", { count: matches.length })}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {selected && <Detail entry={selected} key={selected.id} onClose={clear} />}
      </AnimatePresence>

      {matches.length === 0 ? (
        <p className="py-20 text-center text-sm text-dim">{t("gallery.empty", { query })}</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-2.5">
          {matches.map((entry) => (
            <Cell
              entry={entry}
              key={entry.id}
              onSelect={() => select(entry.id)}
              selected={entry.id === selectedId}
            />
          ))}
        </div>
      )}
    </div>
  );
};
