#!/usr/bin/env node
/**
 * Enforce the Node major version pinned in `.node-version`.
 * Yarn 4 does not honor package.json `engines` by itself.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const expectedMajor = readFileSync(join(root, ".node-version"), "utf8").trim();
const actual = process.versions.node;
const actualMajor = actual.split(".")[0];

if (actualMajor !== expectedMajor) {
  console.error(
    [
      `SuiteTools requires Node ${expectedMajor} (Active LTS).`,
      `This shell is running Node ${actual}.`,
      "",
      "Switch with one of:",
      "  • Homebrew: brew install node@24 && brew unlink node && brew link node@24 --force --overwrite",
      "  • fnm:      fnm install && fnm use   (reads .node-version)",
      "  • nvm:      nvm install && nvm use   (reads .nvmrc)",
      "",
      "See docs/guides/installation.md",
    ].join("\n"),
  );
  process.exit(1);
}
