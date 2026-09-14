import { create } from "zustand";

import { type Group, groups } from "./registry";

export type View = "overview" | "icons";
export type Filter = "all" | Group;

const THEME_KEY = "ai-logo-theme";

const isGroup = (value: string | null): value is Group => groups.includes((value ?? "") as Group);

const initialParams = () => new URLSearchParams(window.location.search);

/** Falls back to the system preference, which is what the reader gets before they have expressed one of their own. */
const initialTheme = (): "dark" | "light" => {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

type State = {
  clear: () => void;
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
      localStorage.setItem(THEME_KEY, theme);
      return { theme };
    }),

  view: initialParams().get("view") === "icons" ? "icons" : "overview",
}));
