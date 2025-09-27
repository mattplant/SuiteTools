# 📜 Yarn Dependencies

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: September 22, 2025

---

## 🎯 Purpose

This document sets the **governance and enforcement rules** for dependency management.

Clear, enforceable dependency rules keep SuiteTools **reproducible**, **maintainable**, and **easy to onboard**.
They prevent subtle bugs, reduce version drift, and make it obvious to contributors what’s allowed — and why.

---

## 📚 Scope of This Document

This **Workflows** doc covers **day‑to‑day operational steps** for working with Yarn in the SuiteTools monorepo:

- Common Yarn commands for contributors
- When and how to install dependencies at the root
- Typical contributor workflow from install to PR
- Local self‑checks to avoid CI failures
- Deduplication workflow and troubleshooting

It does **not** cover:

- Baseline Yarn configuration or conventions — see [yarn.md](../../guides/yarn.md)
- Day‑to‑day contributor commands or workflows — see [`yarn-workflows.md`](../../guides//yarn-workflows.md)

---

## 🧱 Dependency Hygiene Principles

SuiteTools enforces strict dependency boundaries to ensure reproducibility, clarity, and maintainability across all workspaces.

### Core Rules

- **Declare all dependencies** — no implicit transitives.
- **No cross‑workspace leakage** — import only from:
  - Declared dependencies
  - Explicitly listed workspaces in `dependencies` or `devDependencies`
- **Avoid duplicate versions** — align across workspaces.
- **Use `peerDependencies`** when:
  - Multiple workspaces share a dependency but don’t own its version
  - Building a plugin or library that integrates into another package

---

## 📏 Enforcement Mechanisms

This section defines the rules that govern dependency usage across the SuiteTools monorepo, the tools that enforce them, and the underlying Yarn mechanisms that make them possible.

| Rule / Check                           | Tool / Command         | Mechanism(s)                                   | Rationale |
|----------------------------------------|------------------------|------------------------------------------------|-----------|
| Missing dependency detection           | `yarn constraints`     | Plug’n’Play (`.pnp.cjs`), `dependencies:` hygiene | Prevents undeclared dependencies from being used at runtime |
| Cross‑workspace import boundary        | `yarn constraints`     | `yarn constraints.pro`                         | Stops unintended coupling between workspaces |
| Duplicate dependency version detection | `yarn dedupe --check`  | Plug’n’Play                                     | Reduces bundle size and avoids version conflicts |
| Peer dependency alignment              | `yarn constraints`     | `peerDependencies:` rules                      | Ensures shared contracts (e.g., React) are consistent across workspaces |
| Disallowed dependency list             | `yarn constraints`     | `yarn constraints.pro`                         | Blocks known‑bad or unapproved packages |

### Mechanism Reference

| Mechanism                 | Description                                                            |
|---------------------------|------------------------------------------------------------------------|
| Plug’n’Play (`.pnp.cjs`)  | Enforces resolution only through declared dependencies                 |
| `dependencies:` hygiene   | Contributors must declare all runtime deps in their own `package.json` |
| `peerDependencies:` rules | Used for shared interfaces or plugin-style relationships               |
| `devDependencies:` scope  | Dev-only tools must not leak into runtime or other workspaces          |
| `yarn constraints.pro`    | (Optional) Can define custom rules for workspace access                |

---

## Choosing the Right Dependency Type

| Scenario                                | Use `dependencies` | Use `peerDependencies` | Use `devDependencies` |
|-----------------------------------------|--------------------|------------------------|-----------------------|
| Runtime code needs it directly          | ✅                 | ❌                      | ❌                    |
| Shared contract/interface (e.g., React) | ❌                 | ✅                      | ✅ (for local dev)    |
| Build/test tooling only                 | ❌                 | ❌                      | ✅                    |
| Plugin or adapter for another package   | ❌                 | ✅                      | ✅ (for local dev)    |

### Peer Dependencies

- Declare shared libraries in both `peerDependencies` and `devDependencies` (the latter ensures local development works without manual installs).
- Use `peerDependencies` when:
  - Multiple workspaces rely on the same library but should not each install their own copy.
  - You are building a plugin, adapter, or library that integrates into another package’s runtime.
- Avoid locking peer dependency versions unless absolutely necessary for compatibility.
- Keep peer ranges broad enough to allow flexibility, but narrow enough to prevent breaking changes.

> **Do not** install React as a direct `dependency` in multiple workspaces if it is meant to be shared via `peerDependencies`.
> This will cause duplication and potential runtime errors.

---

## 🔄 Deduplication Policy

SuiteTools requires that dependencies be deduplicated to maintain a clean, predictable dependency tree.

**Policy:**

- Minimize duplicate versions across all workspaces.
- Align dependency ranges to the highest compatible version.
- Keep `yarn.lock` free of unnecessary version splits.
<!-- TODO - Deduplication compliance is enforced via `yarn dedupe --check` in CI. -->

**Rationale:**
Deduplication reduces bundle size, prevents resolution drift, and ensures consistent behavior across environments.

> For step‑by‑step commands, examples, and debugging tips, see [Yarn Workflows – Deduplication](../../guides/yarn-workflows.md#deduplication-workflow).

---

## 🧭 Stewardship Callout

- These rules prevent subtle bugs, reduce onboarding friction, and keep our builds reproducible and maintainable.
- Contributors should review the [Enforcement Mechanisms](#enforcement-mechanisms) before adding or modifying dependencies.
- Violations of these rules may block merges until corrected.
- Any plugin additions must be documented here with rationale.
- Any exceptions require explicit approval documented in the PR description.
- Keep this document updated as new tools or practices emerge.
