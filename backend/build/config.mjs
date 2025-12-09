/**
 * Build configuration for creating NetSuite backend deployment bundles
 * Externalizes configuration for easier maintenance and customization
 */

export const BUILD_CONFIG = {
  // Development deployment settings (less optimized, easier debugging)
  dev: {
    sourcemap: true, // Generate sourcemaps for debugging in development
    minify: false, // Keep code readable for development testing
    keepNames: true, // Preserve function names for debugging
  },

  // Production deployment settings (optimized for live NetSuite)
  production: {
    sourcemap: false, // No sourcemaps in production for smaller bundles
    minify: true, // Minify code for production optimization
    keepNames: true, // Preserve function names for better debugging in production
  },

  // Bundle analysis settings
  analysis: {
    enabled: true, // Enable bundle size analysis
    warningThreshold: 100, // KB - Warn when bundles exceed this size
    errorThreshold: 200, // KB - Error when bundles exceed this size
  },

  // NetSuite specific settings
  netsuite: {
    externalModules: [
      'N/*', // All NetSuite modules
      'SuiteScripts/*', // NetSuite FileCabinet scripts
      // Note: @suiteworks/suitetools-shared is bundled into each file rather than external
      // This is because ESBuild can't remap workspace package names to NetSuite paths
    ],
  },

  // Clean operation settings
  clean: {
    yarnScript: 'clean-local', // Yarn script to use for cleaning
  },
};

export default BUILD_CONFIG;
