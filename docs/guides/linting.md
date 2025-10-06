# 📏 Linting Guide

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

---

## Overview

This document outlines the linting stack and practices used across SuiteTools to ensure consistency, architectural integrity, and scalable ergonomics.

Linting is central to our development workflow. It prevents errors early, enforces boundaries, and improves developer experience (DX) while reducing total cost of ownership (TCO) across the suite.

### 🔗 Related Governance

- [Linting Standards](../governance/standards/linting-standards.md) - rule categories and rule list
  - [Linting Standards — Rule Reference](../governance/standards/linting-standards.md#-rule-reference)
- [ESLint Config](../governance/standards/config/eslint.md)
- [View `eslint.config.cjs`](../governance/standards/config/eslint.md)
- [Prettier Config](../governance/standards/config/prettier.md) — formatting alignment.
- [TypeScript Config](../governance/standards/config/typescript.md) — type‑checking alignment.

---

## Overview: Suite-Wide Linting Strategy

SuiteTools enforces linting via:

- **ESLint** + workspace-scoped rules for correctness and hygiene
- **Flat ESLint Configs** for global rule segmentation and local override clarity
- **Custom ESLint rules** to reinforce domain boundaries and suite ergonomics
- **TypeScript path maps** and resolvers to preserve import integrity
- **Prettier** for formatting standardization beyond ESLint’s reach

This setup is modular and extensible: suite-wide rules provide global consistency, while workspace-specific overrides allow for domain-specific flexibility.

---

## 🛠️ Linting Tool Matrix

A breakdown of each tool and its implementation role within SuiteTools:

- **ESLint**
  - Linting engine for TypeScript workflows
  - Supports type-aware rules via `@typescript-eslint`
  - Detects errors, enforces structure, and blocks unsafe patterns
- **Flat Config (ESLint v9+)**
  - Core configuration strategy across the suite
  - Modularizes setup for shared and workspace-specific rules
  - Enables ergonomic override composition
- **Prettier**
  - Enforces consistent formatting (quotes, spacing, semicolons, commas)
  - Complements ESLint by standardizing stylistic surface area

---

## ⚙️ Flat Config Overview

SuiteTools uses ESLint’s modern **Flat Config** (`defineConfig`) instead of legacy `.eslintrc.*` files.

**Why Flat Config?**

- **Composable** — multiple workspace configs in one file.
- **Explicit** — no hidden merges from `.eslintrc` inheritance.
- **Targeted** — `files` and `ignores` arrays allow precise scoping.
- **Future‑proof** — aligns with ESLint’s long‑term direction.

### 🔌 Plugin Installation Policy

All ESLint plugins are installed from the monorepo root — even if used in a single workspace — to ensure consistent resolution and reproducible installs.
Local installs inside workspaces can cause redundant dependency trees, plugin resolution failures, and onboarding/CI confusion.

---

## Configuration Strategy

Shared and workspace-specific rule composition ensures scalable enforcement:

- Shared rules promote suite-wide consistency
- Workspace overrides allow domain-specific flexibility
- Custom rules encode architectural boundaries
- TypeScript integration enables ergonomic enforcement

---

## Enforcement Practices

Core practices maintain architectural clarity and code hygiene across the suite.

See Rule Tiers, Rule Categories, and the full Rules at [Linting Standards](../governance/standards/linting-standards.md).

---

## Next Steps

- Review the [Linting Standards](../governance/standards/linting-standards.md) to understand the rules we enforce.
- Explore the [ESLint Config Guide](../governance/standards/config/eslint.md) to see how these rules are implemented across workspaces.
- Check [Prettier Config](../governance/standards/config/prettier.md) and [TypeScript Config](../governance/standards/config/typescript.md) for formatting and type‑checking alignment.

---

## 📋 Stewardship Notes

- Treat linting as part of SuiteTools’ **architectural contract** — not just style enforcement.
- Keep this guide in sync with the [Linting Standards](../governance/standards/linting-standards.md) and root `eslint.config.cjs`.
- Update this guide whenever new custom rules, plugins, or enforcement practices are introduced.
- Ensure contributors understand that linting is **binding**: violations block merges until resolved.

By following these practices, contributors help keep SuiteTools code **predictable, maintainable, and discoverable** across all workspaces.
