#!/usr/bin/env node
// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Derive the app-facing notices payload from the committed compliance artifact.
 *
 * `THIRD_PARTY_NOTICES.md` stays the canonical, human- and legal-facing record: it is produced
 * directly by `yarn licenses generate-disclaimer` (plus the hand-written overrides) and committed.
 * This script only reshapes it, so the two can never disagree -- and because it runs as part of
 * the frontend build, a fresh clone produces the payload without anyone remembering to.
 *
 * The alternative -- inlining the markdown into the bundle with `?raw` -- cost ~60 KB raw and
 * ~6 KB gzipped on every page load, for a page most users never open.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(SCRIPT_DIR, "..", "..");
const IN_FILE = join(REPO_ROOT, "THIRD_PARTY_NOTICES.md");
const OUT_FILE = join(REPO_ROOT, "frontend", "public", "third-party-notices.json");

/** Entry blocks are separated by a five-hyphen rule on its own line. */
const BLOCK_SEPARATOR = /\n-----\n/;
/** Every entry -- generated or override -- opens with this sentence. */
const ENTRY_PREFIX = "The following software may be included in this product:";
/** Present only on generated entries; overrides document a package that ships no licence file. */
const TEXT_MARKER = "This software contains the following license and notice below:";
const SOURCE_MARKER = "A copy of the source code may be downloaded from ";

/**
 * Split the opening sentence into package names.
 * @param {string} head - text between the entry prefix and the first sentence end.
 * @returns {string[]} package names, in the order listed.
 */
function parsePackages(head) {
  return head
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);
}

/**
 * Parse one entry block.
 * @param {string} block - raw block text, separators already stripped.
 * @returns {{packages: string[], source: string, text: string, kind: "generated" | "override"} | null}
 *   null when the block is preamble rather than an entry.
 */
function parseBlock(block) {
  const body = block.trim();
  if (!body.startsWith(ENTRY_PREFIX)) {
    return null; // title, attribution banner, or other preamble
  }

  const afterPrefix = body.slice(ENTRY_PREFIX.length);
  const textIndex = afterPrefix.indexOf(TEXT_MARKER);
  const kind = textIndex === -1 ? "override" : "generated";

  // The package list ends at the source sentence when there is one, otherwise at the first period.
  const sourceIndex = afterPrefix.indexOf(SOURCE_MARKER);
  const headEnd = sourceIndex === -1 ? afterPrefix.indexOf(".") : sourceIndex;
  const head = afterPrefix.slice(0, headEnd === -1 ? undefined : headEnd).replace(/\.\s*$/, "");

  let source = "";
  if (sourceIndex !== -1) {
    const sourceEnd = textIndex === -1 ? afterPrefix.length : textIndex;
    source = afterPrefix.slice(sourceIndex + SOURCE_MARKER.length, sourceEnd).trim();
    source = source.replace(/\.\s*$/, "");
  }

  const text =
    textIndex === -1
      ? afterPrefix.slice(headEnd === -1 ? 0 : headEnd + 1).trim()
      : afterPrefix.slice(textIndex + TEXT_MARKER.length).trim();

  return { packages: parsePackages(head), source, text, kind };
}

const markdown = readFileSync(IN_FILE, "utf8");
const blocks = markdown.split(BLOCK_SEPARATOR);
const entries = blocks.map(parseBlock).filter(Boolean);

// Guard: the parser tracks a format owned by the yarn licenses plugin, so a version bump could
// change it under us. Failing loudly beats shipping a silently truncated compliance payload.
const expected = (markdown.match(new RegExp(`^${ENTRY_PREFIX}`, "gm")) ?? []).length;
if (entries.length !== expected) {
  console.error(`❌ Parsed ${entries.length} entries but the source contains ${expected}.`);
  console.error("   The disclaimer format may have changed; see scripts/third-party-notices/README.md.");
  process.exit(1);
}
if (entries.length === 0) {
  console.error(`❌ No entries parsed from ${IN_FILE}.`);
  process.exit(1);
}

const packageCount = new Set(entries.flatMap((entry) => entry.packages)).size;

const payload = {
  // Recorded so the page can state its provenance rather than implying it is authoritative.
  source: "THIRD_PARTY_NOTICES.md",
  entryCount: entries.length,
  packageCount,
  entries,
};

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, `${JSON.stringify(payload, null, 2)}\n`);

console.log(`✅ Wrote ${OUT_FILE}`);
console.log(`   Entries: ${entries.length}`);
console.log(`   Packages: ${packageCount}`);
