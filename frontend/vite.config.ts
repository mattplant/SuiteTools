// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import flowbiteReact from 'flowbite-react/plugin/vite';
import path from 'path';
import postcss from 'postcss';
import postcssNested from 'postcss-nested';

// Since react-data-grid includes PostCSS-style nested selectors in its distributed CSS
// and Vite does not process third-party CSS we need to process the "react-data-grid/lib/styles.css" file
const transformReactDataGridCss = {
  name: 'transform-react-data-grid-css',
  enforce: 'pre',
  async transform(code: string, id: string) {
    if (id.includes('react-data-grid') && id.endsWith('.css')) {
      console.log(`✅ Transforming react-data-grid CSS: ${id}`);
      const result = await postcss([postcssNested()]).process(code, { from: id });
      return {
        code: result.css,
        map: null,
      };
    }
    return null;
  },
};

export default defineConfig({
  plugins: [transformReactDataGridCss, react(), tailwindcss(), flowbiteReact()],
  resolve: {
    alias: {
      shared: path.resolve(import.meta.dirname, '../shared/src'),
    },
  },
  build: {
    outDir: '../backend/src/FileCabinet/SuiteScripts/SuiteTools/dist/',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'app-bundle.js',
        // The deploy script uploads /SuiteScripts/SuiteTools/dist/{index.html,output.css,app-bundle.js}
        // by exact path, so these names must stay stable. Rolldown (Vite 8) deprecated the singular
        // `name` in favor of `names`; read `names` first and keep `name` as a fallback.
        assetFileNames: (assetInfo) => {
          const assetName = assetInfo.names?.[0] ?? assetInfo.name;
          return assetName === 'index.css' ? 'output.css' : assetName || 'default-name';
        },
      },
    },
  },
});
