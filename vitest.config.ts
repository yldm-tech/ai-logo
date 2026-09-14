import { fileURLToPath } from "node:url";
import { defineConfig } from "vite-plus";

import { name } from "./package.json";

export default defineConfig({
  test: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
      [name]: fileURLToPath(new URL("src", import.meta.url)),
    },
    environment: "jsdom",
    /**
     * apps/** runs under its own config. Swept into this one it inherited the aliases above, so the
     * consumer smoke test resolved `@yldm-tech/ai-logo` back to src and silently re-tested the source
     * a second time — the opposite of what its own header comment promises.
     */
    exclude: ["**/node_modules/**", "**/dist/**", "apps/**"],
    globals: true,
    server: {
      deps: {
        /** Transform LobeHub packages that use directory imports in their ESM output. */
        inline: [/@lobehub\//],
      },
    },
  },
});
