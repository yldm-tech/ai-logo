// @vitest-environment node

/**
 * Renders the app the way scripts/prerender.tsx does and reads the HTML it would write into dist/index.html.
 *
 * That file is what everything which does not run JavaScript sees of this site: other search engines, link previewers, a reader with scripting off, anything summarising a URL. It is also the one output nobody looks at — the browser fills the page in a moment later either way, so markup that went missing here would go on being invisible for as long as nobody thought to view source. The prerender script's own guard is a check for `<h1`, which an empty page passes as soon as a heading survives.
 *
 * It runs in Node rather than jsdom deliberately: `window` is what store.ts and motion.ts branch on, so a prerender asserted under jsdom would be asserting the client's output and would have missed exactly the bug below.
 */
import { renderToString } from "react-dom/server";
import { beforeAll, describe, expect, it } from "vite-plus/test";

import App from "./App";
import i18n from "./i18n";
import { entries, stats } from "./registry";

let markup = "";

beforeAll(() => {
  markup = renderToString(<App />);
});

/** Every inline style in the document, which is where a motion component's initial state lands when it is rendered in Node. */
const inlineStyles = () => [...markup.matchAll(/style="([^"]*)"/g)].map(([, style]) => style);

const count = (tag: string) => markup.split(`<${tag}`).length - 1;

describe("the prerendered page", () => {
  it("renders the page rather than an empty div", () => {
    expect(markup.length).toBeGreaterThan(20_000);
    expect(count("h1")).toBe(1);
    // One per section: variants, features, install and the CDN. A crawler reads the outline before it reads the copy.
    expect(count("h2")).toBeGreaterThanOrEqual(4);
  });

  it("renders it in English, which is what index.html advertises", () => {
    // There is no navigator to detect in Node, so this is the one language the file can be in — and the `x-default` alternate and index.html's own copy both say so.
    expect(i18n.resolvedLanguage).toBe("en");
  });

  // Read out of the locale file rather than written down here, so this keeps checking the copy that is actually shipped when someone rewrites it.
  it.each([
    "hero.sub",
    "variants.title",
    "variants.sub",
    "features.title",
    "features.sub",
    "install.title",
    "cdn.title",
    "stats.brands",
    "footer.tagline",
  ])("carries %s", (key) => {
    expect(markup).toContain(i18n.t(key));
  });

  it("carries the headline, both halves of it", () => {
    // hero.title is one string with `<a>` around the accented half, so a Trans that failed to match its components would drop the second half or render the tag as text.
    expect(markup).toContain("Every AI brand,");
    expect(markup).toContain("one import");
    expect(markup).not.toContain("<a>one import</a>");
  });

  it("carries the figures it claims, counted from the package", () => {
    expect(markup).toContain(`>${stats.brands}<`);
    expect(markup).toContain(`>${stats.color}<`);
  });

  it("names brands", () => {
    // The marquee's tiles are the brand names in the first response — a `title` and an `aria-label` each, because an inline SVG on its own is not a name. The second track is skipped in Node, so each brand should be named once rather than twice.
    for (const id of ["OpenAI", "Claude", "Gemini", "Mistral", "DeepSeek"]) {
      const entry = entries.find((item) => item.id === id);
      expect(markup, `${id} is not in the prerendered markup`).toContain(
        `aria-label="${entry?.fullTitle || id}"`,
      );
    }
  });

  // The bug this is here for: an entrance animation's `initial` is an inline style, so `initial={{ opacity: 0 }}` rendered in Node shipped a page whose sections were all `style="opacity:0"` — correct-looking markup that a crawler reads as hidden text and a reader without scripting sees as a blank page. Nothing failed; the build printed its kilobytes and the browser animated them back in.
  it("ships nothing hidden", () => {
    expect(inlineStyles().filter((style) => /opacity:\s*0(?![.\d])/.test(style))).toEqual([]);
    expect(
      inlineStyles().filter((style) => /(display:\s*none|visibility:\s*hidden)/.test(style)),
    ).toEqual([]);
    // The attribute itself, not `aria-hidden`: the decorative SVGs and the marquee's echo track are supposed to carry that one.
    expect(markup).not.toMatch(/\shidden=""/);
  });

  it("leaves the gallery out of it", () => {
    // 323 brands behind a lazy boundary, and an intersection check in front of the lookup card: neither belongs in the first response, and both would be several hundred kilobytes of it.
    expect(markup).not.toContain(i18n.t("gallery.search"));
    expect(markup.length).toBeLessThan(400_000);
  });
});
