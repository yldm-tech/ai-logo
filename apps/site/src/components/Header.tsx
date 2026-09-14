import { version } from "@yldm-tech/ai-logo/package.json";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

import { Logo } from "../Logo";
import { REPO } from "../registry";
import { useStore, type View } from "../store";
import { LanguagePicker } from "./LanguagePicker";

const VIEWS: View[] = ["overview", "icons"];

const SunIcon = () => (
  <svg fill="none" height="16" viewBox="0 0 24 24" width="16">
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
    <path
      d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.8"
    />
  </svg>
);

const MoonIcon = () => (
  <svg fill="none" height="16" viewBox="0 0 24 24" width="16">
    <path
      d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth="1.8"
    />
  </svg>
);

const SearchIcon = () => (
  <svg fill="none" height="15" viewBox="0 0 24 24" width="15">
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.9" />
    <path d="m20 20-3.5-3.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.9" />
  </svg>
);

const GithubIcon = () => (
  <svg height="16" viewBox="0 0 24 24" width="16">
    <path
      d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.35-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.5 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"
      fill="currentColor"
    />
  </svg>
);

const iconButton =
  "grid size-9 cursor-pointer place-items-center rounded-lg border border-line bg-surface text-dim transition hover:border-line-strong hover:text-ink";

export const Header = () => {
  const { query, setQuery, setView, theme, toggleTheme, view } = useStore();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/72 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5 sm:gap-5">
        <button
          className="flex flex-none cursor-pointer items-center gap-2.5"
          onClick={() => setView("overview")}
          type="button"
        >
          <span className="grid size-8 place-items-center rounded-[10px] border border-line bg-surface text-ink shadow-sm">
            <Logo size={17} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-ink">AI Logo</span>
          <span className="hidden rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-faint sm:inline">
            v{version}
          </span>
        </button>

        {/* The two views are mutually exclusive and switch instantly, so this is a segmented control rather than navigation. The selected pill is one element that animates between slots — with two buttons each drawing their own background, the change would just pop. */}
        <nav className="flex flex-none rounded-xl border border-line bg-surface p-1">
          {VIEWS.map((id) => (
            <button
              aria-current={view === id}
              className="relative cursor-pointer rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors sm:px-4"
              key={id}
              onClick={() => setView(id)}
              type="button"
            >
              {view === id && (
                <motion.span
                  className="absolute inset-0 rounded-lg bg-elevated"
                  layoutId="view-pill"
                  transition={{ damping: 30, stiffness: 380, type: "spring" }}
                />
              )}
              <span className={`relative ${view === id ? "text-ink" : "text-dim"}`}>
                {t(`nav.${id}`)}
              </span>
            </button>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          {view === "icons" && (
            <label className="relative hidden sm:block">
              <span className="pointer-events-none absolute inset-y-0 start-3 grid place-items-center text-faint">
                <SearchIcon />
              </span>
              <input
                aria-label={t("nav.search")}
                className="w-[min(20rem,34vw)] rounded-lg border border-line bg-surface py-2 pe-3 ps-9 text-[13px] text-ink transition outline-none placeholder:text-faint focus:border-accent"
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("nav.search")}
                type="search"
                value={query}
              />
            </label>
          )}
          <LanguagePicker />
          <a
            aria-label={t("nav.github")}
            className={iconButton}
            href={REPO}
            rel="noreferrer"
            target="_blank"
          >
            <GithubIcon />
          </a>
          <button
            aria-label={theme === "light" ? t("nav.toDark") : t("nav.toLight")}
            className={iconButton}
            data-theme-toggle
            onClick={toggleTheme}
            type="button"
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
      </div>
    </header>
  );
};
