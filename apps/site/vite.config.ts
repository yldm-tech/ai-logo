import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

// The package is linked from the repository root, so its built output resolves outside node_modules and Vitest would transform every module in it as if it were source.
const packageOutput = fileURLToPath(new URL("../../es/", import.meta.url));

export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    environment: "jsdom",
    // The first import in a test file compiles this package's whole module graph — 323 brands behind es/index.mjs — and that lands on whichever test happens to run first. Measured cold at over five seconds on a loaded machine, which is the default budget, so the first test in store.test.ts and store.server.test.ts failed at random while everything after them passed in milliseconds. Five seconds is the right budget for an assertion and the wrong one for a compile; this is the compile's share.
    testTimeout: 30_000,
    // The package is already compiled ESM, so Node loads it as is. Transforming it was the cost testTimeout was covering: at 1298 brands a cold transform took over 30 seconds on a loaded machine and failed the first test in store.server.test.ts.
    server: { deps: { external: [packageOutput] } },
  },
});
