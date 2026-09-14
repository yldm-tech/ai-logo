import { create } from "zustand";

import { type Group, groups } from "./registry";

export type View = "overview" | "icons";
export type Filter = "all" | Group;

const THEME_KEY = "ai-logo-theme";

const isGroup = (value: string | null): value is Group => groups.includes((value ?? "") as Group);

/** The prerender runs this module in Node, where there is no location, no storage and no system preference. It renders the page a first-time visitor would get — the overview, in light, unfiltered — which is also what belongs in the HTML a crawler reads. */
const onClient = typeof window !== "undefined";

const initialParams = () => new URLSearchParams(onClient ? window.location.search : "");

/**
 * Storage is not always there to be read. Safari in private browsing, a browser with site data blocked, and an embedded webview with storage partitioned off all throw on `localStorage` rather than returning null — and this runs while the module is being evaluated, so an exception here takes the whole application down before React ever mounts, over a preference.
 */
const readStored = (): string | null => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
};

const writeStored = (theme: string) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // A reader who cannot persist the choice should still get the choice for this visit.
  }
};

/** Falls back to the system preference, which is what the reader gets before they have expressed one of their own. */
const initialTheme = (): "dark" | "light" => {
  if (!onClient) return "light";
  const stored = readStored();
  if (stored === "dark" || stored === "light") return stored;
  // `matchMedia` is not guaranteed even where `window` is: jsdom does not implement it, and neither do some embedded webviews. This runs at module scope, so calling it blind takes the application down before it mounts.
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

type State = {
  clear: () => void;
  reveal: (id: string) => void;
  filter: Filter;
  query: string;
  selectedId: string;
  setFilter: (filter: Filter) => void;
  setQuery: (query: string) => void;
  setView: (view: View) => void;
  select: (id: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
  view: View;
};

export const useStore = create<State>((set) => ({
  clear: () => set({ selectedId: "" }),

  filter: (() => {
    const value = initialParams().get("group");
    return isGroup(value) ? value : "all";
  })(),

  query: initialParams().get("q") ?? "",

  /** Jumping to a brand from the hero has to clear the search and the group filter with it. Both persist in the URL, so a reader who had filtered to models and then reloaded and clicked an application in the marquee was sent to a grid that did not contain it — and the panel cleared itself on arrival, leaving the gallery empty and nothing selected. */
  reveal: (id) => set({ filter: "all", query: "", selectedId: id, view: "icons" }),

  select: (id) => set((state) => ({ selectedId: state.selectedId === id ? "" : id })),

  selectedId: initialParams().get("icon") ?? "",

  setFilter: (filter) => set({ filter }),

  setQuery: (query) => set({ query }),

  // Landing on the gallery through `?view=icons` should not also restore someone else's search; only the deep link's own parameters are read at startup, and switching views by hand leaves the query alone.
  setView: (view) => set({ view }),

  theme: initialTheme(),

  toggleTheme: () =>
    set((state) => {
      const theme = state.theme === "light" ? "dark" : "light";
      if (onClient) writeStored(theme);
      return { theme };
    }),

  view: initialParams().get("view") === "icons" ? "icons" : "overview",
}));
