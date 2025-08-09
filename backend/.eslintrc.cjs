// TODO: remove later
//   I upgraded this just before moving the settings over to the root eslint.config.cjs FlatCompat format
module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    project: './tsconfig.json', // point to your TS config
    tsconfigRootDir: __dirname,
  },

  env: {
    es2021: true, // modern syntax and globals
    node: true, // CLI and build tools
    amd: true, // SuiteScript’s define()/require()
  },

  globals: {
    define: 'readonly',
    require: 'readonly',
    module: 'readonly',
    exports: 'readonly',
    // Add any N/log, or runtime modules you use here
    N: 'readonly',
  },

  extends: [
    'eslint:recommended',
    'plugin:netsuite-suitescript-2.x/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:suitescript/all',
    'prettier', // make sure this is the last one so that it will override other configs
  ],

  plugins: ['netsuite-suitescript-2.x', '@typescript-eslint', 'suitescript'],

  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        // allow unused vars for staged TS migrations
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        // any TS-specific tweaks
      },
    },
    {
      files: ['**/*.js'],
      rules: {
        // if you have legacy JS, you can disable TS rules here
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],

  rules: {
    'suitescript/prefer-arrow-function': 'off',
    'netsuite-suitescript-2.x/no-unused-imports': 'warn',
    'suitescript/require-global-definitions': 'error',
  },
};
