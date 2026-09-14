import { readdirSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vite-plus/test";

import toc from "../src/toc.json";

/**
 * The rendered SVGs under packages/static-svg are what getLobeIconCDN hands out and what the docs
 * site serves at /svg/*. Nothing checked that they matched src/, so a variant could exist in code
 * with no file behind it — three did, because the renderer skipped subcomponents that index.ts had
 * never attached. A missing file is a 404 for anyone following the documented CDN paths.
 */
const variants = {
  hasBrand: "-brand",
  hasBrandColor: "-brand-color",
  hasColor: "-color",
  hasText: "-text",
  hasTextCn: "-text-cn",
  hasTextColor: "-text-color",
} as const;

const rendered = new Set(
  // Vitest runs this under jsdom, where import.meta.url is an http URL rather than a file one.
  readdirSync(resolve(process.cwd(), "packages/static-svg/icons"))
    .filter((file) => file.endsWith(".svg"))
    .map((file) => file.slice(0, -".svg".length)),
);

const expected = toc.flatMap((entry) => {
  const base = entry.id.toLowerCase();
  const param = entry.param as Record<string, boolean>;
  return [
    base,
    ...Object.entries(variants)
      .filter(([flag]) => param[flag])
      .map(([, suffix]) => base + suffix),
  ];
});

describe("every icon variant has a rendered SVG", () => {
  it("renders a file for each variant the toc advertises", () => {
    expect(expected.filter((slug) => !rendered.has(slug))).toEqual([]);
  });

  it("uses the documented slug form — lowercased, no separator between words", () => {
    // README documents this and got it wrong for two years; assert it rather than describe it.
    expect(rendered.has("adobefirefly")).toBe(true);
    expect(rendered.has("adobe-firefly")).toBe(false);
  });

  it("namespaces every id so two inlined files cannot collide", () => {
    // Six of these hardcoded id="a". Inlining any two of them on one page clipped the second.
    const colliding = ["crusoe", "cybercut", "openclaw", "phind-text", "rwkv", "together-text"];

    expect(colliding.filter((slug) => !rendered.has(slug))).toEqual([]);
  });
});
