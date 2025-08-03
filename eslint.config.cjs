const { defineConfig, globalIgnores } = require("eslint/config");
const globals = require("globals");
const { fixupConfigRules, fixupPluginRules } = require("@eslint/compat");
const tsParser = require("@typescript-eslint/parser");
const reactRefresh = require("eslint-plugin-react-refresh");
const _import = require("eslint-plugin-import");
const jsdoc = require("eslint-plugin-jsdoc");
const js = require("@eslint/js");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// SuiteTools-specific ignores
const suiteToolsIgnores = [
  "frontend/src/FileCabinet/SuiteScripts/",
  "frontend/src/FileCabinet/SuiteScripts/SuiteTools/dist/",
];

module.exports = defineConfig([
  // Frontend workspace
  {
    files: ["frontend/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts", "**/*.test.tsx"],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
      parserOptions: {
        project: ["./frontend/tsconfig.json"],
      },
    },

    plugins: {
      "react-refresh": reactRefresh,
      import: fixupPluginRules(_import),
      jsdoc,
    },

    // // Use jsdoc preset + compat extensions
    // extends: [
    //   jsdoc.configs["flat/recommended-typescript-error"],
    //   ...fixupConfigRules(
    //     compat.extends(
    //       "eslint:recommended",
    //       "plugin:@typescript-eslint/recommended",
    //       "plugin:react/recommended",
    //       "plugin:react/jsx-runtime",
    //       "plugin:react-hooks/recommended",
    //       "prettier"
    //     )
    //   ),
    // ],

    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // Optional: override jsdoc preset rules here if needed
      // "jsdoc/tag-lines": ["warn", "any"],

      //   "import/extensions": [
      //     "error",
      //     "ignorePackages",
      //     {
      //       ts: "never",
      //       tsx: "never",
      //     },
      //   ],
    },

    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: ["./frontend/tsconfig.json"],
        },
      },
    },
  },

  // Vite config override
  {
    files: ["frontend/vite.config.ts"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        project: false,
      },
    },
  },

  // Shared workspace
  {
    files: ["shared/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        project: ["./shared/tsconfig.json"],
      },
    },
    rules: {},
  },

  // Global ignores
  globalIgnores([
    "**/node_modules/",
    "**/dist/",
    "**/.eslintrc.cjs",
    ...suiteToolsIgnores,
  ]),
]);
