# 📚 SuiteTools Governance Standards Index

Canonical patterns for structure, style integration, and governance application.

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: September 22, 2025

---

## 🎯 Purpose

Defines the **standards** for SuiteTools documentation structure, style, and governance rules.
Each standard implements the principles in [SuiteTools Documentation as Architecture](../../architecture/docs-architecture.md) as reproducible, enforceable patterns — built to be referenced, applied, and kept in sync across the suite.

---

## 🧱 Three Pillars of Style

| Pillar | Scope | Role | Link |
|--------|-------|------|------|
| **Documentation as Architecture** | Conceptual | **`Why` we document** — guiding _philosophy_ for documentation as governed architecture. | [Philosophy](../../architecture/docs-architecture.md) |
| **Standards Index** | Macro‑level | **`What` to follow** — enforceable patterns for doc structure, placement, and governance. | [Standards Index](../standards/README.md) |
| **Style Guide** | Micro‑level | **`How` to express** — tone, structure, formatting, and naming conventions for all artifacts. | [Style Guide](../STYLE.md) |

---

## 📂 Standards in This Directory

- [Badge Cluster Usage](badge-clusters.md) — Badge cluster format and placement rules.
- [Callout Blocks](callout-blocks.md) — Standardized callout block formats for notes, warnings, tips, etc.
- [Documentation](documentation.md) — Documentation style, structure, and Markdown conventions.
  - [Documentation Header](documentation-header.md) — Required header structure.
  - [Documentation Body](documentation-body.md) — Guidelines for writing the main content.
  - [Documentation Sections](documentation-sections.md) — Standard section types and their purposes.
  - [Documentation Footer](documentation-footer.md) — Standard footer elements.
- [Emoji Usage](emoji.md) — Official rule set for emoji usage.
- [Emoji Reference](emoji-reference.md) — Full definitions, scope, and usage rules for all approved emojis.
- [Governance Document Definition](governance-docs.md) — Criteria for what qualifies as a governance document.
- [Linting Standards](linting-standards.md) — Rule categories and rule reference.
- [Yarn Dependencies](yarn-dependencies.md) – Governance and enforcement rules for dependency management

### 📂 Configuration Standards Subdirectory

- [ESLint Config](config/eslint.md) — Composition and application of the `eslint.config.cjs` file.

---

## 🔗 Related Standards (Outside This Directory)

- [STYLE.md](../STYLE.md) — Style rules for documentation and code.
- [SuiteTools Documentation as Architecture](../../architecture/docs-architecture.md) — Design philosophy for documentation structure, style, and stewardship.

---

## 🧭 Stewardship Callout

- All standards in this directory are **binding** for SuiteTools documentation.
- Changes to these files must be reflected in the changelog.
- Keep cross‑links between standards up to date to avoid drift.
