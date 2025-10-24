import { readFile, writeFile } from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * Build utilities for enhanced error handling, performance tracking, and development workflows
 * Provides comprehensive build support functions with detailed error context
 */

/**
 * Enhanced error handler with stack traces and build context
 * @param {Error} error - The error to handle
 * @param {string} context - Build context information
 * @param {Object} buildInfo - Additional build information
 */
export function handleBuildError(error, context, buildInfo = {}) {
  console.error(`\n🚨 BUILD ERROR in ${context}`);
  console.error(`📍 ${error.message}`);

  // Build context
  if (buildInfo.file) console.error(`📁 File: ${buildInfo.file}`);
  if (buildInfo.step) console.error(`⚙️  Step: ${buildInfo.step}`);

  // Stack trace in development
  if (error.stack && process.env.NODE_ENV !== 'production') {
    console.error(`\n📚 Stack Trace:`);
    error.stack
      .split('\n')
      .slice(1, 4)
      .forEach((line) => {
        console.error(`   ${line.trim()}`);
      });
  }

  console.error(''); // Empty line for readability
}

/**
 * Performance timer for tracking build operations
 */
export class PerformanceTimer {
  constructor(operation) {
    this.operation = operation;
    this.startTime = Date.now();
    this.steps = [];
  }

  step(stepName) {
    const now = Date.now();
    this.steps.push({
      name: stepName,
      duration: now - this.startTime,
      timestamp: now,
    });
  }

  finish() {
    const totalTime = Date.now() - this.startTime;

    console.log(`⏱️  ${this.operation} completed in ${totalTime}ms`);

    if (this.steps.length > 0 && process.env.NODE_ENV !== 'production') {
      console.log(`   Step breakdown:`);
      this.steps.forEach((step, i) => {
        const stepTime = i === 0 ? step.duration : step.duration - this.steps[i - 1].duration;
        console.log(`   • ${step.name}: ${stepTime}ms`);
      });
    }

    return totalTime;
  }
}

/**
 * Validate build environment and dependencies
 * @returns {Object} Validation results
 */
export function validateBuildEnvironment() {
  const validation = {
    valid: true,
    errors: [],
  };

  // Validate workspace structure
  const requiredDirs = ['src/TypeScripts/SuiteTools', 'src/FileCabinet/SuiteScripts/SuiteTools'];

  for (const dir of requiredDirs) {
    if (!existsSync(dir)) {
      console.log(`📁 Creating missing directory: ${dir}`);
      try {
        mkdirSync(dir, { recursive: true });
      } catch (error) {
        validation.errors.push(`Failed to create required directory: ${dir} - ${error.message}`);
        validation.valid = false;
      }
    }
  }

  return validation;
}

/**
 * Safe file write with directory creation and backup
 * @param {string} filePath - Target file path
 * @param {string} content - File content
 * @param {Object} options - Write options
 */
export async function safeWriteFile(filePath, content, options = {}) {
  const { backup = false, encoding = 'utf8' } = options;

  try {
    // Ensure directory exists
    const dir = dirname(filePath);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    // Create backup if requested and file exists
    if (backup && existsSync(filePath)) {
      const backupPath = `${filePath}.bak`;
      const originalContent = await readFile(filePath, encoding);
      await writeFile(backupPath, originalContent, encoding);
    }

    // Write the file
    await writeFile(filePath, content, encoding);
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
}

/**
 * Watch file changes and trigger rebuilds
 * @param {Array} watchPaths - Paths to watch
 * @param {Function} callback - Callback for file changes
 * @param {Object} options - Watch options
 */
export async function setupFileWatcher(watchPaths, callback, options = {}) {
  const { debounceMs = 300, ignorePattern = /node_modules|\.git/ } = options;

  try {
    // Dynamic import for chokidar (dev dependency)
    const { watch } = await import('chokidar');

    const watcher = watch(watchPaths, {
      ignored: ignorePattern,
      persistent: true,
      ignoreInitial: true,
    });

    let debounceTimer;

    watcher.on('change', (filePath) => {
      console.log(`📝 File changed: ${filePath}`);

      // Debounce to avoid multiple rebuilds
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        callback(filePath);
      }, debounceMs);
    });

    watcher.on('error', (error) => {
      console.error('🚨 File watcher error:', error);
    });

    console.log(`👀 Watching ${watchPaths.length} path(s) for changes...`);
    console.log('   Press Ctrl+C to stop watching');

    return watcher;
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') {
      console.error('❌ chokidar not found. Install with: yarn add -D chokidar');
      throw new Error('Missing dependency: chokidar');
    }
    throw error;
  }
}

/**
 * Create detailed build report
 * @param {Object} buildResults - Build results data
 * @param {Object} options - Report options
 */
export function createBuildReport(buildResults, options = {}) {
  const { outputFile = null } = options;

  const report = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    ...buildResults,
  };

  if (outputFile) {
    writeFile(outputFile, JSON.stringify(report, null, 2), 'utf8').catch((error) =>
      console.warn(`Failed to write build report: ${error.message}`),
    );
  }

  return report;
}
