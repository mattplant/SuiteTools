// SPDX-License-Identifier: GPL-3.0-or-later

// shared's workspace rollup.config.js (CommonJS version)
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const sucrase = require("@rollup/plugin-sucrase");
const terser = require("@rollup/plugin-terser");

// Shared plugin configuration
const plugins = [
  nodeResolve(), // resolves deps from node_modules
  sucrase({
    exclude: ["node_modules/**"],
    transforms: ["typescript"], // transpile TS to JS
  }),
  terser(), // minify the bundle
];

// Export multiple build configurations
module.exports = [
  // Main entry point (full library)
  {
    input: "src/index.ts",
    output: [
      { file: "dist/index.cjs", format: "cjs", sourcemap: true },
      { file: "dist/index.mjs", format: "esm", sourcemap: true },
      {
        file: "../backend/src/FileCabinet/SuiteScripts/SuiteTools/idev-suitetools-shared.js",
        format: "amd",
        amd: {
          id: "SuiteScripts/SuiteTools/idev-suitetools-shared",
        },
        sourcemap: false,
      },
    ],
    plugins,
  },
  // Errors-only entry point (lightweight, no Zod runtime)
  {
    input: "src/errors-entry.ts",
    output: [
      { file: "dist/errors/index.cjs", format: "cjs", sourcemap: true },
      { file: "dist/errors/index.mjs", format: "esm", sourcemap: true },
    ],
    plugins,
  },
  // Contracts-only entry point (types only)
  {
    input: "src/contracts-entry.ts",
    output: [
      { file: "dist/contracts/index.cjs", format: "cjs", sourcemap: true },
      { file: "dist/contracts/index.mjs", format: "esm", sourcemap: true },
    ],
    plugins,
  },
];
