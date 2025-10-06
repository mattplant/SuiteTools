# ⚙️ Prettier Config

> **SuiteTools Governance Artifact**

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

This document annotates the current multiple prettier config files, showing how they align with ESLint.

Prettier enforces **opinionated, automated formatting** to ensure:

- Predictable diffs
- Consistent style in code and documentation
- Reduced formatting debates in code review

---

## 🔗 Related Governance

- [Linting with SuiteTools](/docs/guides/linting) — strategy and philosophy
- [ESLint Config](./eslint.md) — linting alignment
- [TypeScript Config](./typescript.md) — type‑checking alignment

---

## 🗂️ Planned Improvements

- Move to single root-level config.
- Integrate with ESLint.

---

## ⚙️ Workspace Configs

### Core Rules (Backend & Frontend)

- `bracketSpacing: true` — `{ foo: bar }`
- `endOfLine: 'lf'` — normalize line endings
- `printWidth: 120` — matches SuiteTools review width
- `semi: true` — always use semicolons
- `singleQuote: true` — prefer single quotes
- `trailingComma: 'all'` — cleaner diffs
- `tabWidth: 2` — consistent with ESLint

### Backend

- [backend/prettier.config.cjs](../../../../backend/prettier.config.cjs)
- [backend/prettier.ignore](../../../../backend/prettier.ignore)

### Frontend

- [frontend/prettier.config.cjs](../../../../frontend/.prettierrc)
- [frontend/prettier.ignore](../../../../frontend/.prettierignore)

### Shared

_None._

---

## 🧭 Stewardship Callout

- Keep Prettier, ESLint, and STYLE.md aligned to avoid conflicting rules.
- Treat formatting changes as **suite‑wide** — update all affected files in a single commit to avoid noisy diffs.
