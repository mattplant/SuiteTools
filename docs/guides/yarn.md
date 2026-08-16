# Yarn Foundations Guide

Last updated: 2026-08-13

---

## 🎯 Purpose & Scope

This document defines the **the baseline Yarn configuration and conventions** that apply suite‑wide.
Without this, every workspace could drift into its own Yarn habits.

SuiteTools uses **Yarn 4** with the **`node-modules` linker** and **workspaces** to manage its modular monorepo.
This approach enforces modularity and ensures reproducible builds.

This **Core** doc covers **baseline configuration and conventions** only:

- Philosophy and rationale for Yarn 4 and the linker choice
- Workspace architecture and naming conventions
- High‑level deduplication goals
- Configuration file structure and key settings

It does **not** cover:

- Dependency rules or enforcement — see [`yarn-dependencies.md`](../governance/standards/yarn-dependencies.md)
- Day‑to‑day contributor commands or workflows — see [`yarn-workflows.md`](./yarn-workflows.md)

> **Contributor Quick Facts**
>
> - Use this project’s Yarn 4 (`packageManager` / `.yarn/releases`).
> - `packageManager` lives in the **root** `package.json` only — Corepack resolves it upward, so workspaces must not carry their own copy.
> - Dependencies install to `node_modules`. Hoisting means an undeclared import may resolve anyway — declare it regardless.
> - Workspaces are isolated — declare cross‑workspace dependencies explicitly.
> - Lockfile is immutable in CI (`yarn install --immutable`) — run `yarn install` locally after dependency changes before pushing.
>
---

## 📐 Why Yarn 4 & `node-modules`

- **Workspaces** — one lockfile and one dependency graph across `frontend`, `backend` and `shared`.
- **Deterministic installs** — fully reproducible from `yarn.lock`.
- **Zero editor setup** — dependencies live in `node_modules`, so VS Code, TypeScript and every build tool resolve them natively with no generated SDK layer.
- **Tooling compatibility** — `node-modules` is the linker the whole stack targets. Vite formally deprecated Plug’n’Play support, and the frontend is a Vite application.

**In practice for SuiteTools:**

- Enforced **modularity** between workspaces
- **Predictable builds** across environments
- A fresh clone reaches a working editor and a working build with `yarn install` alone

### What the Linker Change Gave Up

SuiteTools ran on **Plug’n’Play** until #74. PnP resolved every import through `.pnp.cjs` and failed immediately on anything undeclared — real strictness that this project valued. Under `node-modules`, dependencies are hoisted, so an undeclared import can resolve silently.

That guarantee is **not** replaced, and this guide says so rather than implying it survived. Two things soften the loss:

- What PnP caught here was almost always **third‑party sloppiness**, not first‑party mistakes. Every `packageExtension` this project carried existed to patch an upstream package that shipped undeclared dependencies, not a SuiteTools import. See [Yarn Config](../governance/standards/config/yarn.md) for which of them survived the linker change and which were measured to be doing nothing.
- This project’s **own** imports stay governed by review and by the rules in [Monorepo & Workspace Boundaries](../architecture/monorepo-and-workspace-boundaries.md).

The rule for contributors is unchanged: **declare every dependency in the workspace that imports it.** What changed is that nothing will stop you if you forget.

---

## 🗂️ Workspace Architecture

Yarn workspaces let SuiteTools manage dependencies at the monorepo level while keeping each workspace isolated.

For the broader architectural rationale, see [Monorepo & Workspace Boundaries](../architecture/monorepo-and-workspace-boundaries.md).

### Workspace Conventions & Naming

- Decide early which workspaces are **first‑class packages** (versioned/published) vs **private tooling**.
- Mark internal‑only packages with `"private": true` in `package.json`.
- **Scoped packages** under `@suiteworks`
- **Prefix** with `suitetools-` to distinguish from other `@suiteworks` projects
- **Descriptive, lowercase, hyphen‑separated names**
- Avoid special characters and generic terms
- Use `@suiteworks/suitetools-<scope>` for clear separation of concerns
- **Use root directories instead of packages** for:
  - Documentation in `docs/` directory
  - Infra scripts in `infra/` directory

**Examples:**

- Core: `@suiteworks/suitetools-shared`
- Planned:
  - `@suiteworks/suitetools-frontend` — UI rendering, client‑side SuiteScript
  - `@suiteworks/suitetools-backend` — server‑side SuiteScript, metadata loading

These rules ensure discoverability, avoid namespace collisions, and make package purpose clear at a glance. Lowercase with hyphens improves readability in imports, and avoiding generic names prevents ambiguity in dependency graphs.

---

## 🔄 High-Level Deduplication Policy

Yarn’s built‑in deduplication reduces install size, prevents resolution drift, and ensures consistent behavior.

**Goals:**

- Minimize duplicate versions
- Align versions across workspaces
- Keep `yarn.lock` clean and auditable

For detailed policy, see [Yarn Dependencies – Deduplication Policy](../governance/standards/yarn-dependencies.md#-deduplication-policy).
For step‑by‑step commands, see [Yarn Workflows – Deduplication Workflow](./yarn-workflows.md#-deduplication-workflow).

---

## ⚙️ Configuration Structure

### Root `package.json`

Defines workspaces and shared dependencies.

### Key Yarn Files

```plaintext
SuiteTools root
├── node_modules/    # Installed dependencies (gitignored)
├── .yarn/           # Yarn directory
│   ├── plugins/          # Yarn plugins
│   ├── releases/         # Pinned Yarn release
│   ├── cache/            # Package cache (gitignored)
│   ├── install-state.gz  # Install state metadata
├── .yarnrc.yml      # Yarn configuration
└── yarn.lock        # Lockfile for dependency versions
```

### File Purposes

| File / Directory         | Purpose                                                   |
|--------------------------|-----------------------------------------------------------|
| `node_modules/`          | Installed dependencies, written by the linker; gitignored |
| `.yarn/`                 | Yarn’s internal data and plugin storage                   |
| `.yarn/plugins/`         | Installed Yarn plugins (currently `plugin-licenses`)      |
| `.yarn/releases/`        | The pinned Yarn release named by `yarnPath`               |
| `.yarn/cache/`           | Package cache kept inside the clone; gitignored           |
| `.yarn/install-state.gz` | Compressed metadata for install state                     |
| `.yarnrc.yml`            | Project‑level Yarn configuration                          |
| `yarn.lock`              | Lockfile ensuring deterministic dependency versions       |

### Notable Directories and Files

#### `.yarn/plugins`

Contains Yarn plugins that extend functionality.

**Notable plugins:**

- `@yarnpkg/plugin-licenses`: Generates `THIRD_PARTY_NOTICES.md` listing third‑party packages and their licenses.

`@yarnpkg/plugin-typescript` is **not** used. TypeScript support comes from workspace `tsconfig`s, the pinned `typescript` in `node_modules`, and root `yarn typecheck` — not from auto-adding `@types/*` via that plugin.

#### `.yarn/cache`

Holds the zipped package archives Yarn installs from. `enableGlobalCache: false` keeps it inside the clone so CI cache keys and offline installs stay predictable.

The directory is gitignored — zero‑installs are not in use. Unplugging, and the `.yarn/unplugged/` directory it produced, were PnP-only concepts and are gone as of #74; ESLint and Prettier were the last packages to need it and both left in #70.

#### `.yarn.lock`

The lockfile is automatically generated by Yarn and contains the exact versions of all dependencies used in the project. It ensures that installs are reproducible across different environments.

The `yarn.lock` file is a critical artifact for reproducibility. SuiteTools treats it as a source of truth for dependency resolution.

### Key Settings

| Setting                    | Purpose                                                                                                           |
|----------------------------|-------------------------------------------------------------------------------------------------------------------|
| `nodeLinker: node-modules` | Installs dependencies into `node_modules` (the Yarn 4 default)                                                    |
| `enableGlobalCache: false` | Keeps the package cache in `.yarn/cache` inside the clone, so CI cache keys and offline installs stay predictable |
| `enableScripts: true`      | Allows install scripts to run — required for native binaries                                                      |
| `npmMinimalAgeGate: 0`     | Opts out of Yarn 4.18’s publish‑age guard; candidate for adoption                                                 |
| `approvedGitRepositories`  | Pinned to `**`; no dependency resolves over git, so it is a candidate for tightening                              |
| `yarnPath`                 | Pins the Yarn release under `.yarn/releases`                                                                      |
| `plugins:`                 | Lists Yarn plugins used (currently `plugin-licenses`)                                                             |

Only `.yarnrc.yml` and `yarn.lock` are committed for install layout — `.yarn/cache/` and `node_modules/` are both gitignored. For the annotated `.yarnrc.yml`, including the settings Yarn’s 4.18 migration pinned, see [Yarn Config](../governance/standards/config/yarn.md).

### Custom Scripts

- `yarn run yarn:reset`: Clears Yarn caches and restores a clean install state (`scripts/resetYarn.sh`).

---

## Conclusion

SuiteTools leverages Yarn’s powerful workspace capabilities to manage a modular monorepo structure, ensuring consistent tooling, shared dependencies, and efficient development workflows.

Use this guide alongside these other documents to ensure every change is compliant, maintainable, and easy to integrate.

- [Yarn Dependencies](../governance/standards/yarn-dependencies.md)
- [Yarn Workflows](./yarn-workflows.md)
