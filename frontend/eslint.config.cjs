const { defineConfig, globalIgnores } = require('eslint/config');

const globals = require('globals');

const { fixupConfigRules, fixupPluginRules } = require('@eslint/compat');

const tsParser = require('@typescript-eslint/parser');
const reactRefresh = require('eslint-plugin-react-refresh');
const _import = require('eslint-plugin-import');
const js = require('@eslint/js');

const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

module.exports = defineConfig([
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['**/*.test.ts', '**/*.test.tsx'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },

    extends: fixupConfigRules(
      compat.extends(
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:react/jsx-runtime',
        'plugin:react-hooks/recommended',
        'prettier',
      ),
    ),

    plugins: {
      'react-refresh': reactRefresh,
      import: fixupPluginRules(_import),
    },

    rules: {
      'react-refresh/only-export-components': [
        'warn',
        {
          allowConstantExport: true,
        },
      ],

      //   'import/extensions': [
      //     'error',
      //     'ignorePackages',
      //     {
      //       ts: 'never',
      //       tsx: 'never',
      //     },
      //   ],
    },

    settings: {
      react: {
        version: 'detect',
      },

      'import/resolver': {
        typescript: {},
      },
    },
  },

  {
    files: ['vite.config.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        project: false, // disables type-aware linting
      },
    },
    rules: {
      // Add basic rules if needed
    },
  },

  globalIgnores([
    '**/node_modules/',
    '**/dist/',
    '**/.eslintrc.cjs',
    // SuiteTools specific ignores
    'src/FileCabinet/SuiteScripts/',
    'src/FileCabinet/SuiteScripts/SuiteTools/dist/',
  ]),
]);
