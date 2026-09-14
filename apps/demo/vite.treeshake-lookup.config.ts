import { defineConfig } from "vite-plus";

export default defineConfig({
  build: {
    outDir: "dist-treeshake-lookup",
    rollupOptions: { input: "treeshake/entry-lookup.tsx" },
  },
});
