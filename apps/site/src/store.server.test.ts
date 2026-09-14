/**
 * @vitest-environment node
 *
 * The other half of store.test.ts: what the store does where scripts/prerender.tsx runs it.
 *
 * There is no location, no storage and no system preference in Node, and a single unguarded read at module scope throws at import time and takes the whole prerender with it — so the build fails rather than the page, which is the good outcome only if this is checked somewhere. It gets a real Node environment rather than a jsdom one with `window` stubbed away: deleting a global that the module loader is itself using while a dynamic import is in flight is a race, and it was one — the two cases this replaces passed locally and timed out in CI.
 */
import { describe, expect, it } from "vite-plus/test";

describe("store, in the prerender", () => {
  it("has no browser to read and does not go looking for one", async () => {
    expect(globalThis.window).toBeUndefined();

    const { useStore } = await import("./store");
    const { filter, query, selectedId, theme, view } = useStore.getState();

    // A first visit's page, which is what belongs in the HTML a crawler reads: the overview, unfiltered, unsearched, nothing open, in light.
    expect({ filter, query, selectedId, view }).toEqual({
      filter: "all",
      query: "",
      selectedId: "",
      view: "overview",
    });
    expect(theme).toBe("light");
  });

  it("still toggles the theme, with nowhere to persist it", async () => {
    const { useStore } = await import("./store");

    useStore.getState().toggleTheme();

    expect(useStore.getState().theme).toBe("dark");
  });
});
