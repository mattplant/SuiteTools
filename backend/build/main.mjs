import { build } from 'esbuild';
import { resolve } from 'path';
import { readFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { BUILD_CONFIG } from './config.mjs';
import { analyzeBundles, monitorBundleSizes } from './analyzer.mjs';
import {
  handleBuildError,
  PerformanceTimer,
  validateBuildEnvironment,
  safeWriteFile,
  setupFileWatcher,
  createBuildReport,
} from './utils.mjs';

/**
 * Build configuration for creating NetSuite backend deployment bundles
 * This bundles the modular TypeScript files into single-file deployments
 */

// Regex patterns for AMD conversion
const REGEX_PATTERNS = {
  // Remove the CommonJS export mapping block (causes NetSuite arrow function errors)
  // This matches: var xxx_exports = {}; __export(xxx_exports, {...}); module.exports = __toCommonJS(xxx_exports);
  COMMONJS_EXPORT:
    /var \w+_exports = \{\};\s*__export\(\w+_exports,\s*\{[\s\S]*?\}\);\s*module\.exports = __toCommonJS\(\w+_exports\);/g,
  // Remove CommonJS annotation blocks at the end
  COMMONJS_ANNOTATION:
    /\/\/ Annotate the CommonJS export names for ESM import in node:\s*0 && \(module\.exports = \{[\s\S]*?\}\);?\s*/g,
  // Find N/ module requires
  NETSUITE_MODULE: /__toESM\(require\("(N\/[^"]+)"\)\)/g,
  EXTERNAL_MODULE: /require\("([^"]+)"\)/g,
  JSDOC_HEADER: /^(\/\*\*[\s\S]*?\*\/)/,
};

// Configuration for all deployment files
const DEPLOYMENT_FILES = [
  {
    name: 'idev-suitetools-api',
    type: 'RESTlet',
    exports: ['get', 'post', 'put'], // TypeScript function names
    netsuiteExports: ['doGet', 'doPost', 'doPut'], // NetSuite entry point names
    sourceFile: 'src/TypeScripts/SuiteTools/idev-suitetools-api.ts',
    outputPath: 'src/FileCabinet/SuiteScripts/SuiteTools',
  },
  {
    name: 'idev-suitetools-app',
    type: 'Suitelet',
    exports: ['onRequest'],
    sourceFile: 'src/TypeScripts/SuiteTools/idev-suitetools-app.ts',
    outputPath: 'src/FileCabinet/SuiteScripts/SuiteTools',
  },
  {
    name: 'idev-suitetools-mr-jobs-run',
    type: 'Map/Reduce - Jobs',
    exports: ['getInputData', 'map', 'reduce', 'summarize'],
    sourceFile: 'src/TypeScripts/SuiteTools/helpers/idev-suitetools-mr-jobs-run.ts',
    outputPath: 'src/FileCabinet/SuiteScripts/SuiteTools/helpers',
  },
  {
    name: 'idev-suitetools-mr-logins',
    type: 'Map/Reduce - Logins',
    exports: ['getInputData', 'map', 'reduce', 'summarize'],
    sourceFile: 'src/TypeScripts/SuiteTools/helpers/idev-suitetools-mr-logins.ts',
    outputPath: 'src/FileCabinet/SuiteScripts/SuiteTools/helpers',
  },
];

// Get build configuration based on production mode
function getBuildConfig(isProduction) {
  const envConfig = isProduction ? BUILD_CONFIG.production : BUILD_CONFIG.dev;

  return {
    bundle: true, // Bundle all dependencies into single files for NetSuite deployment
    platform: 'node', // Target Node.js environment (NetSuite SuiteScript runtime)
    target: 'es2022', // NetSuite SuiteScript 2.1 compatibility
    format: 'cjs', // Build as CommonJS first, then convert to AMD (ESBuild doesn't support AMD)
    sourcemap: envConfig.sourcemap ? 'inline' : false, // Environment-aware sourcemaps
    minify: envConfig.minify, // Environment-aware minification
    keepNames: envConfig.keepNames, // Use config value directly
    treeShaking: false, // Disable tree shaking to preserve all exports
    splitting: false, // Disable code splitting for NetSuite single-file deployment
    external: BUILD_CONFIG.netsuite.externalModules, // NetSuite modules should remain as imports
    logLevel: 'warning', // Show warnings and errors
  };
}

/**
 * Convert CommonJS output to AMD format for NetSuite
 * Using the EXACT working logic from commit 08e3d23
 */
async function convertToAMD(isProduction) {
  for (const fileConfig of DEPLOYMENT_FILES) {
    const fileName = `${fileConfig.name}.js`;
    const filePath = resolve(fileConfig.outputPath, fileName);
    const sourceFilePath = resolve(fileConfig.sourceFile);

    try {
      console.log(`🔄 Converting ${fileName} to AMD format...`);

      const originalContent = await readFile(filePath, 'utf8');
      const sourceContent = await readFile(sourceFilePath, 'utf8');

      // Extract the original header from the source file (first JSDoc comment)
      const headerMatch = sourceContent.match(/^(\/\*\*[\s\S]*?\*\/)/);
      const header = headerMatch ? headerMatch[1] : '';

      // Get content from bundled file
      let content = originalContent;

      // Find N/ modules used in require statements
      const nModules = [];
      const nModuleMatches = content.matchAll(/__toESM\(require\("(N\/[^"]+)"\)\)/g);
      for (const match of nModuleMatches) {
        if (!nModules.includes(match[1])) {
          nModules.push(match[1]);
        }
      }

      // Clean up CommonJS artifacts without removing the bundled code
      content = content
        // Remove the CommonJS export mapping block (file-specific patterns for safety)
        .replace(
          /\/\/ src\/TypeScripts\/SuiteTools\/idev-suitetools-api\.ts\s*var \w+_exports = {};\s*__export\(\w+_exports,\s*\{[\s\S]*?\}\);\s*module\.exports = __toCommonJS\(\w+_exports\);\s*(?=\/\/ src)/g,
          '',
        )
        .replace(
          /\/\/ src\/TypeScripts\/SuiteTools\/idev-suitetools-app\.ts\s*var \w+_exports = {};\s*__export\(\w+_exports,\s*\{[\s\S]*?\}\);\s*module\.exports = __toCommonJS\(\w+_exports\);\s*(?=\/\/ src)/g,
          '',
        )
        .replace(
          /\/\/ src\/TypeScripts\/SuiteTools\/helpers\/idev-suitetools-mr-jobs-run\.ts\s*var \w+_exports = {};\s*__export\(\w+_exports,\s*\{[\s\S]*?\}\);\s*module\.exports = __toCommonJS\(\w+_exports\);\s*(?=\/\/ src)/g,
          '',
        )
        .replace(
          /\/\/ src\/TypeScripts\/SuiteTools\/helpers\/idev-suitetools-mr-logins\.ts\s*var \w+_exports = {};\s*__export\(\w+_exports,\s*\{[\s\S]*?\}\);\s*module\.exports = __toCommonJS\(\w+_exports\);\s*(?=\/\/ src)/g,
          '',
        )
        // Remove CommonJS annotation blocks at the end
        .replace(
          /\/\/ Annotate the CommonJS export names for ESM import in node:\s*0 && \(module\.exports = \{[\s\S]*?\}\);?\s*/g,
          '',
        )
        // Convert N/ module requires to simple names for AMD parameters
        .replace(/__toESM\(require\("(N\/[^"]+)"\)\)/g, '$1')
        // Convert all N/module references to parameter names
        .replace(/N\/log/g, 'log')
        .replace(/N\/error/g, 'error')
        .replace(/N\/task/g, 'task')
        .replace(/N\/email/g, 'email')
        .replace(/N\/file/g, 'file')
        .replace(/N\/https/g, 'https')
        .replace(/N\/record/g, 'record')
        .replace(/N\/query/g, 'query')
        .replace(/N\/url/g, 'url')
        .replace(/N\/redirect/g, 'redirect')
        .replace(/N\/search/g, 'search')
        .replace(/N\/runtime/g, 'runtime')
        .trim();

      // Find the actual function names (they might be renamed by esbuild)
      const actualFunctionNames = [];
      for (const exportName of fileConfig.exports) {
        // Look for function definitions that might be renamed (e.g., get2 instead of get)
        const funcPattern = new RegExp(`function (\\w*${exportName}\\w*)\\([^)]*\\)`, 'g');
        const matches = [...content.matchAll(funcPattern)];
        if (matches.length > 0) {
          // Use the last match (most likely the actual function we want)
          actualFunctionNames.push(matches[matches.length - 1][1]);
        } else {
          // Fallback to the original name
          actualFunctionNames.push(exportName);
        }
      }

      // Create AMD structure with proper dependencies
      const dependencies = nModules.map((mod) => `"${mod}"`).join(', ');
      const paramNames = nModules
        .map((mod) => {
          // Convert N/log -> log, N/error -> error, etc.
          const parts = mod.split('/');
          return parts[parts.length - 1];
        })
        .join(', ');

      const amdContent = `${header}
define([${dependencies}], function (${paramNames}) {
    "use strict";

${content}

    // Return the exported functions
    return {
        ${fileConfig.exports.map((exportName, index) => `${exportName}: ${actualFunctionNames[index]}`).join(',\n        ')}
    };
});`;

      await safeWriteFile(filePath, amdContent, { backup: false });
      console.log(`✅ Converted ${fileName} to AMD format`);
    } catch (error) {
      handleBuildError(error, 'AMD Conversion', {
        file: fileName,
        step: 'Converting ESBuild output to AMD format',
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }
}

/**
 * Build a single deployment file using ESBuild
 * @param {Object} fileConfig - Deployment file configuration
 */
async function buildSingleDeployment(fileConfig, isProduction) {
  const timer = new PerformanceTimer(`Build ${fileConfig.name}`);
  console.log(`📦 Building ${fileConfig.name} (${fileConfig.type})...`);

  try {
    // Validate configuration before building
    validateFileConfig(fileConfig);
    timer.step('Configuration validation');

    // Ensure output directory exists
    const outputDir = fileConfig.outputPath;
    if (!existsSync(outputDir)) {
      console.log(`📁 Creating output directory: ${outputDir}`);
      mkdirSync(outputDir, { recursive: true });
    }

    // Debug: Log external modules to verify configuration
    if (!isProduction) {
      console.log(`   External modules: ${getBuildConfig(isProduction).external.join(', ')}`);
    }

    // Build with ESBuild
    await build({
      ...getBuildConfig(isProduction),
      outdir: fileConfig.outputPath,
      entryPoints: {
        [fileConfig.name]: resolve(fileConfig.sourceFile),
      },
    });

    const buildTime = timer.finish();

    // Log successful build with timing
    console.log(`✅ Built ${fileConfig.name} in ${buildTime}ms`);
  } catch (error) {
    handleBuildError(error, `ESBuild - ${fileConfig.name}`, {
      file: fileConfig.sourceFile,
      step: 'TypeScript compilation and bundling',
      timestamp: new Date().toISOString(),
      type: fileConfig.type,
    });
    throw error;
  }
}

/**
 * Clean build artifacts
 */
async function cleanBuildArtifacts() {
  console.log('🧹 Cleaning build artifacts...');

  try {
    // Use the configured clean script for consistency
    execSync(`yarn ${BUILD_CONFIG.clean.yarnScript}`, { stdio: 'inherit', cwd: process.cwd() });
    console.log('✅ Build artifacts cleaned');
  } catch (error) {
    console.warn('⚠️  Clean command failed:', error.message);
    console.warn('   Continuing with build...');
  }
}

/**
 * Validate deployment file configuration
 * @param {Object} fileConfig - Deployment file configuration to validate
 */
function validateFileConfig(fileConfig) {
  const requiredFields = ['name', 'type', 'exports', 'sourceFile', 'outputPath'];
  const missing = requiredFields.filter((field) => !fileConfig[field]);

  if (missing.length > 0) {
    throw new Error(`Invalid file configuration for ${fileConfig.name}: missing ${missing.join(', ')}`);
  }

  // Validate source file exists (relative to current directory)
  if (!existsSync(fileConfig.sourceFile)) {
    throw new Error(`Source file not found: ${fileConfig.sourceFile}`);
  }
}

/**
 * Watch mode for development
 */
async function watchMode(isProduction) {
  console.log('👀 Starting enhanced watch mode for development...');
  console.log('   Files will be automatically rebuilt when changed');
  console.log('   Press Ctrl+C to stop\n');

  // Initial build
  await buildAllDeployments(isProduction);

  // Setup enhanced file watcher with all source files and dependencies
  const watchPaths = [
    ...DEPLOYMENT_FILES.map((file) => file.sourceFile),
    'src/TypeScripts/SuiteTools/**/*.ts', // Watch all TypeScript files in the project
    'build/config.mjs', // Watch build configuration changes
    'tsconfig.json', // Watch TypeScript configuration changes
  ];

  const rebuildCallback = async (changedFile) => {
    console.log(`\n📝 File changed: ${changedFile}`);
    console.log('🔄 Rebuilding...\n');

    const rebuildTimer = new PerformanceTimer('Rebuild');

    try {
      await buildAllDeployments(isProduction);
      const rebuildTime = rebuildTimer.finish();
      console.log(`\n✅ Rebuild complete in ${rebuildTime}ms - watching for changes...\n`);
    } catch (error) {
      handleBuildError(error, 'Watch Mode Rebuild', {
        file: changedFile,
        step: 'Rebuilding after file change',
        timestamp: new Date().toISOString(),
      });
      console.log('⏳ Waiting for next change...\n');
    }
  };

  // Setup file watcher with enhanced error handling
  const watcher = await setupFileWatcher(watchPaths, rebuildCallback, {
    debounceMs: 300,
    ignorePattern: /node_modules|\.git|dist|build\/.*\.js$/,
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Stopping watch mode...');
    watcher.close();
    process.exit(0);
  });
}

/**
 * Build all deployment bundles and convert to AMD format
 */
async function buildAllDeployments(isProduction) {
  const timer = new PerformanceTimer('Build All Deployments');
  console.log('🚀 Building NetSuite deployment bundles...');

  try {
    // Validate all configurations before building
    console.log('🔍 Validating deployment configurations...');
    DEPLOYMENT_FILES.forEach(validateFileConfig);
    console.log('✅ All configurations valid');
    timer.step('Configuration validation');

    // Build all deployments in parallel for speed
    console.log('📦 Building TypeScript bundles...');
    await Promise.all(DEPLOYMENT_FILES.map((fileConfig) => buildSingleDeployment(fileConfig, isProduction)));
    timer.step('ESBuild bundling');

    // Convert all bundles to AMD format
    console.log('🔄 Converting to AMD format for NetSuite...');
    await convertToAMD(isProduction);
    timer.step('AMD conversion');

    const totalTime = timer.finish();

    // Monitor bundle sizes and provide warnings + size analysis
    const thresholds = {
      warningSize: BUILD_CONFIG.analysis.warningThreshold * 1024, // Convert KB to bytes
      errorSize: BUILD_CONFIG.analysis.errorThreshold * 1024, // Convert KB to bytes
    };
    const { analysis, hasErrors } = await monitorBundleSizes(DEPLOYMENT_FILES, thresholds);
    timer.step('Bundle analysis');

    // Create build report
    const buildReport = createBuildReport({
      totalTime,
      bundles: analysis.bundles,
      environment: process.env.NODE_ENV || 'development',
      success: !hasErrors,
    });

    console.log(`\n🎉 Build completed successfully!`);
    console.log(
      `📊 Total size: ${Math.round((analysis.totalSize / 1024) * 100) / 100}KB across ${DEPLOYMENT_FILES.length} bundles`,
    );

    if (hasErrors) {
      console.warn('⚠️  Build completed with bundle size warnings - review output above');
    }
  } catch (error) {
    handleBuildError(error, 'Build All Deployments', {
      step: 'Complete build process',
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}

/**
 * Display help information
 */
function showHelp() {
  console.log(`
🛠️  SuiteTools Backend Build System

USAGE:
  node build/main.mjs [options]

COMMON OPTIONS:
  --dev               Sandbox build (readable, with debug info)
  --prod              Production build (minified, optimized)
  --watch, -w         Auto-rebuild on file changes
  --clean, -c         Clean build artifacts first
  --help, -h          Show this help

ADVANCED OPTIONS:
  --analyze-bundles   Analyze bundle sizes after build
  --validate-only     Check config without building
  --verbose           Detailed logging
  --dry-run           Preview actions without executing

EXAMPLES:
  yarn build:dev                    # Sandbox build (default)
  yarn build:prod                   # Production build
  yarn build:dev --watch            # Development with auto-rebuild
  yarn build:prod --analyze-bundles # Production with size analysis

💡 TIP: Use --watch during development for instant rebuilds
`);
}

/**
 * Parse command line arguments
 */
function parseArguments() {
  const args = process.argv.slice(2);
  const options = {
    watch: false,
    clean: false,
    help: false,
    prod: false,
    dev: false,
    analyzeBundles: false,
    validateOnly: false,
    verbose: false,
    dryRun: false,
  };

  for (const arg of args) {
    switch (arg) {
      case '--watch':
      case '-w':
        options.watch = true;
        break;
      case '--clean':
      case '-c':
        options.clean = true;
        break;
      case '--help':
      case '-h':
        options.help = true;
        break;
      case '--prod':
        options.prod = true;
        process.env.NODE_ENV = 'production';
        break;
      case '--dev':
        options.dev = true;
        process.env.NODE_ENV = 'development';
        break;
      case '--analyze-bundles':
      case '-a':
        options.analyzeBundles = true;
        break;
      case '--validate-only':
      case '-v':
        options.validateOnly = true;
        break;
      case '--verbose':
        options.verbose = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      default:
        if (arg.startsWith('-')) {
          console.warn(`⚠️  Unknown option: ${arg}`);
        }
    }
  }

  return options;
}

/**
 * Main execution function
 */
async function main() {
  const options = parseArguments();

  // Show help if requested
  if (options.help) {
    showHelp();
    return;
  }

  try {
    // Validate build environment first
    console.log('🔍 Validating build environment...');
    const validation = validateBuildEnvironment();

    if (!validation.valid) {
      console.error('❌ Build environment validation failed:');
      validation.errors.forEach((error) => console.error(`   • ${error}`));
      process.exit(1);
    }

    console.log('✅ Build environment validated');

    // Handle validate-only option
    if (options.validateOnly) {
      console.log('✅ Validation completed - no build requested');
      return;
    }

    // Clean if requested
    if (options.clean) {
      console.log('🧹 Cleaning build artifacts...');
      await cleanBuildArtifacts();
    }

    // Handle analyze-bundles only option (no build)
    if (options.analyzeBundles && !options.watch) {
      console.log('📊 Analyzing existing bundles...');
      await analyzeBundles(DEPLOYMENT_FILES);
      return;
    }

    // Start appropriate build mode
    if (options.watch) {
      await watchMode(options.prod);
    } else {
      await buildAllDeployments(options.prod);

      // Auto-analyze bundles if requested or environment variable set
      if (options.analyzeBundles || process.env.BUILD_ANALYZE === 'true') {
        console.log('\n📊 Analyzing bundle results...');
        await analyzeBundles(DEPLOYMENT_FILES);
      }
    }
  } catch (error) {
    handleBuildError(error, 'Main Build Process', {
      step: 'Complete build workflow',
      timestamp: new Date().toISOString(),
    });
    process.exit(1);
  }
}

// Run the build
main();
