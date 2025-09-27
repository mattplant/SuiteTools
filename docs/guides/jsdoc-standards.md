# 🧑‍💻 JSDoc Standards

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

Defines how SuiteTools uses **JSDoc** to document source files.
JSDoc is treated as **architectural metadata** — not just comments — ensuring discoverability, licensing clarity, and contributor context.

---

## 📐 Standard Template

Every source file should begin with a structured JSDoc block:

```ts
/**
 * @fileoverview [Short summary]
 * @module [Logical module name]
 * @remarks [Boundary assumptions or design notes]
 * @license [SPDX identifier]
 * @attribution [Upstream inspiration or references]
 * @see [Related files or docs]
 */
```

---

## 🛠️ Required Tags

- `@fileoverview` — one‑line summary of the file’s purpose.
- `@module` — logical module name (matches workspace/module boundaries).
- `@remarks` — boundary assumptions, design notes, or architectural context.
- `@license` — SPDX identifier (e.g., `GPL-3.0-or-later`).
- `@attribution` — upstream inspiration, references, or reused snippets.
- `@see` — related files, guides, or external references.

---

## ⚙️ Lint & Enforcement

- JSDoc blocks are validated via ESLint rules.
- Missing or malformed tags will fail lint checks.
- SPDX identifiers are required for every file.
- Attribution tags are required when code is adapted or inspired by external sources.

---

## 💡 Contributor Tips

- Keep summaries concise (one sentence).
- Use `@remarks` for architectural context, not implementation detail.
- Always include `@license` and `@attribution` where applicable.
- Cross‑link related guides with `@see`.
- Treat JSDoc as **architectural metadata** — it communicates intent across boundaries.

---

## 🔗 Related Docs

- [📚 Documentation as Architecture](../architecture/docs-architecture.md)
- [ATTRIBUTION.md](../../ATTRIBUTION.md)
- [📑 Style Guide](../governance/STYLE.md)

---

## 📋 Stewardship Notes

- Treat JSDoc as part of SuiteTools’ **public contract** — changes to tags or structure should be reflected in the changelog.
- Keep this standard in sync with ESLint rules in `/scripts/eslint-rules/`.
- Ensure new contributors understand that JSDoc is **not optional commentary** but enforceable metadata.
- Cross‑link updates here with [ATTRIBUTION.md](../../ATTRIBUTION.md) and [STYLE.md](../governance/STYLE.md) to avoid drift.

By following these standards, contributors ensure SuiteTools’ source files remain **discoverable, compliant, and maintainable** across the suite.
