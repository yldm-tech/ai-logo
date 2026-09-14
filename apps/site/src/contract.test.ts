/**
 * Keeps the hand-written files that describe this site honest about the site.
 *
 * index.html, sitemap.xml, robots.txt and CNAME each carry a copy of something the code also knows — the eleven languages, the origin, the tags the Head component rewrites at runtime. None of them are generated, so every one of them is a place where a language can be added to i18n and go missing from the crawler's view of the site, or where a selector can be renamed and leave Head silently writing nothing. That is the failure this file exists to make loud: not a crash, a page that quietly stops describing itself.
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vite-plus/test";

import { LANGUAGE_PARAM, LANGUAGES, SITE } from "./i18n";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file: string) => readFileSync(resolve(root, file), "utf8");

const html = read("index.html");
const sitemap = read("public/sitemap.xml");
const robots = read("public/robots.txt");
const cname = read("public/CNAME").trim();
const tags = LANGUAGES.map((language) => language.value);

describe("index.html", () => {
  // Head rewrites these at runtime by selector. A selector that matches nothing is a no-op, so a renamed or dropped tag would show up as a page whose title and description stop following the language — with nothing failing anywhere.
  it.each([
    'link[rel="canonical"]',
    'meta[name="description"]',
    'meta[property="og:title"]',
    'meta[property="og:description"]',
    'meta[property="og:locale"]',
    'meta[property="og:url"]',
    'meta[name="twitter:title"]',
    'meta[name="twitter:description"]',
  ])("ships %s for Head to rewrite", (selector) => {
    const [, attribute, value] = selector.match(/\[(\w+)="([^"]+)"\]/) ?? [];
    expect(html).toContain(`${attribute}="${value}"`);
  });

  it.each(tags)("advertises %s as an hreflang alternate", (tag) => {
    expect(html).toContain(`hreflang="${tag}" href="${SITE}/?${LANGUAGE_PARAM}=${tag}"`);
  });

  it("advertises x-default on the bare URL", () => {
    expect(html).toContain(`hreflang="x-default" href="${SITE}/"`);
  });

  it("advertises no language it does not ship", () => {
    const advertised = [...html.matchAll(/hreflang="([^"]+)"/g)].map((match) => match[1]);
    expect(advertised.sort()).toEqual([...tags, "x-default"].sort());
  });

  it("points at the origin the code uses", () => {
    expect(html).toContain(`href="${SITE}/"`);
    expect(SITE).toBe(`https://${cname}`);
  });
});

describe("sitemap.xml", () => {
  it.each(tags)("lists %s", (tag) => {
    expect(sitemap).toContain(`<loc>${SITE}/?${LANGUAGE_PARAM}=${tag}</loc>`);
  });

  it("lists no language the site does not ship", () => {
    const listed = [...sitemap.matchAll(/hreflang="([^"]+)"/g)].map((match) => match[1]);
    expect([...new Set(listed)].sort()).toEqual([...tags, "x-default"].sort());
  });

  it("lists the canonical page itself", () => {
    expect(sitemap).toContain(`<loc>${SITE}/</loc>`);
  });
});

describe("robots.txt", () => {
  // It has pointed at a sitemap that did not exist since it was written. The file is there now; this is what keeps the two of them pointing at each other.
  it("points at a sitemap that exists", () => {
    expect(robots).toContain(`Sitemap: ${SITE}/sitemap.xml`);
    expect(sitemap).toContain("<urlset");
  });

  it("names the host the site is served from", () => {
    expect(robots).toContain(`Host: ${SITE}`);
  });
});
