/**
 * Writes the overview into dist/index.html at build time.
 *
 * The page is client-rendered, so the HTML a crawler fetches was a single empty div. Google executes JavaScript eventually, but "eventually" is a second crawl on its own schedule, and everything else that reads a page — other search engines, link previewers, readers with scripting off, anything summarising a URL — only ever sees the first response. This puts the real copy there.
 *
 * It renders in Node rather than in a browser, which is why store.ts and i18n/index.ts check for a `window` before reaching for one: no Chrome to install in CI, no screenshot timing to get wrong, and the output is the same on every machine. What it renders is the page a first-time visitor gets — the overview, in English, in light — which is what index.html already advertises and what the `x-default` alternate points at. The gallery and the lookup card are behind a lazy boundary and an intersection check, so neither renders here, which is correct: they are not what this page is about.
 *
 * The client still calls createRoot rather than hydrateRoot. A reader whose browser asks for Chinese would hydrate Chinese markup onto English and get a mismatch, so React is left to discard this and render fresh. The markup is here for what reads the response, not to save the browser work.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { renderToString } from "react-dom/server";

import App from "../src/App";
import "../src/i18n";

const here = dirname(fileURLToPath(import.meta.url));
const file = resolve(here, "../dist/index.html");
const ROOT = '<div id="root"></div>';

const html = readFileSync(file, "utf8");

// Loud rather than quiet: a silent no-op here would ship an empty page that looks fine in a browser and is blank to everything else.
if (!html.includes(ROOT)) {
  throw new Error(`prerender: ${ROOT} not found in dist/index.html — did the build output change?`);
}

const markup = renderToString(<App />);

if (!markup.includes("<h1")) {
  throw new Error("prerender: rendered markup has no <h1>, so the overview did not render");
}

writeFileSync(file, html.replace(ROOT, `<div id="root">${markup}</div>`));

console.log(`prerendered ${(markup.length / 1024).toFixed(0)} kB of markup into dist/index.html`);
