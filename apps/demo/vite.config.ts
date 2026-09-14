import { defineConfig } from "vite-plus";

export default defineConfig({
  test: {
    environment: "jsdom",
    server: {
      deps: {
        /** @lobehub/ui ships directory imports and a dependency without an exports map, so bare Node ESM cannot resolve it. Bundlers can, which is how this package is actually consumed. */
        inline: [/@lobehub\//],
      },
    },
  },
});
