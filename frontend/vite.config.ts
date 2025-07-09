import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../backend/src/FileCabinet/SuiteScripts/SuiteTools/dist/',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'app-bundle.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name == 'index.css') {
            return 'output.css';
          }
          // ensure a string is always returned by providing a default return value
          return assetInfo.name || 'default-name';
        },
      },
    },
  },
});
