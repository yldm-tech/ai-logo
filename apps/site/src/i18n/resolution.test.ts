/**
 * Checks which bundle a language tag ends up reading, for the tags nobody tests by hand.
 *
 * This has been wrong once already: `nonExplicitSupportedLngs` was left off the init, and every region-tagged visitor — `de-AT`, `en-GB`, `pt-PT` — silently fell through to English, because `supportedLngs` is matched against the exact code before the base tag is tried. Nothing in the app failed; the page simply rendered in the wrong language for readers nobody on the team is.
 *
 * Two layers decide the answer and this checks both. `convertDetectedLanguage` rewrites what the detector saw, which is the only reason Traditional Chinese works: asked for `zh-HK`, i18next's own resolution walks down to the base tag `zh`, finds `zh-CN` first and serves the right language in the wrong script. Everything else is i18next's resolution doing the right thing on its own, which is worth pinning down precisely because nobody wrote it.
 */
import { afterAll, beforeEach, describe, expect, it } from "vite-plus/test";

import i18n, { LANGUAGE_KEY, LANGUAGE_PARAM } from "./index";

/** What `?lang=` in a shared link ends up reading. This is the detector's path: it is the query string that is converted, not the argument to `changeLanguage`. */
const detected = async (tag: string) => {
  window.history.replaceState(null, "", `/?${LANGUAGE_PARAM}=${tag}`);
  await i18n.changeLanguage();
  return i18n.resolvedLanguage;
};

/**
 * What a tag resolves to once it has been detected — i18next's own matching of a code against `supportedLngs`, with no detector in the way.
 *
 * The rules below that are about matching are asserted here rather than through `?lang=`, and deliberately so: the detector does not stop at its first hit, it returns what every source said at once, and i18next takes the first code in that list that is supported exactly. So `?lang=de-AT` read in an English browser resolves to English rather than to German — the navigator's own `en` is an exact match and outranks the base tag of the parameter the reader was sent. That is worth fixing in the detection config; it is not what these cases are about.
 */
const resolved = async (tag: string) => {
  await i18n.changeLanguage(tag);
  return i18n.resolvedLanguage;
};

beforeEach(() => {
  // The detector caches to localStorage, so without this each case would be reading the one before it.
  localStorage.removeItem(LANGUAGE_KEY);
  window.history.replaceState(null, "", "/");
});

afterAll(async () => {
  await i18n.changeLanguage("en");
  localStorage.removeItem(LANGUAGE_KEY);
  window.history.replaceState(null, "", "/");
});

describe("language resolution", () => {
  // Hong Kong, Macau and the explicit script tag all read Traditional Chinese. Left to i18next these land on zh-CN — the right language in the wrong script, which is the failure a reader notices immediately and a test never does.
  it.each(["zh-HK", "zh-Hant", "zh-Hant-HK", "zh-MO", "zh-TW"])(
    "%s reads Traditional Chinese",
    async (tag) => {
      expect(await detected(tag)).toBe("zh-TW");
    },
  );

  // A bare language tag takes the first region the site ships for it. Both of these are the widest-read variant, which is the point: there is no bare `zh` or `pt` bundle to fall back to.
  it.each([
    ["pt", "pt-BR"],
    ["zh", "zh-CN"],
  ])("%s reads %s", async (tag, expected) => {
    expect(await resolved(tag)).toBe(expected);
  });

  // A region the site does not ship for reads the language it does ship. This is the case `nonExplicitSupportedLngs` broke: `de-AT` is not in supportedLngs, and the base tag has to be tried before the fallback is.
  it.each([
    ["de-AT", "de"],
    ["en-GB", "en"],
    ["es-MX", "es"],
    ["fr-CA", "fr"],
    ["pt-PT", "pt-BR"],
  ])("%s reads %s", async (tag, expected) => {
    expect(await resolved(tag)).toBe(expected);
  });

  // Everything else is English, which is what index.html ships and what `x-default` points at.
  it.each(["cy", "is", "not-a-language", "tlh"])("%s falls back to English", async (tag) => {
    expect(await resolved(tag)).toBe("en");
  });

  // Naming the right bundle is only half of it. A reader in Hong Kong is looking at the strings, so this is the same rule asserted where they meet it: Traditional characters out of zh-TW.json, not the Simplified ones zh-CN.json would have given.
  it("serves the resolved bundle's own strings", async () => {
    await detected("zh-HK");
    expect(i18n.t("nav.icons")).toBe("圖示");
  });
});
