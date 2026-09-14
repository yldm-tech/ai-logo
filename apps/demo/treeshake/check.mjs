/**
 * Guards the thing that is easy to break and invisible until someone complains: importing one icon must not pull in all 323.
 *
 * `vp pack --unbundle` emits one module per source file, so a bundler can drop the brands an app never imports. Without that flag the whole icon set lands in one module and nothing can be shaken out of it — that regression measured 3219 kB against the 216 kB here, a 14x jump, and it type-checked and tested clean the whole way. Only a bundle size check catches it.
 *
 * The second budget exists because the first one only ever measured the path that was never in doubt. ProviderIcon, ModelIcon and AgentIcon resolve an arbitrary string to a component through a lookup table, and providerConfig.tsx imports 143 icons statically to build it, so importing one of them costs roughly eight times a direct icon import. That is inherent to a runtime string lookup rather than a regression — what is worth guarding is that it does not quietly grow further, and that nobody reads the README's tree-shaking line as covering these components.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const demoRoot = resolve(here, "..");

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

for (const { config, label, limitKb, outDir } of cases) {
  execFileSync("vp", ["build", "--config", config], { cwd: demoRoot, stdio: "inherit" });

  const assets = join(demoRoot, outDir, "assets");
  const bundles = readdirSync(assets).filter((file) => file.endsWith(".js"));
  const totalKb = bundles.reduce((sum, file) => sum + statSync(join(assets, file)).size, 0) / 1024;

  console.log(`\n${label}: ${totalKb.toFixed(0)} kB (limit ${limitKb} kB)`);

  if (totalKb > limitKb) {
    failed = true;
    console.error(
      `\nBundle budget exceeded. ${label} produced ${totalKb.toFixed(0)} kB.\n` +
        `For the single-icon case, check that the build still passes --unbundle to vp pack.\n`,
    );
  }
}

if (failed) process.exit(1);

console.log("\nbundle budgets hold\n");
