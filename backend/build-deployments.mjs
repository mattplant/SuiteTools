import { build } from 'esbuild';
import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

/**
 * Build configuration for creating NetSuite deployment bundles
 * This bundles the modular TypeScript files into single-file deployments
 */

const buildConfig = {
  // Common settings for all bundles
  bundle: true,
  platform: 'node',
  target: 'es2019', // NetSuite SuiteScript 2.1 compatibility
  format: 'cjs', // Build as CommonJS first, then convert to AMD
  sourcemap: false,
  minify: false, // Keep readable for NetSuite debugging
  keepNames: true, // Preserve function/class names for debugging
  external: [
    // NetSuite modules should remain as imports
    'N/*',
    'SuiteScripts/*',
  ],
  // Resolve TypeScript and workspace paths
  resolveExtensions: ['.ts', '.js'],
  loader: {
    '.ts': 'ts',
  },
  // Output configuration
  outdir: 'src/FileCabinet/SuiteScripts/SuiteTools',
  entryNames: '[name]',
  logLevel: 'info',
  // Ensure exports are preserved
  treeShaking: false,
};

/**
 * Convert CommonJS output to AMD format for NetSuite
 */
async function convertToAMD() {
  const files = [
    {
      name: 'idev-suitetools-api.js',
      exports: ['get', 'post', 'put'],
      sourceFile: 'src/TypeScripts/SuiteTools/idev-suitetools-api.ts',
    },
    {
      name: 'idev-suitetools-app.js',
      exports: ['onRequest'],
      sourceFile: 'src/TypeScripts/SuiteTools/idev-suitetools-app.ts',
    },
  ];

  for (const file of files) {
    const filePath = resolve('src/FileCabinet/SuiteScripts/SuiteTools', file.name);
    const sourceFilePath = resolve(file.sourceFile);

    try {
      const originalContent = await readFile(filePath, 'utf8');
      const sourceContent = await readFile(sourceFilePath, 'utf8');

      // Extract the original header from the source file (first JSDoc comment)
      const headerMatch = sourceContent.match(/^(\/\*\*[\s\S]*?\*\/)/);
      const header = headerMatch ? headerMatch[1] : '';

      // Get content from bundled file, skipping any esbuild-generated header
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
        // Remove the CommonJS export mapping block (causes NetSuite arrow function errors)
        .replace(
          /\/\/ src\/TypeScripts\/SuiteTools\/idev-suitetools-api\.ts\s*var \w+_exports = {};\s*__export\(\w+_exports,\s*\{[\s\S]*?\}\);\s*module\.exports = __toCommonJS\(\w+_exports\);\s*(?=\/\/ src)/g,
          '',
        )
        .replace(
          /\/\/ src\/TypeScripts\/SuiteTools\/idev-suitetools-app\.ts\s*var \w+_exports = {};\s*__export\(\w+_exports,\s*\{[\s\S]*?\}\);\s*module\.exports = __toCommonJS\(\w+_exports\);\s*(?=\/\/ src)/g,
          '',
        )
        // Remove CommonJS annotation blocks at the end
        .replace(
          /\/\/ Annotate the CommonJS export names for ESM import in node:\s*0 && \(module\.exports = \{[\s\S]*?\}\);?\s*/g,
          '',
        )
        // Convert N/ module requires to simple names for AMD parameters
        .replace(/__toESM\(require\("(N\/[^"]+)"\)\)/g, '$1')
        // Convert all N/module references to parameter names (including numbered variants)
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
      for (const exportName of file.exports) {
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
        ${file.exports.map((exportName, index) => `${exportName}: ${actualFunctionNames[index]}`).join(',\n        ')}
    };
});`;

      await writeFile(filePath, amdContent, 'utf8');
      console.log(`✅ Converted ${file.name} to AMD format`);
    } catch (error) {
      console.error(`❌ Failed to convert ${file.name}:`, error);
      throw error;
    }
  }
}



async function buildDeployments() {
  console.log('🚀 Building NetSuite deployment bundles...');

  try {
    // Build API deployment bundle
    await build({
      ...buildConfig,
      entryPoints: {
        'idev-suitetools-api': resolve('src/TypeScripts/SuiteTools/idev-suitetools-api.ts'),
      },
    });

    // Build App deployment bundle
    await build({
      ...buildConfig,
      entryPoints: {
        'idev-suitetools-app': resolve('src/TypeScripts/SuiteTools/idev-suitetools-app.ts'),
      },
    });

    // Convert to AMD format after both builds complete
    console.log('🔄 Converting to AMD format for NetSuite...');
    await convertToAMD();

    console.log('✅ Deployment bundles created successfully!');
    console.log('📁 Files created in SDF structure:');
    console.log('   src/FileCabinet/SuiteScripts/SuiteTools/');
    console.log('     - idev-suitetools-api.js (RESTlet)');
    console.log('     - idev-suitetools-app.js (Suitelet)');
    console.log('🚀 Ready for deployment: yarn deploy');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run the build
buildDeployments();
