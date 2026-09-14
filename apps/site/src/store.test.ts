/**
 * Checks what the store reads while the module is being evaluated, which is the only time it reads any of it.
 *
 * Two callers, two environments. In a browser the initial state is a deep link — `?view=icons&group=model&q=foo&icon=Claude` has to arrive as the gallery, filtered, searched and with that brand open, and a parameter someone typed by hand has to fall back rather than put the page in a state the UI has no way out of. In Node it is scripts/prerender.tsx, where there is no location, no storage and no system preference: a single unguarded read there throws at import time and takes the whole prerender with it, so the build fails rather than the page.
 *
 * Each case imports the module afresh, because the reads happen once at evaluation and never again.
 */
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

/** The four things a deep link carries. Theme is not among them — it is a preference, not a place. */
const place = (state: { filter: string; query: string; selectedId: string; view: string }) => ({
  filter: state.filter,
  query: state.query,
  selectedId: state.selectedId,
  view: state.view,
});

const FIRST_VISIT = { filter: "all", query: "", selectedId: "", view: "overview" };

const load = async (search = "") => {
  window.history.replaceState(null, "", `/${search}`);
  vi.resetModules();
  return (await import("./store")).useStore.getState();
};

/** What prerender.tsx runs: the same module with no `window` to reach for. */
const loadOnServer = async (search = "") => {
  window.history.replaceState(null, "", `/${search}`);
  vi.stubGlobal("window", undefined);
  vi.resetModules();
  return (await import("./store")).useStore.getState();
};

/** jsdom ships no `matchMedia`, so the system preference has to be given one. Real browsers have it; this is the test environment being thinner than the web, not the store reading something it should not. */
const systemPrefers = (scheme: "dark" | "light") => {
  window.matchMedia = ((query: string) => ({
    matches: scheme === "dark" && query.includes("dark"),
  })) as typeof window.matchMedia;
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  Reflect.deleteProperty(window, "matchMedia");
  localStorage.clear();
  window.history.replaceState(null, "", "/");
});

describe("store, in the prerender", () => {
  it("gives a first visit's page without reading the browser", async () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem");
    // Both are present and both say something other than the answer expected below, so a read that slipped through would show up as the wrong state rather than as nothing at all.
    systemPrefers("dark");
    localStorage.setItem("ai-logo-theme", "dark");

    const state = await loadOnServer("?view=icons&group=model&q=foo&icon=Claude");

    expect(place(state)).toEqual(FIRST_VISIT);
    expect(state.theme).toBe("light");
    expect(getItem).not.toHaveBeenCalled();
  });

  it("still toggles the theme, without a store to write it to", async () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    const { toggleTheme, ...state } = await loadOnServer();
    const store = (await import("./store")).useStore;

    toggleTheme();

    expect(state.theme).toBe("light");
    expect(store.getState().theme).toBe("dark");
    expect(setItem).not.toHaveBeenCalled();
  });
});

describe("store, on a client", () => {
  it("opens a plain URL on the overview", async () => {
    systemPrefers("light");
    expect(place(await load())).toEqual(FIRST_VISIT);
  });

  it("opens a deep link where it points", async () => {
    systemPrefers("light");
    const state = await load("?view=icons&group=model&q=foo&icon=Claude");

    expect(place(state)).toEqual({
      filter: "model",
      query: "foo",
      selectedId: "Claude",
      view: "icons",
    });
  });

  it("decodes the search the way the address bar wrote it", async () => {
    systemPrefers("light");
    // The gallery's own search box puts spaces in the URL, so what comes back has to be the string that was typed rather than its encoding.
    expect((await load("?q=hugging%20face")).query).toBe("hugging face");
  });

  // A parameter that means nothing is a parameter a reader typed or a link that rotted. Each one falls back on its own: `?group=bananas` must not leave the gallery filtering on a group that does not exist and showing nothing, and `?view=gallery` must not leave the page rendering neither view.
  it.each([
    ["?view=gallery", "a view that does not exist"],
    ["?view=ICONS", "the right view in the wrong case"],
    ["?view=", "an empty view"],
    ["?group=bananas", "a group that does not exist"],
    ["?group=Model", "the right group in the wrong case"],
    ["?group=", "an empty group"],
  ])("%s (%s) opens on the overview instead", async (search) => {
    systemPrefers("light");
    expect(place(await load(search))).toEqual(FIRST_VISIT);
  });

  // No such brand is not something the store can know — the gallery is what holds the ids — so an unknown one is carried through and the panel is left to find nothing. What matters here is that it does not become a filter or a view.
  it("carries an icon id through without judging it", async () => {
    systemPrefers("light");
    expect(place(await load("?icon=NoSuchBrand"))).toEqual({
      ...FIRST_VISIT,
      selectedId: "NoSuchBrand",
    });
  });

  it.each(["dark", "light"] as const)(
    "takes a stored %s theme over the system one",
    async (theme) => {
      systemPrefers(theme === "dark" ? "light" : "dark");
      localStorage.setItem("ai-logo-theme", theme);

      expect((await load()).theme).toBe(theme);
    },
  );

  it.each(["dark", "light"] as const)(
    "falls back to a system preference for %s",
    async (scheme) => {
      systemPrefers(scheme);
      expect((await load()).theme).toBe(scheme);
    },
  );

  it("ignores a stored value that is not a theme", async () => {
    systemPrefers("dark");
    localStorage.setItem("ai-logo-theme", "solarized");

    expect((await load()).theme).toBe("dark");
  });

  // Safari in private browsing and a partitioned webview throw on `localStorage` rather than returning null, and this read happens while the module is being evaluated — an exception here takes the application down before React mounts, over a preference.
  it("survives storage it is not allowed to read", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    systemPrefers("dark");

    expect((await load()).theme).toBe("dark");
  });

  it("survives storage it is not allowed to write", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("denied", "SecurityError");
    });
    systemPrefers("light");

    const state = await load();
    state.toggleTheme();

    expect((await import("./store")).useStore.getState().theme).toBe("dark");
  });
});
