// SPDX-License-Identifier: GPL-3.0-or-later

// shared's workspace rollup.config.js (CommonJS version)
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const sucrase = require("@rollup/plugin-sucrase");
const terser = require("@rollup/plugin-terser");

const basePlugins = [nodeResolve(), sucrase({ exclude: ["node_modules/**"], transforms: ["typescript"] })];

// Minify library outputs (backend esbuild inlines shared dist). Use a single
// terser worker — parallel terser was exiting early and leaving stale dist/.
const minifyPlugins = [...basePlugins, terser({ maxWorkers: 1 })];

module.exports = [
  // Main entry — minify cjs/mjs (consumed by backend bundle); skip minify on
  // legacy AMD FileCabinet artifact (optional; not required for RESTlet path).
  {
    input: "src/index.ts",
    output: [
      { file: "dist/index.cjs", format: "cjs", sourcemap: true },
      { file: "dist/index.mjs", format: "esm", sourcemap: true },
    ],
    plugins: minifyPlugins,
  },
  {
    input: "src/index.ts",
    output: [
      {
        file: "../backend/src/FileCabinet/SuiteScripts/SuiteTools/idev-suitetools-shared.js",
        format: "amd",
        amd: { id: "SuiteScripts/SuiteTools/idev-suitetools-shared" },
        sourcemap: false,
      },
    ],
    plugins: basePlugins,
  },
  // Errors-only entry point (lightweight, no Zod runtime)
  {
    input: "src/errors-entry.ts",
    output: [
      { file: "dist/errors/index.cjs", format: "cjs", sourcemap: true },
      { file: "dist/errors/index.mjs", format: "esm", sourcemap: true },
    ],
    plugins: minifyPlugins,
  },
  // Contracts-only entry point (types only)
  {
    input: "src/contracts-entry.ts",
    output: [
      { file: "dist/contracts/index.cjs", format: "cjs", sourcemap: true },
      { file: "dist/contracts/index.mjs", format: "esm", sourcemap: true },
    ],
    plugins: basePlugins,
  },
];
