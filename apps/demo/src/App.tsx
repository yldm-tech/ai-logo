import * as AiLogo from "@yldm-tech/ai-logo";
import { toc } from "@yldm-tech/ai-logo";
import { useEffect, useMemo, useState } from "react";

import { Logo } from "./Logo";
import { Cdn, Hero, Install } from "./sections";
import "./styles.css";

type IconEntry = (typeof toc)[number];

/**
 * Every icon is a named export, so the toc doubles as an index into the module. A real app would import the handful it needs — see treeshake/entry.tsx — but a gallery wants all of them, and driving it off the toc proves the metadata and the exports line up for all 300-odd brands rather than the six the test samples.
 */
const registry = AiLogo as unknown as Record<string, CompoundIcon | undefined>;

type IconProps = { size?: number };
type CompoundIcon = React.ComponentType<IconProps> & {
  Avatar?: React.ComponentType<IconProps>;
  Color?: React.ComponentType<IconProps>;
  Combine?: React.ComponentType<IconProps>;
  Text?: React.ComponentType<IconProps>;
};

const VARIANTS = ["Color", "Text", "Combine", "Avatar"] as const;

const PKG = "@yldm-tech/ai-logo";

/** Hand-tokenised rather than pulling in a highlighter for a single line of code. */
const ImportLine = ({ name }: { name: string }) => {
  const source = `import { ${name} } from "${PKG}";`;
  const [copied, setCopied] = useState(false);

  const copy = () => {
    void navigator.clipboard?.writeText(source);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="snippet">
      <code>
        <span className="tok-keyword">import</span> <span className="tok-punct">{"{"}</span>{" "}
        <span className="tok-ident">{name}</span> <span className="tok-punct">{"}"}</span>{" "}
        <span className="tok-keyword">from</span>{" "}
        <span className="tok-string">&quot;{PKG}&quot;</span>
        <span className="tok-punct">;</span>
      </code>
      <button className="copy" onClick={copy} type="button">
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
};

const Mark = ({ entry, size = 30 }: { entry: IconEntry; size?: number }) => {
  const Icon = registry[entry.id];
  if (!Icon) return null;
  const Preferred = entry.param.hasColor && Icon.Color ? Icon.Color : Icon;
  return <Preferred size={size} />;
};

export default function App() {
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState(() =>
    new URLSearchParams(window.location.search).get("tab") === "components"
      ? "components"
      : "overview",
  );
  const [selectedId, setSelectedId] = useState(
    () => new URLSearchParams(window.location.search).get("icon") ?? "",
  );

  // The query string is for state the reader chose, so a param is written only once it differs from what you get by just opening the page. Writing them unconditionally put `?tab=overview&icon=Ace` on every first visit, which reads as a selection nobody made — Ace is only ever the alphabetically first brand.
  useEffect(() => {
    const url = new URL(window.location.href);
    const write = (key: string, value: string) => {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    };
    write("tab", tab === "components" ? tab : "");
    write("icon", selectedId);
    window.history.replaceState(null, "", url);
  }, [selectedId, tab]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    const available = toc.filter((entry) => registry[entry.id]);
    if (!q) return available;
    return available.filter(
      (entry) =>
        entry.id.toLowerCase().includes(q) ||
        String(entry.fullTitle ?? "")
          .toLowerCase()
          .includes(q) ||
        String(entry.group ?? "")
          .toLowerCase()
          .includes(q),
    );
  }, [query]);

  // A search that filters the selected icon out of the grid would otherwise leave the detail panel showing a brand that is no longer in the results. Clear it rather than substituting the first match: picking a different brand on the reader's behalf is how `Ace` used to end up selected before anyone had clicked anything.
  useEffect(() => {
    if (selectedId && !matches.some((entry) => entry.id === selectedId)) {
      setSelectedId("");
    }
  }, [matches, selectedId]);

  const selected = toc.find((entry) => entry.id === selectedId);
  const SelectedIcon = selected ? registry[selected.id] : undefined;

  return (
    <>
      <header className="head">
        <div className="wrap head-row">
          <a className="brand" href="#top">
            <Logo />
            <h1>AI Logo</h1>
          </a>
          <nav className="tabs">
            {(["overview", "components"] as const).map((name) => (
              <button
                aria-selected={tab === name}
                className="tab"
                key={name}
                onClick={() => setTab(name)}
                type="button"
              >
                {name === "overview" ? "Overview" : "Components"}
              </button>
            ))}
          </nav>
          <div className="head-right">
            {tab === "components" && (
              <input
                type="search"
                placeholder="Search brands, models, providers…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            )}
            <button
              className="toggle"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              type="button"
            >
              {theme === "light" ? "Dark" : "Light"}
            </button>
          </div>
        </div>
      </header>

      <main className="wrap">
        {tab === "overview" ? (
          <>
            <Hero onBrowse={() => setTab("components")} />
            <Install />
            <Cdn />
          </>
        ) : (
          <>
            <div className="list-head">
              <p className="sub">
                Imported as a dependency, so every mark below comes from the built <code>es/</code>{" "}
                output rather than from source — the same files a consumer installs.
              </p>
              <span className="count">
                {matches.length} of {toc.length} brands
              </span>
            </div>

            {selected && SelectedIcon && (
              <section className="detail">
                <div className="detail-head">
                  <h2>{selected.fullTitle || selected.id}</h2>
                  {selected.group && <span className="tag">{selected.group}</span>}
                  {selected.color && <span className="tag">{selected.color}</span>}
                </div>

                <div className="variants">
                  <div className="variant">
                    <span className="variant-art">
                      <SelectedIcon size={34} />
                    </span>
                    <span className="variant-label">&lt;{selected.id} /&gt;</span>
                  </div>
                  {VARIANTS.map((name) => {
                    const Variant = SelectedIcon[name];
                    if (!Variant) return null;
                    const wide = name === "Text" || name === "Combine";
                    return (
                      <div className={wide ? "variant variant--wide" : "variant"} key={name}>
                        <span className="variant-art">
                          <Variant size={wide ? 22 : 34} />
                        </span>
                        <span className="variant-label">
                          &lt;{selected.id}.{name} /&gt;
                        </span>
                      </div>
                    );
                  })}
                </div>

                <ImportLine name={selected.id} />
              </section>
            )}

            {matches.length === 0 ? (
              <p className="empty">Nothing matches “{query}”.</p>
            ) : (
              <div className="grid">
                {matches.map((entry) => (
                  <button
                    aria-pressed={entry.id === selectedId}
                    className="cell"
                    key={entry.id}
                    onClick={() => setSelectedId(entry.id)}
                    type="button"
                  >
                    <Mark entry={entry} />
                    <span className="cell-name">{entry.fullTitle || entry.id}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
