# SuiteTools Style Guide

> This document is part of the SuiteTools governance set.
> See `/docs/governance` for related policies and resources.

_Last updated: September 1, 2025_

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

> **Status:** Living document — updated as suite-wide conventions evolve.
> **Scope:** Applies to all prose, code, and configuration across the monorepo.

---

## 1. Purpose & Stewardship

This guide exists to:

- Ensure **suite-wide clarity** in both human‑readable and machine‑readable artifacts.
- Reduce cognitive load for contributors by making style decisions **predictable**.
- Model **transparent, reproducible governance** — every rule here is intentional and documented.

---

## 2. Prose Conventions

### 2.1 Tone & Voice

- **Empathetic and direct** — write for the next developer, not just the current one.
- Prefer **active voice** and **present tense** for clarity.
- Avoid jargon unless it’s defined in‑doc or linked to a glossary.

### 2.2 Structure

- Use **ATX headings** (`#`, `##`, `###`) with a single `#` for the document title.
- Keep sections **scannable**: short paragraphs, bullet lists, and code examples.
- One concept per paragraph; one action per sentence where possible.

### 2.3 Formatting

- Wrap lines at ~80–100 characters for diff‑friendly reviews.
- Use **semantic Markdown** — bold for emphasis, italics for nuance, code spans for identifiers.
- Link to canonical sources rather than duplicating content.

---

## 3. Code Conventions

### 3.1 Language & Syntax

- **TypeScript** is the default for all runtime and tooling code.
- Enforce strict compiler options (`strict: true`) and suite‑wide lint rules.
- Prefer `const` over `let` unless reassignment is required.

### 3.2 Naming

- **Variables & functions:** `camelCase`
- **Classes & types:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`
- Names should be **descriptive, not abbreviated**, unless the abbreviation is widely understood.

### 3.3 Structure & Patterns

- Keep modules **single‑purpose**; export only what’s needed.
- Follow suite‑wide error modeling and taxonomy for predictable handling.

---

## 4. Documentation in Code

- All public APIs must have **JSDoc** with:
  - Description (what it does, not just what it is)
  - Parameters and return types
  - Links to related modules or guides
- Use `@internal` for non‑public APIs to signal exclusion from generated docs.

---

## 5. Commit & Changelog Style

- Follow [Conventional Commits](https://www.conventionalcommits.org/) for all commit messages.
- Changelog entries must:
  - Be **human‑readable**
  - Link to relevant issues or PRs
  - Use consistent tense and voice

---

## 6. Governance & Evolution

- Changes to this guide require:
  - PR with rationale in the description
  - Review by maintainers
  - Update to the **versioned changelog** in `/CHANGELOG.md`

---

## 7. Quick Reference

| Artifact Type | Convention |
|---------------|------------|
| Markdown docs | ATX headings, 80–100 char wrap |
| Code          | TypeScript, strict mode, linted |
| Commits       | Conventional Commits |
| Errors        | Suite‑wide taxonomy |

---

> **Reminder:** This guide is a **living document** — if you find friction, propose an improvement.
> Stewardship means leaving the suite clearer than you found it.
