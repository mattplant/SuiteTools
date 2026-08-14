# 🗂️ Monorepo Architecture & Workspace Boundaries

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

Defines the **structure, boundaries, and enforcement rules** for the SuiteTools monorepo — including workspace layout, benefits, enforcement mechanisms, and allowed/disallowed imports.

It does **not** cover:

- Yarn configuration or dependency governance — see [Yarn Foundations](../guides/yarn.md) and [Yarn Dependencies](../governance/standards/yarn-dependencies.md)
- Contributor workflows — see [Yarn Workflows](../guides/yarn-workflows.md)

---

## Monorepo Overview

SuiteTools is organized as a **modular monorepo**, housing multiple related workspaces in a single repository.
This structure enforces clear boundaries, enables shared utilities, and applies consistent tooling across frontend, backend, and cross‑cutting logic.
It allows suite‑wide patterns to be defined once, then reused and enforced everywhere.

### Workspaces

- **`frontend/`** — React single‑page application (SPA) built with TypeScript and Flowbite‑React components.
- **`backend/`** — Backend integration with NetSuite via API and HTTP handlers.
- **`shared/`** — Cross‑cutting types, Zod schemas, assertion helpers, and utility functions.

---

## 🌐 Benefits of Workspaces

- **Shared dependencies** reduce duplication and speed installs
- **Consistent tooling** across packages (linting, formatting, testing)
- **Unified workflows** with `yarn workspaces foreach` or `yarn workspaces focus`
- **Explicit boundaries** prevent coupling and improve contributor clarity

---

## Workspace Boundary Enforcement

Strict workspace boundaries preserve modularity, reproducibility, and long‑term maintainability.
They prevent:

- ❌ Accidental hoisting of undeclared dependencies
- ❌ Cross‑workspace leakage of dev‑only tools
- ❌ Hidden coupling between unrelated packages

**Why It Matters:**

| Benefit                | Description                                                                     |
|------------------------|---------------------------------------------------------------------------------|
| Declared dependencies  | Each workspace must explicitly declare its runtime and peer dependencies        |
| Isolated dev tools     | Dev‑only tools (e.g., test runners, linters) must not leak into runtime paths   |
| Modular architecture   | Clear boundaries enable independent evolution and maintenance                   |
| Contributor clarity    | Onboarding is easier and mental load reduced when dependency intent is explicit |
| Predictable ownership  | Each workspace has clear responsibilities and ownership                         |

---

## 🛠️ Enforcement Mechanisms

These mechanisms are implemented in tooling and CI checks, and must be followed for every contribution:

| Mechanism                  | Description                                                             |
|----------------------------|-------------------------------------------------------------------------|
| `node-modules` linker      | Installs the resolved tree; hoisting leaves declarations unenforced     |
| `dependencies:` hygiene    | Contributors must declare all runtime deps in their own `package.json`  |
| `peerDependencies:` rules  | Used for shared interfaces or plugin‑style relationships                |
| `devDependencies:` scope   | Dev‑only tools must not leak into runtime or other workspaces           |
| `yarn constraints.pro`     | Custom rules defining allowed workspace access                          |

---

## 🔒 Workspace Boundaries

Maintaining these boundaries protects layering, reduces cognitive load for contributors, and ensures that architectural concerns stay localized and predictable.

- **No direct `frontend/` ↔ `backend/` imports** — UI and service layers communicate exclusively via `shared/`.
- **`shared/` is upstream‑only and self‑contained** — **must not** import from `frontend/` or `backend/`.

| Workspace   | Can Import From   | Cannot Import From      |
|-------------|-------------------|-------------------------|
| `frontend/` | `shared/`         | `backend/`              |
| `backend/`  | `shared/`         | `frontend/`             |
| `shared/`   | (none internally) | `frontend/`, `backend/` |

> **Roadmap:** Strict import boundaries will be enforced via TypeScript path aliases. Biome does not use type information, so cross-workspace import rules remain a convention reinforced by review.

---

## 🧩 Workspace Management

SuiteTools uses **Yarn 4** with the **`node-modules` linker** and **workspaces** to manage its modular monorepo and streamline development workflows.
For detailed Yarn usage and configuration, see [Yarn Foundations](../guides/yarn.md) and [Yarn Workflows](../guides/yarn-workflows.md).

---

## 🗒️ Stewardship Notes

- This document applies to **all workspaces** — do not override without governance approval.
- Update this document alongside any changes to workspace structure or enforcement rules.
- Keep diagrams, tables, and examples in sync with the actual codebase.
- Cross‑link this page from onboarding materials and governance docs to ensure visibility.
