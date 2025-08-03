// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      shared: path.resolve(__dirname, '../shared/src'),
    },
  },
  build: {
    outDir: '../backend/src/FileCabinet/SuiteScripts/SuiteTools/dist/',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'app-bundle.js',
        assetFileNames: (assetInfo) =>
          assetInfo.name === 'index.css' ? 'output.css' : assetInfo.name || 'default-name',
      },
    },
  },
});
