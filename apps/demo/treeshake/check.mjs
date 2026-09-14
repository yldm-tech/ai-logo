/**
 * Guards the thing that is easy to break and invisible until someone complains: importing one icon must not pull in all 323.
 *
 * `vp pack --unbundle` emits one module per source file, so a bundler can drop the brands an app never imports. Without that flag the whole icon set lands in one module and nothing can be shaken out of it — that regression measured 3219 kB against the 216 kB here, a 14x jump, and it type-checked and tested clean the whole way. Only a bundle size check catches it.
 */
import { execFileSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const demoRoot = resolve(here, "..");
const outDir = join(demoRoot, "dist-treeshake");

// Generous enough not to trip on a legitimately grown icon, tight enough that a whole-set regression cannot hide under it.
const LIMIT_KB = 600;

execFileSync("vp", ["build", "--config", "vite.treeshake.config.ts"], {
  cwd: demoRoot,
  stdio: "inherit",
});

const assets = join(outDir, "assets");
const bundles = readdirSync(assets).filter((f) => f.endsWith(".js"));
const totalKb = bundles.reduce((sum, f) => sum + statSync(join(assets, f)).size, 0) / 1024;

console.log(`\nsingle-icon bundle: ${totalKb.toFixed(0)} kB (limit ${LIMIT_KB} kB)`);

if (totalKb > LIMIT_KB) {
  console.error(
    `\nTree-shaking regressed. Importing one icon produced ${totalKb.toFixed(0)} kB.\n` +
      `Check that the build still passes --unbundle to vp pack.\n`,
  );
  process.exit(1);
}

console.log("tree-shaking holds\n");
