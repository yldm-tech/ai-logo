/**
 * Guards the thing that is easy to break and invisible until someone complains: importing one icon must not pull in all 323.
 *
 * `vp pack --unbundle` emits one module per source file, so a bundler can drop the brands an app never imports. Without that flag the whole icon set lands in one module and nothing can be shaken out of it — that regression measured 3219 kB against the 216 kB here, a 14x jump, and it type-checked and tested clean the whole way. Only a bundle size check catches it.
 *
 * The second budget exists because the first one only ever measured the path that was never in doubt. ProviderIcon, ModelIcon and AgentIcon resolve an arbitrary string to a component through a lookup table, and providerConfig.tsx imports 143 icons statically to build it, so importing one of them costs roughly eight times a direct icon import. That is inherent to a runtime string lookup rather than a regression — what is worth guarding is that it does not quietly grow further, and that nobody reads the README's tree-shaking line as covering these components.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, "..");

const cases = [
  {
    // Generous enough not to trip on a legitimately grown icon, tight enough that a whole-set regression cannot hide under it.
    config: "vite.treeshake.config.ts",
    label: "single icon (import { OpenAI })",
    limitKb: 600,
    outDir: "dist-treeshake",
  },
  {
    // Measured at 1691 kB. The headroom covers new brands entering the table; a jump past it means something started pulling in more than providerConfig's 143.
    config: "vite.treeshake-lookup.config.ts",
    label: "lookup component (import { ProviderIcon })",
    limitKb: 2200,
    outDir: "dist-treeshake-lookup",
  },
];

let failed = false;

const over = (label, actualKb, limitKb, advice) => {
  failed = true;
  console.error(
    `\nBundle budget exceeded. ${label} produced ${actualKb.toFixed(0)} kB against a ${limitKb} kB limit.\n${advice}\n`,
  );
};

for (const { config, label, limitKb, outDir } of cases) {
  execFileSync("vp", ["build", "--config", config], { cwd: siteRoot, stdio: "inherit" });

  const assets = join(siteRoot, outDir, "assets");
  const bundles = readdirSync(assets).filter((file) => file.endsWith(".js"));
  const totalKb = bundles.reduce((sum, file) => sum + statSync(join(assets, file)).size, 0) / 1024;

  console.log(`\n${label}: ${totalKb.toFixed(0)} kB (limit ${limitKb} kB)`);

  if (totalKb > limitKb) {
    over(
      label,
      totalKb,
      limitKb,
      "For the single-icon case, check that the build still passes --unbundle to vp pack.",
    );
  }
}

/**
 * The third budget is the site's own, and it measures a different thing: not what a consumer pays to import one icon, but what a reader pays to open the landing page before they have asked for anything.
 *
 * It is the entry chunk plus everything the entry imports statically — which is the definition of the critical path, and the number that quietly became 3.4 MB once the gallery reached for the package's whole namespace. The gallery and the string-lookup table are deliberately excluded: they are behind a lazy boundary and an intersection check, so they are not on this path, and a budget that counted them would either have to be so loose it caught nothing or would fail the moment someone added a brand.
 *
 * 1400 kB is the measured 1230 kB plus room for a hundred more brands in the marquee. A jump past it means something came back onto the critical path — most likely a static import of the gallery's registry.
 */
const SITE_LIMIT_KB = 1400;

execFileSync("vp", ["build"], { cwd: siteRoot, stdio: "inherit" });

const html = readFileSync(join(siteRoot, "dist/index.html"), "utf8");
const entry = html.match(/<script[^>]+src="\/(assets\/[^"]+\.js)"/)?.[1];

if (!entry) {
  failed = true;
  console.error(
    "\nCould not find the entry script in dist/index.html, so the site budget measured nothing.\n",
  );
} else {
  // Whatever the entry pulls in before it runs. `dist/assets/*.js` also holds the lazy chunks, so they have to be followed rather than summed.
  const seen = new Set();
  const walk = (file) => {
    if (seen.has(file)) return;
    seen.add(file);
    const source = readFileSync(join(siteRoot, "dist", file), "utf8");
    for (const match of source.matchAll(/from\s*"\.\/([A-Za-z0-9_-]+\.js)"/g)) {
      walk(`assets/${match[1]}`);
    }
  };
  walk(entry);

  const criticalKb =
    [...seen].reduce((sum, file) => sum + statSync(join(siteRoot, "dist", file)).size, 0) / 1024;

  console.log(
    `\nsite landing page (${seen.size} chunk${seen.size === 1 ? "" : "s"} on the critical path): ${criticalKb.toFixed(0)} kB (limit ${SITE_LIMIT_KB} kB)`,
  );

  if (criticalKb > SITE_LIMIT_KB) {
    over(
      "the site's landing page",
      criticalKb,
      SITE_LIMIT_KB,
      "Something is imported statically that should be lazy. Check that gallery/registry.ts is reached only through the React.lazy boundary in App, and that landing/LookupCard.tsx is still behind Deferred.",
    );
  }
}

if (failed) process.exit(1);

console.log("\nbundle budgets hold\n");
