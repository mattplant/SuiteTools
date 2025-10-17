// SPDX-License-Identifier: GPL-3.0-or-later

// shared's workspace rollup.config.js (CommonJS version)
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const sucrase = require("@rollup/plugin-sucrase");
const terser = require("@rollup/plugin-terser");

module.exports = {
  input: "src/index.ts",
  output: [
    { file: "dist/index.cjs", format: "cjs", sourcemap: true }, // for frontend + workspace consumers
    { file: "dist/index.mjs", format: "esm", sourcemap: true },
    {
      file: "../backend/src/FileCabinet/SuiteScripts/SuiteTools/idev-suitetools-shared.js", // single AMD bundle
      format: "amd",
      amd: {
        id: "SuiteScripts/SuiteTools/idev-suitetools-shared",
      },
      sourcemap: false,
    },
  ],
  plugins: [
    nodeResolve(), // resolves deps from node_modules
    sucrase({
      exclude: ["node_modules/**"],
      transforms: ["typescript"], // transpile TS to JS
    }),
    terser(), // minify the bundle
  ],
};
