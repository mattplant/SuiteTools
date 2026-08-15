// frontend/vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import flowbiteReact from "flowbite-react/plugin/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  resolve: { alias: { shared: path.resolve(import.meta.dirname, "../shared/src") } },
  build: {
    outDir: "../backend/src/FileCabinet/SuiteScripts/SuiteTools/dist/",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: "app-bundle.js",
        // The deploy script uploads /SuiteScripts/SuiteTools/dist/{index.html,output.css,app-bundle.js}
        // by exact path, so these names must stay stable. Rolldown (Vite 8) deprecated the singular
        // `name` in favor of `names`; read `names` first and keep `name` as a fallback.
        assetFileNames: (assetInfo) => {
          const assetName = assetInfo.names?.[0] ?? assetInfo.name;
          return assetName === "index.css" ? "output.css" : assetName || "default-name";
        },
      },
    },
  },
});
