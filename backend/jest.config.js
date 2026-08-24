// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * SuiteCloud Jest config adapted for this monorepo's dependency layout.
 *
 * Oracle's generator hardcodes `<rootDir>/node_modules/@oracle/suitecloud-unit-testing/...`.
 * That path does not exist here: rootDir is `backend/`, and Yarn hoists the package to the
 * workspace root instead, so `backend/node_modules/` is not created at all. Rewrite those
 * paths to the resolved package root. (Under PnP, which this project used before #74, the
 * path was equally wrong for a different reason -- there was no node_modules anywhere.)
 *
 * Tests target `TypeScripts/` (authoring sources), not generated FileCabinet JS.
 */

const path = require("node:path");
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
  // Coverage (#111). Jest 29 has it built in, so unlike frontend/shared there is no
  // provider package to install -- only `--coverage` and where to point it.
  //
  // `collectCoverageFrom` is what puts untested files in the denominator: without it
  // `--coverage` reports only the files a test already imports, which for this workspace
  // would be the api layer and nothing else. Authoring sources only -- the generated AMD
  // bundles under src/FileCabinet/ are build output, and counting them would double every
  // module and measure esbuild rather than the code.
  collectCoverageFrom: ["TypeScripts/**/*.ts"],
  coverageDirectory: "coverage",
  // `text` for the job log, `cobertura` for GitLab's MR diff annotations, `html` to read
  // locally. Matches the two Vitest workspaces so all three reports are read the same way.
  coverageReporters: ["text", "cobertura", "html"],
  // Measured, not gated: #111 turned the number on and left `coverageThreshold` for the
  // follow-up, once there is a baseline to ratchet from.
  transform: {
    ...suitecloud.transform,
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        // Runtime resolution uses moduleNameMapper; skip tsc path checks in tests.
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
