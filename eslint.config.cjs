const { defineConfig, globalIgnores } = require("eslint/config");
const globals = require("globals"); // TODO: Do I even need this?
const { fixupConfigRules, fixupPluginRules } = require("@eslint/compat");
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");
const importPlugin = require("eslint-plugin-import");
const reactRefreshPlugin = require("eslint-plugin-react-refresh");
const jsDocPlugin = require("eslint-plugin-jsdoc");
const js = require("@eslint/js"); // TODO: Do I even need this?
const suitescript = require("eslint-plugin-suitescript");
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

// ------------------------------------
// Standard ESLint Configs
// ------------------------------------
// This section defines the standard ESLint configurations.
//
// It provides a solid foundation for linting TypeScript codebasesand adherence to best practices including:
// - Consistent coding standards across the project
// - Allows for easy extension and customization through workspace-specific configurations.
// - Minimizes duplication so rule tweaks apply broadly with low maintenance overhead
// - Encodes suite-wide patterns like import order, JSDoc expectations, and type imports.
// ------------------------------------
const standardLanguageOptions = {
  ecmaVersion: 2022,
  sourceType: "module",
  parser: tsParser,
};

const standardPlugins = {
  "@typescript-eslint": fixupPluginRules(tsPlugin),
  jsdoc: jsDocPlugin,
};

const standardRules = {
  "jsdoc/require-jsdoc": ["warn", { publicOnly: true }], // Require JSDoc for public APIs
  "jsdoc/check-tag-names": "warn",
  "jsdoc/check-tag-names": [
    "warn", // Enforce JSDoc standard tags like @param, @returns
    {
      definedTags: ["remarks", "note"], // Additional custom tags
    },
  ],
  "@typescript-eslint/explicit-function-return-type": "warn", // Require explicit return types for functions
  "@typescript-eslint/no-unsafe-return": "warn", // Warn on unsafe returns
  "@typescript-eslint/consistent-type-imports": "warn", // Prefer type imports for clarity
};

module.exports = defineConfig([
  // Backend workspace
  {
    files: ["backend/**/*.{ts,tsx}"],
    languageOptions: {
      ...standardLanguageOptions,
      ecmaVersion: 2021, // Overrides standard defaults for backward compatibility (TODO: see if needed)
      parserOptions: {
        project: ["./backend/tsconfig.json"],
        tsconfigRootDir: __dirname,
      },
      globals: {
        define: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        N: "readonly", // NetSuite global
      },
    },
    plugins: {
      ...standardPlugins,
      suitescript,
    },
    rules: {
      ...standardRules,
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },

  // Frontend workspace
  {
    files: ["frontend/**/*.{ts,tsx}"],
    ignores: ["**/*.test.ts", "**/*.test.tsx"],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: globals.node,
      parser: tsParser,
      parserOptions: {
        project: ["./frontend/tsconfig.json"],
      },
    },

    plugins: {
      ...standardPlugins,
      "react-refresh": reactRefreshPlugin,
      import: fixupPluginRules(importPlugin),
    },

    // Use jsdoc preset + compat extensions // TODO: Do I need to add this to standard configs?
    extends: [
      jsDocPlugin.configs["flat/recommended-typescript-error"],
      ...fixupConfigRules(
        compat.extends(
          "eslint:recommended",
          "plugin:@typescript-eslint/recommended",
          "plugin:react/recommended",
          "plugin:react/jsx-runtime",
          "plugin:react-hooks/recommended",
          "prettier"
        )
      ),
    ],

    rules: {
      ...standardRules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // TODO: Add these after understanding import order groups better and then ask if it should be standard
      // "import/order": [
      //   "warn",
      //   {
      //     groups: [
      //       ["internal", "type"], // Typed stubs
      //       ["internal", "suite"], // Shared tooling like @suite/validation
      //       "parent", // Up one directory (../../models)
      //       "sibling", // ./component, ./utils
      //       "index", // ./ or ./index.ts
      //     ],
      //     "newlines-between": "always",
      //   },
      // ],

      // TODO: What does this do again? And if so, should it be in standard?
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
        },
      ],
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

  // Global Markdown heading capitalization enforcement
  {
    files: ["**/*.md"],
    languageOptions: {
      parser: require("./scripts/eslint-rules/noop-parser.js"),
    },
    plugins: {
      "heading-title-case": {
        rules: {
          "heading-title-case": require("./scripts/eslint-rules/heading-title-case.js"),
        },
      },
    },
    rules: {
      "heading-title-case/heading-title-case": "error",
    },
  },

  globalIgnores([
    "**/node_modules/",
    "**/dist/",
    "**/.eslintrc.cjs",
    ...suiteToolsIgnores,
  ]),
]);
