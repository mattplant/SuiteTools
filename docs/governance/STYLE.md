# 📑 SuiteTools Style Guide

> Part of the SuiteTools governance set.
> See [/docs/governance](./README.md) for related policies and resources.

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

---

## 🎯 Purpose & Scope

> **Purpose in Context:** This style guide defines *how* to express content — tone, structure, formatting, and naming — across all SuiteTools artifacts.
>
> It complements:
>
> - **[SuiteTools Documentation Standards Index](./standards/README.md)** — the *what to follow* for structure and governance patterns.
> - **[SuiteTools Documentation as Architecture](../architecture/docs-architecture.md)** — the *why* behind our documentation philosophy.
>
> **Out of scope:** Structural requirements (e.g., required sections, badge placement) are defined in the Standards Index.

This guide exists to:

- Ensure **suite‑wide clarity** in both human‑readable and machine‑readable artifacts.
- Reduce cognitive load for contributors by making style decisions **predictable**.
- Model **transparent, reproducible governance** — every rule here is intentional and documented.

**Scope:** Applies to all documentation, code, and configuration across the monorepo.

**Status:** Living document — updated as suite‑wide conventions evolve.

**Audience:** Maintainers, contributors, and reviewers of any SuiteTools artifact — including code, documentation, and configuration.

---

## Three Pillars of Style

| Pillar | Scope | Role | Link |
|--------|-------|------|------|
| **Documentation as Architecture** | Conceptual | **`Why` we document** — guiding _philosophy_ for documentation as governed architecture. | [Philosophy](../architecture/docs-architecture.md) |
| **Standards Index** | Macro‑level | **`What` to follow** — enforceable patterns for doc structure, placement, and governance. | [Standards Index](standards/README.md) |
| **Style Guide** | Micro‑level | **`How` to express** — tone, structure, formatting, and naming conventions for all artifacts. | [Style Guide](STYLE.md) |

---

## Naming & Terminology

> **Purpose:** Ensure consistent, predictable naming across all SuiteTools artifacts — in documentation, code, and config — so developers can navigate and understand the suite without cognitive friction.

### Documentation

- Use consistent terminology across all artifacts.
- Define acronyms on first use, then use the acronym thereafter.
- Prefer **plain language** over technical jargon unless the term is widely understood in context.

### Code & Configuration

- **Variables & functions:** `camelCase` — e.g., `parseConfig`
- **Classes & types:** `PascalCase` — e.g., `ConfigParser`
- **Constants:** `UPPER_SNAKE_CASE` — e.g., `DEFAULT_TIMEOUT`
- Names should be **descriptive, not abbreviated**, unless the abbreviation is widely understood.
- Use **kebab-case** for file and directory names.
- Group related files into directories by feature or domain.

---

## Documentation Style

See [Documentation Standard](./standards/documentation.md) for structure and governance patterns.

---

## Code Style

### Code Quick‑Scan Reference

| Aspect               | Rule |
|----------------------|------|
| Language             | TypeScript |
| Formatting & Linting | Prettier, ESLint (SuiteTools config) |
| Commenting           | JSDoc for public APIs, inline for complex logic |

### Language-Specific Rules

- **TypeScript** is the default for all runtime and tooling code.

### Formatting & Linting

- Use **Prettier** for consistent code formatting.
- Use **ESLint** with the shared SuiteTools config for linting.

See [Linting Standard](../governance/standards/linting-standards.md) for details.

### Commenting {#commenting}

- Use **JSDoc** for all public APIs.
- All public APIs must have **JSDoc** with:
  - Description (what it does, not just what it is)
  - Parameters and return types
  - Links to related modules or guides
- Comment complex logic and non-obvious decisions.
- Avoid redundant comments that restate the code.
- Use `// TODO:` for future improvements and `// FIXME:` for known issues.
- Use `@internal` for non‑public APIs to signal exclusion from generated docs.
- Use `@deprecated` in JSDoc for deprecated APIs, with guidance on alternatives.

### File Naming & Organization

- Use **kebab-case** for file and directory names.
- Group related files into directories by feature or domain.
- Keep files **single-purpose**; avoid large, monolithic files.
- Use `index.ts` for module entry points.

### Config Style

- Use **JSON** for configuration files unless YAML is explicitly required.
- Key ordering should be logical (e.g., alphabetical or grouped by function).
- **Quote rules**:
  - Use double quotes for JSON keys and string values.
  - Use single quotes for JavaScript/TypeScript strings.

---

## Commit & Changelog Style {#commit-changelog-style}

- Follow [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.
- Changelog entries must:
  - Be **human‑readable**
  - Link to relevant issues or PRs
  - Use consistent tense and voice

> **Reminder:** This guide is a **living document** — if you find friction, propose an improvement.
> Stewardship means leaving the suite clearer than you found it.

---

## 🧭 Stewardship Callout

- Follow the structure and tone defined for consistency.
- Regularly review and update documentation to ensure accuracy and relevance.
