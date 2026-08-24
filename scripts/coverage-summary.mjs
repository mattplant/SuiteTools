#!/usr/bin/env node
/**
 * Combine the three per-workspace cobertura reports into one line-coverage figure.
 *
 * GitLab's `coverage:` keyword scrapes a single number out of a job log. `yarn test:coverage`
 * prints three — one Vitest table for `shared`, one for `frontend`, one Jest table for
 * `backend` — and GitLab would keep whichever matched last, reporting one workspace as if it
 * were the suite. This sums them instead, so the figure on the merge request is the whole
 * repository.
 *
 * Cobertura carries `lines-valid` / `lines-covered` on its root element, so summing is exact:
 * it is the same denominator each reporter used, not an average of three percentages.
 *
 * #111 turned reporting on without a threshold. This script reports; it never fails on a low
 * number. It does fail on a *missing* report, because a silently partial total is worse than
 * no total.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Topological order, matching `yarn workspaces foreach -Apt`. */
const WORKSPACES = ["shared", "frontend", "backend"];

const REPORT = join("coverage", "cobertura-coverage.xml");

// Attributes on the root <coverage> element. Nested <class> elements carry `line-rate` but
// never `lines-valid`, so anchoring on that attribute cannot match the wrong element.
const LINES_VALID = /<coverage\b[^>]*\blines-valid="(\d+)"/;
const LINES_COVERED = /<coverage\b[^>]*\blines-covered="(\d+)"/;

const rows = [];
const missing = [];

for (const workspace of WORKSPACES) {
  const path = join(root, workspace, REPORT);
  if (!existsSync(path)) {
    missing.push(join(workspace, REPORT));
    continue;
  }
  const xml = readFileSync(path, "utf8");
  const validMatch = LINES_VALID.exec(xml);
  const coveredMatch = LINES_COVERED.exec(xml);
  if (!validMatch || !coveredMatch) {
    console.error(`coverage-summary: ${join(workspace, REPORT)} has no root <coverage> line totals.`);
    process.exit(1);
  }
  rows.push({ workspace, valid: Number(validMatch[1]), covered: Number(coveredMatch[1]) });
}

if (missing.length > 0) {
  console.error(`coverage-summary: ${missing.length} of ${WORKSPACES.length} reports are missing:`);
  for (const path of missing) console.error(`  ${path}`);
  console.error("");
  console.error("Run the whole suite, not one workspace:");
  console.error("  yarn test:coverage");
  process.exit(1);
}

/** @returns `covered/valid` as a percentage, or 0 when a workspace has no measurable lines. */
const percent = (covered, valid) => (valid === 0 ? 0 : (covered / valid) * 100);

const width = Math.max(...rows.map((row) => row.workspace.length));

console.log("");
console.log("coverage-summary: line coverage by workspace");
for (const { workspace, valid, covered } of rows) {
  const share = percent(covered, valid).toFixed(2).padStart(6);
  console.log(`  ${workspace.padEnd(width)}  ${share}%  (${covered}/${valid} lines)`);
}
console.log("");

const valid = rows.reduce((sum, row) => sum + row.valid, 0);
const covered = rows.reduce((sum, row) => sum + row.covered, 0);

// Kept on one line, in this exact shape: `.gitlab-ci.yml` matches it with an anchored regex.
console.log(`Total coverage: ${percent(covered, valid).toFixed(2)}% (${covered}/${valid} lines)`);
