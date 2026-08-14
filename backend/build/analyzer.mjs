import { readFile } from "node:fs/promises";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Bundle analysis utilities for monitoring build output sizes and performance
 * Provides detailed bundle metrics and optimization insights
 */

/**
 * Analyze bundle sizes and provide optimization insights
 * @param {Array} deploymentFiles - Array of deployment file configurations
 * @returns {Object} Analysis results with bundle metrics
 */
export async function analyzeBundles(deploymentFiles) {
  console.log("📊 Analyzing bundle sizes...\n");

  const analysis = { totalSize: 0, bundles: [], warnings: [], recommendations: [] };

  for (const fileConfig of deploymentFiles) {
    const fileName = `${fileConfig.name}.js`;
    const filePath = resolve(fileConfig.outputPath, fileName);

    if (!existsSync(filePath)) {
      analysis.warnings.push(`⚠️  Bundle not found: ${fileName}`);
      continue;
    }

    try {
      const stats = statSync(filePath);
      const content = await readFile(filePath, "utf8");

      // Calculate bundle metrics (skip expensive content analysis for now)
      const bundleInfo = {
        name: fileConfig.name,
        type: fileConfig.type,
        size: stats.size,
        sizeKB: Math.round((stats.size / 1024) * 100) / 100,
        lines: content.split("\n").length,
        exports: fileConfig.exports.length,
        dependencies: [], // Skip dependency extraction as it can be slow
        lastModified: stats.mtime,
        // Skip detailed content breakdown to avoid performance issues
        contentBreakdown: { total: content.length },
      };

      analysis.bundles.push(bundleInfo);
      analysis.totalSize += stats.size;

      // Soft size bands (aligned with BUILD_CONFIG.analysis; Zod-backed API is ~450KB)
      if (bundleInfo.sizeKB > 600) {
        analysis.warnings.push(
          `⚠️  Bundle over soft limit: ${fileName} (${bundleInfo.sizeKB}KB) — review imports / shared surface`,
        );
      } else if (bundleInfo.sizeKB > 400) {
        analysis.warnings.push(`⚠️  Large bundle: ${fileName} (${bundleInfo.sizeKB}KB) — monitor for growth`);
      }

      // Output bundle info
      console.log(`📦 ${bundleInfo.name}`);
      console.log(`   Type: ${bundleInfo.type}`);
      console.log(`   Size: ${bundleInfo.sizeKB}KB (${bundleInfo.size} bytes)`);
      console.log(`   Lines: ${bundleInfo.lines}`);
      console.log(`   Exports: ${bundleInfo.exports}`);
      console.log(`   Dependencies: ${bundleInfo.dependencies.length}`);
      console.log("");
    } catch (error) {
      analysis.warnings.push(`❌ Failed to analyze ${fileName}: ${error.message}`);
    }
  }

  // Generate summary and recommendations
  const totalSizeKB = Math.round((analysis.totalSize / 1024) * 100) / 100;
  console.log(`📈 Total bundle size: ${totalSizeKB}KB (${analysis.totalSize} bytes)`);

  // Add optimization recommendations based on analysis
  if (totalSizeKB > 1000) {
    analysis.recommendations.push("Consider externalizing shared dependencies");
    analysis.recommendations.push("Review bundle contents for unnecessary code");
  }

  // Specific recommendations based on individual bundle analysis
  for (const bundle of analysis.bundles) {
    if (bundle.sizeKB > 400) {
      analysis.recommendations.push(
        `${bundle.name}: Prefer narrower shared imports so MR scripts do not pull the full schema graph`,
      );
    }
  }

  // Show warnings
  if (analysis.warnings.length > 0) {
    console.log("\n⚠️  Warnings:");
    analysis.warnings.forEach((warning) => {
      console.log(`   ${warning}`);
    });
  }

  // Show recommendations
  if (analysis.recommendations.length > 0) {
    console.log("\n💡 Optimization Recommendations:");
    analysis.recommendations.forEach((rec) => {
      console.log(`   • ${rec}`);
    });
  }

  return analysis;
}

/**
 * Analyze file content for optimization opportunities
 * @param {string} content - File content to analyze
 * @returns {Object} Content analysis breakdown
 */
function _analyzeFileContent(content) {
  // Use efficient counting methods to avoid regex catastrophic backtracking
  let comments = 0;
  const strings = 0;

  // Simple line-by-line analysis for comments (much faster than complex regex)
  const lines = content.split("\n");
  for (const line of lines) {
    if (line.trim().startsWith("//")) {
      comments += line.length;
    }
    // Simple block comment detection (approximate)
    if (line.includes("/*") || line.includes("*/")) {
      comments += line.length;
    }
  }

  return {
    total: content.length,
    comments,
    functions: (content.match(/function\s+\w+|=>\s*{|\w+\s*:\s*function/g) || []).length,
    variables: (content.match(/var\s+\w+|let\s+\w+|const\s+\w+/g) || []).length,
    imports: (content.match(/import\s+.*from|require\s*\(/g) || []).length,
    classes: (content.match(/class\s+\w+/g) || []).length,
    strings, // Skip string analysis as it's not critical and can be expensive
  };
} /**
 * Extract dependency information from bundle content
 * @param {string} content - Bundle file content
 * @returns {Array} Array of detected dependencies
 */
function _extractDependencies(content) {
  const dependencies = [];

  // Extract AMD dependencies
  const amdMatch = content.match(/define\(\[(.*?)\]/);
  if (amdMatch) {
    const depString = amdMatch[1];
    const deps = depString.split(",").map((dep) => dep.trim().replace(/['"]/g, ""));
    dependencies.push(...deps.filter((dep) => dep.length > 0));
  }

  // Extract NetSuite module usage
  const netsuiteModules = [...content.matchAll(/"(N\/[^"]+)"/g)];
  dependencies.push(...netsuiteModules.map((match) => match[1]));

  return [...new Set(dependencies)]; // Remove duplicates
}

/**
 * Monitor bundle sizes and alert on significant changes
 * @param {Array} deploymentFiles - Deployment file configurations
 * @param {Object} thresholds - Size thresholds for warnings
 */
export async function monitorBundleSizes(deploymentFiles, thresholds = {}) {
  const defaultThresholds = {
    warningSize: 400 * 1024, // 400KB — matches BUILD_CONFIG.analysis.warningThreshold
    errorSize: 600 * 1024, // 600KB — matches BUILD_CONFIG.analysis.errorThreshold
    growthPercent: 25, // 25% growth
  };

  const config = { ...defaultThresholds, ...thresholds };
  const analysis = await analyzeBundles(deploymentFiles);

  let hasErrors = false;

  for (const bundle of analysis.bundles) {
    if (bundle.size > config.errorSize) {
      console.warn(
        `⚠️  Bundle exceeds soft limit (${Math.round(config.errorSize / 1024)}KB): ${bundle.name} (${bundle.sizeKB}KB) — review before growing further`,
      );
      hasErrors = true;
    } else if (bundle.size > config.warningSize) {
      console.warn(
        `⚠️  Bundle size watch (${Math.round(config.warningSize / 1024)}KB+): ${bundle.name} (${bundle.sizeKB}KB)`,
      );
    }
  }

  return { analysis, hasErrors };
}
