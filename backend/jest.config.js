// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * SuiteCloud Jest config adapted for Yarn PnP.
 *
 * Oracle's generator hardcodes `<rootDir>/node_modules/@oracle/suitecloud-unit-testing/...`,
 * which does not exist under PnP. Rewrite those paths to the resolved package root.
 *
 * Tests target `TypeScripts/` (authoring sources), not generated FileCabinet JS.
 */

const path = require("path");
const SuiteCloudJestConfiguration = require("@oracle/suitecloud-unit-testing/jest-configuration/SuiteCloudJestConfiguration");
const cliConfig = require("./suitecloud.config");

const suitecloudPkgRoot = path.dirname(require.resolve("@oracle/suitecloud-unit-testing/package.json"));

const ORACLE_NODE_MODULES_PREFIX = "<rootDir>/node_modules/@oracle/suitecloud-unit-testing";

function rewriteOraclePaths(value) {
  if (typeof value === "string") {
    return value.split(ORACLE_NODE_MODULES_PREFIX).join(suitecloudPkgRoot);
  }
  if (Array.isArray(value)) {
    return value.map(rewriteOraclePaths);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, rewriteOraclePaths(nested)]));
  }
  return value;
}

const suitecloud = rewriteOraclePaths(
  SuiteCloudJestConfiguration.build({
    projectFolder: cliConfig.defaultProjectFolder,
    projectType: SuiteCloudJestConfiguration.ProjectType.ACP,
  }),
);

module.exports = {
  ...suitecloud,
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|js)"],
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    ...suitecloud.transform,
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // Runtime resolution uses moduleNameMapper / PnP; skip tsc path checks in tests.
        diagnostics: false,
        tsconfig: {
          module: "commonjs",
          moduleResolution: "node",
          esModuleInterop: true,
          allowJs: true,
          strict: false,
          skipLibCheck: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    ...suitecloud.moduleNameMapper,
    // Prefer authoring sources over generated FileCabinet bundles.
    "^SuiteScripts(.*)$": "<rootDir>/TypeScripts$1",
    "^@suiteworks/suitetools-shared$": "<rootDir>/../shared/dist/index.cjs",
    "^@suiteworks/suitetools-shared/errors$": "<rootDir>/../shared/dist/errors/index.cjs",
    "^@suiteworks/suitetools-shared/contracts$": "<rootDir>/../shared/dist/contracts/index.cjs",
  },
};
