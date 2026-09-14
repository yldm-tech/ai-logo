import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite-plus";

export default defineConfig({
  plugins: [tailwindcss()],
  test: {
    environment: "jsdom",
    // The first import in a test file compiles this package's whole module graph — 323 brands behind es/index.mjs — and that lands on whichever test happens to run first. Measured cold at over five seconds on a loaded machine, which is the default budget, so the first test in store.test.ts and store.server.test.ts failed at random while everything after them passed in milliseconds. Five seconds is the right budget for an assertion and the wrong one for a compile; this is the compile's share.
    testTimeout: 30_000,
  },
});
