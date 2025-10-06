# ⚙️ ESLint Config

> **SuiteTools Governance Artifact**
> Authoritative source: [eslint.config.cjs](../../../../eslint.config.cjs)

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

This document annotates the `eslint.config.cjs` file, showing how suite‑wide rules, workspace overrides, and global ignores are composed.

### 🔗 Related Governance

- [Linting with SuiteTools](/docs/guides/linting) — strategy and philosophy
- [Linting Standards](../linting-standards.md) - rule categories and rule list
- [Prettier Config](./prettier.md) — formatting alignment.
- [TypeScript Config](./typescript.md) — type‑checking alignment.

---

## 🗂️ Configuration Layers

The config is composed of three layers:

| Layer | Purpose | Scope |
|-------|---------|-------|
| **Standard SuiteTools Config** | Shared language options, plugins, and rules | All workspaces |
| **Workspace Overrides** | Domain‑specific rules and globals | Backend, Frontend |
| **Global Ignores** | Paths excluded from linting | All workspaces |

---

## ⚙️ Standard Config

### Language Options

- `ecmaVersion`: 2022 (unless overridden for compatibility)
- `sourceType`: `module`
- `parser`: `@typescript-eslint/parser`

### Plugins

| Plugin | Purpose | Notes |
|--------|---------|-------|
| `@typescript-eslint` | Type‑aware linting | Required for all TS workspaces |
| `eslint-plugin-import` | Import order & hygiene | Enforces workspace boundaries |
| `eslint-plugin-jsdoc` | Documentation standards | Aligns with SuiteTools doc rules |
| `eslint-plugin-prettier` | Prettier integration | Ensures formatting consistency |

### Rules

See [Linting Standards — Rule Reference](../linting-standards.md#-rule-reference).

---

## 🛠️ Workspace Overrides

| Workspace  | Key Overrides                                   | Reason                                |
|------------|-------------------------------------------------|---------------------------------------|
| **Backend** | `suitescript` plugin, NetSuite globals, `ecmaVersion: 2021` | Enforce SuiteScript rules, maintain compatibility |
| **Frontend** | React + React Refresh plugins, `import` plugin, test file ignores | Enforce React best practices, skip test linting |
| **Shared**  | Minimal overrides                              | Keep shared code broadly compatible   |

---

## 🚫 Global Ignores

Paths excluded from linting to avoid false positives and wasted CI cycles:

- `node_modules/`
- `dist/`
- `.eslintrc.cjs`
- `frontend/src/FileCabinet/SuiteScripts/` (generated SuiteScript output)

## 🧭 Stewardship Callout

- This config applies to **all workspaces** — do not override without governance approval.
- Update this document in sync with [eslint.config.cjs](../../../../eslint.config.cjs)
- Keep Prettier, ESLint, and STYLE.md aligned to avoid conflicting rules.
- Treat formatting changes as **suite‑wide** — update all affected files in a single commit to avoid noisy diffs.
