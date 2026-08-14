# 🧑‍💻 Linting Standards

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: August 13, 2026

---

## 🎯 Purpose

Linting is not just about enforcing style — it's about **maintainable, predictable, and readable code** across the suite.
Rules are chosen to:

- Reduce cognitive load for reviewers.
- Prevent common bugs.
- Keep diffs minimal and meaningful.
- Support suite‑wide discoverability and onboarding clarity.

---

### 🔗 Related Governance {#related-governance}

- [Biome Config](config/biome.md) — annotated `biome.json`, and every deviation from a Biome default.
- [Linting Guide](../../guides/linting.md) — commands and day‑to‑day workflow.
- [TypeScript Config](./config/typescript.md) — type‑checking alignment.

---

## 🗂️ Rule Categories

Organized into thematic groups for clarity and actionability. Biome groups its own rules along similar lines — `correctness`, `suspicious`, `complexity`, `style`, `security`, `performance` and `a11y`.

### Code Style

Readability, consistency, and review ergonomics.

- Formatting is not a matter of opinion; `yarn format` decides it.
- Keep imports grouped (external → internal → relative) for easy scanning. This is convention, not enforced: automatic import sorting is off because it also reorders `export *` statements and would break curated barrel files.
- Use camelCase for variables and functions, PascalCase for types and components. Convention, not enforced.

### Error Prevention

Avoid bugs and runtime surprises.

- Use `const` instead of `let` when variables don't change.
- Replace "magic numbers" with named constants for clarity.
- Use strict equality; loose `==` is an error.

### Type Safety

Correctness via TypeScript constraints.

- No implicit `any` — every type should be explicit.
- Add return types to exported functions so APIs are self‑documenting.

Note that **type-aware linting is not available**. Biome does not use type information, so rules such as `no-unsafe-return` and `explicit-module-boundary-types` are no longer enforced by the linter. `yarn typecheck` remains the authority on type correctness.

### Maintainability

Long‑term clarity and complexity limits.

- Keep functions small enough to be easily tested; Biome's `complexity` group flags the worst offenders.
- Use JSDoc on exported APIs to help future maintainers. This is now **convention rather than an enforced rule** — see [JSDoc Standards](../../guides/jsdoc-standards.md).

### Workspace Boundaries

Layering, modularity, and import hygiene.

- Don't import directly from another workspace's internals.
- Use only the public API of a package, not deep file paths.

These are conventions reinforced by the TypeScript project references and by review, not by a lint rule.

### Documentation & Exports

Discoverability and public API clarity.

- Every export should have JSDoc so it's clear in IDEs.
- Avoid anonymous default exports so code is traceable.

---

## 🚦 Rule Tiers

- **Core Enforcement** — Biome's `recommended` preset, at `error`. `yarn lint` fails, so violations block merges.
- **Advisory** — a small set of rules with pre-existing backlogs, at `warn`. Reported on every run but non-blocking, and tracked for promotion to `error`.

The advisory tier exists so a known backlog stays visible in the tool itself rather than being disabled and forgotten. The rules currently in it, and why each is deferred, are listed in [Biome Config](config/biome.md#-rule-severity).

---

## 📚 Rule Reference

[`biome.json`](../../../biome.json) is the single source of truth for which rules are active and at what severity. Biome's own [rule reference](https://biomejs.dev/linter/rules/) documents what each rule does; duplicating that list here would only let it drift.

What this project decides, and therefore records in [Biome Config](config/biome.md), is narrower:

- Which defaults are overridden, and the measurement behind each.
- Which rules are advisory rather than enforced, and why.
- Which ESLint capability was not carried over — JSDoc rules, type-aware rules, and Markdown heading checks.

---

## 🚫 Exceptions & Overrides

- Suppress a rule inline only with a stated reason, using `// biome-ignore lint/<rule>: <reason>`.
- The reason must be on the **same line** as the directive, and the directive must **immediately precede** the reported node.
- Overrides are reviewed during MRs and should be removed as soon as the underlying issue is fixed.
- Path-scoped exceptions belong in `overrides` in `biome.json`, and require the same justification.

---

## 🧭 Stewardship Callout

- [`biome.json`](../../../biome.json) is the source of truth for rules; this document is the source of truth for **policy**.
- Update [Biome Config](config/biome.md) **in the same commit** as any `biome.json` change.
- Include rule names in commit messages when adding, removing or re-tiering rules.
