# 📏 Linting Guide

Last updated: August 13, 2026

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://gitlab.com/idev-systems/labs/SuiteTools/)

---

## Overview

This document outlines the linting stack and practices used across SuiteTools to ensure consistency, architectural integrity, and scalable ergonomics.

Linting is central to our development workflow. It prevents errors early, enforces boundaries, and improves developer experience (DX) while reducing total cost of ownership (TCO) across the suite.

SuiteTools uses **[Biome](https://biomejs.dev)** as the single lint and format tool. It replaced ESLint and Prettier in #70: one binary and one configuration file in place of two tools, eight plugins and a 285-line flat config.

### 🔗 Related Governance

- [Linting Standards](../governance/standards/linting-standards.md) — rule policy and severity
- [Biome Config](../governance/standards/config/biome.md) — annotated `biome.json`
- [TypeScript Config](../governance/standards/config/typescript.md) — type-checking alignment

---

## 🛠️ What Biome Covers

- **Linting** — correctness, suspicious patterns, complexity, security, and accessibility rules for TypeScript, JavaScript, JSX and JSON.
- **Formatting** — quotes, spacing, semicolons, trailing commas, line width and object expansion.
- **Accessibility** — JSX a11y rules, which this project had no ESLint plugin for previously.

What it does **not** cover, and what was given up in the migration, is recorded in [Biome Config](../governance/standards/config/biome.md#-capability-not-carried-over-from-eslint): JSDoc rules, type-aware rules, and Markdown heading checks.

---

## ⚡ Commands

The same four scripts exist in every workspace and at the root, and are identical in each manifest:

```bash
yarn lint           # check formatting and lint rules
yarn lint:fix       # apply safe fixes
yarn format         # rewrite formatting
yarn check-format   # report formatting differences without writing
```

Run them from the root to cover the whole monorepo, or from inside a workspace to scope to it. Workspace scripts invoke `yarn run -T biome`, borrowing the root binary rather than each workspace declaring its own copy.

Biome checks the full repository in well under a second, so there is rarely a reason to scope a run.

### Applying Fixes

`yarn lint:fix` applies **safe** fixes only. Biome also offers `--unsafe`, which is deliberately not wired into a script: applying it wholesale to this codebase removed non-null assertions that TypeScript relied on and altered React hook dependencies, breaking both the build and a test. Apply unsafe fixes one rule at a time and verify.

---

## 🚦 Severity and Enforcement

Biome's `recommended` preset is enabled, and rules in it are errors. `yarn lint` fails on any error, so violations block merges.

A small set of rules carries pre-existing backlogs and is set to `warn` — reported on every run, but non-blocking. Those are listed with their reasons in [Biome Config](../governance/standards/config/biome.md#-rule-severity). They are warnings rather than disabled rules so the backlog stays visible in the tool rather than only in an issue.

### Suppressions

Suppress a rule inline only with a stated reason:

```ts
// biome-ignore lint/a11y/noAutofocus: moving focus into a modal on open follows WAI-ARIA practices
```

Two mechanics matter: the reason must be on the **same line** as the directive, and the directive must **immediately precede** the reported node — a second comment line in between breaks the association.

---

## 📋 Stewardship Notes

- Treat linting as part of SuiteTools' **architectural contract** — not just style enforcement.
- Keep this guide in sync with [Linting Standards](../governance/standards/linting-standards.md) and [biome.json](../../biome.json).
- Every deviation from a Biome default belongs in [Biome Config](../governance/standards/config/biome.md) with a recorded reason.
- Linting is **binding**: violations block merges until resolved.

By following these practices, contributors help keep SuiteTools code **predictable, maintainable, and discoverable** across all workspaces.
