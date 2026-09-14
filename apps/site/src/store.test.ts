/**
 * Checks what the store reads while the module is being evaluated, which is the only time it reads any of it.
 *
 * This file is the browser half: the initial state is a deep link — `?view=icons&group=model&q=foo&icon=Claude` has to arrive as the gallery, filtered, searched and with that brand open — and a parameter someone typed by hand has to fall back rather than put the page in a state the UI has no way out of. The Node half is store.server.test.ts, which runs in a real environment without a `window` rather than deleting one here.
 *
 * Each case imports the module afresh, because the reads happen once at evaluation and never again.
 */
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { urlFor } from "./store";

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

/**
 * The other direction: what the address bar should say for a given state.
 *
 * Only what the reader chose belongs in the URL. Writing all four parameters unconditionally is not a cosmetic problem — it put `?view=overview&group=all` on every first visit, which is a shareable link that looks like somebody made two selections, and that bug shipped once already.
 */
describe("the address a state should be at", () => {
  const base = "https://ailogo.yldm.ai/";
  const first = { filter: "all", query: "", selectedId: "", view: "overview" } as const;

  it("leaves a first visit's URL untouched", () => {
    expect(urlFor(first, base)).toBe(base);
  });

  it("writes only what differs from a first visit", () => {
    expect(urlFor({ ...first, view: "icons" }, base)).toBe(`${base}?view=icons`);
    expect(urlFor({ ...first, filter: "model" }, base)).toBe(`${base}?group=model`);
    expect(urlFor({ ...first, query: "hugging face" }, base)).toBe(`${base}?q=hugging+face`);
    expect(urlFor({ ...first, selectedId: "Claude" }, base)).toBe(`${base}?icon=Claude`);
  });

  it("clears a parameter when its state goes back to the default", () => {
    expect(urlFor(first, `${base}?view=icons&group=model&q=foo&icon=Claude`)).toBe(base);
  });

  // The language is pinned by a different mechanism and belongs to the reader's link, not to this state.
  it("leaves a parameter it does not own alone", () => {
    expect(urlFor({ ...first, view: "icons" }, `${base}?lang=ja`)).toBe(
      `${base}?lang=ja&view=icons`,
    );
  });
});
