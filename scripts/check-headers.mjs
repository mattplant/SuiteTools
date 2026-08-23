#!/usr/bin/env node
/**
 * Enforce tier 1 of the JSDoc file-header standard: every source file starts
 * with a literal `// SPDX-License-Identifier:` line.
 *
 * Tier 2 (the prose header block) is upheld in review, not here — a script can
 * prove a tag exists, never that its text is still true.
 *
 * See docs/guides/jsdoc-standards.md.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Workspaces holding first-party source, config files included. */
const ROOTS = ["frontend", "shared", "backend"];

/**
 * Directories never walked. Mirrors the exclusions in biome.json — without
 * these the check reports the generated AMD output under src/FileCabinet.
 */
const SKIP_DIRS = new Set(["node_modules", "dist", "build", ".flowbite-react", "FileCabinet"]);

// .mts/.cts included so workspace config files (e.g. shared/vitest.config.mts) are covered.
const SOURCE = /\.(?:[cm]?ts|tsx)$/;
// Must be the first thing in the file, ignoring a leading shebang or blank lines.
// The identifier has to sit on the same line: `[ \t]` rather than `\s`, or a bare
// `SPDX-License-Identifier:` would be satisfied by the next line's code.
const SPDX = /^(?:#![^\n]*\n)?\s*\/\/[ \t]*SPDX-License-Identifier:[ \t]*\S+/;

/** @returns every `.ts`/`.tsx` file under `dir`, skipping generated output. */
function walk(dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || SKIP_DIRS.has(entry.name)) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...walk(path));
    else if (SOURCE.test(entry.name)) found.push(path);
  }
  return found;
}

const missing = [];
let checked = 0;

for (const workspace of ROOTS) {
  const dir = join(root, workspace);
  if (!existsSync(dir)) {
    console.error(`check-headers: expected workspace "${workspace}" not found. Run from a full checkout.`);
    process.exit(1);
  }
  for (const file of walk(dir)) {
    checked++;
    if (!SPDX.test(readFileSync(file, "utf8"))) missing.push(relative(root, file).split(sep).join("/"));
  }
}

if (missing.length === 0) {
  console.log(`check-headers: ${checked} files, all carry an SPDX line.`);
  process.exit(0);
}

console.error(`check-headers: ${missing.length} of ${checked} files are missing an SPDX line.`);
for (const file of missing.sort()) console.error(`  ${file}`);
console.error("");
console.error("Add this as the first line of each file:");
console.error("  // SPDX-License-Identifier: GPL-3.0-or-later");
console.error("");
console.error("See docs/guides/jsdoc-standards.md (tier 1).");

process.exit(1);
