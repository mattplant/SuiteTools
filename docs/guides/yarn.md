# Yarn Foundations Guide

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

This document defines the **the baseline Yarn configuration and conventions** that apply suite‑wide.
Without this, every workspace could drift into its own Yarn habits.

SuiteTools uses **Yarn Berry** (v3+) with **Plug’n’Play (PnP)** and **workspaces** to manage its modular monorepo.
This approach enforces modularity, ensures reproducible builds, and provides immediate feedback on dependency hygiene.

This **Core** doc covers **baseline configuration and conventions** only:

- Philosophy and rationale for Yarn Berry + PnP
- Workspace architecture and naming conventions
- High‑level deduplication goals
- Configuration file structure and key settings

It does **not** cover:

- Dependency rules or enforcement — see [`yarn-dependencies.md`](../governance/standards/yarn-dependencies.md)
- Day‑to‑day contributor commands or workflows — see [`yarn-workflows.md`](./yarn-workflows.md)

> **Contributor Quick Facts**
>
> - PnP means no `node_modules` — undeclared dependencies will fail immediately.
> - Workspaces are isolated — declare cross‑workspace dependencies explicitly.
<!-- TODO: > - Lockfile is immutable in CI — run `yarn install` locally before pushing to avoid merge conflicts. -->

---

## 📐 Why Yarn Berry & PnP

- **No `node_modules` folder** — dependencies are stored in a global cache and mapped directly to code.
- **Central resolution manifest** — `.pnp.cjs` maps every `require()` or `import` to its location.
- **Strict dependency boundaries** — undeclared imports fail fast.
- **Deterministic installs** — fully reproducible from `yarn.lock` + `.pnp.cjs`.
- **IDE integration** — `.yarn/sdks` enables autocompletion, type checking, and jump‑to‑definition.

**In practice for SuiteTools:**

- Enforced **modularity** between workspaces
- **Predictable builds** across environments
- Immediate feedback when dependencies are undeclared, mis‑scoped, or inconsistent

---

## 🗂️ Workspace Architecture

Yarn workspaces let SuiteTools manage dependencies at the monorepo level while keeping each workspace isolated.

For the broader architectural rationale, see [Architecture: Workspaces](../architecture/architecture.md#workspaces).

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

For detailed policy, see [Yarn Dependencies – Deduplication Policy](../governance/standards/yarn-dependencies.md#deduplication-policy).
For step‑by‑step commands, see [Yarn Workflows – Deduplication Workflow](./yarn-workflows.md#deduplication-workflow).

---

## ⚙️ Configuration Structure

### Root `package.json`

Defines workspaces and shared dependencies.

### Key Yarn Files

```plaintext
SuiteTools root
├── .pnp.cjs         # PnP runtime manifest
├── .pnp.loader.mjs  # Node.js loader for PnP
├── .yarn/           # Yarn directory
│   ├── plugins/          # Yarn plugins
│   ├── sdks/             # IDE SDKs
│   ├── unplugged/        # Unplugged packages
│   ├── install-state.gz  # Install state metadata
├── .yarnrc.yml      # Yarn configuration
└── yarn.lock        # Lockfile for dependency versions
```

### File Purposes

| File / Directory         | Purpose                                                                 |
|--------------------------|-------------------------------------------------------------------------|
| `.pnp.cjs`               | Maps every `require()`/`import` to its resolved location (PnP manifest) |
| `.pnp.loader.mjs`        | Node.js loader hook for PnP                                             |
| `.yarn/`                 | Yarn’s internal data and plugin storage                                 |
| `.yarn/plugins/`         | Installed Yarn plugins (e.g., `workspace-tools`, `patch`)               |
| `.yarn/sdks/`            | Generated SDKs for IDE integration                                      |
| `.yarn/unplugged/`       | Packages extracted for tools that can’t work with PnP directly          |
| `.yarn/install-state.gz` | Compressed metadata for install state                                   |
| `.yarnrc.yml`            | Project‑level Yarn configuration                                        |
| `yarn.lock`              | Lockfile ensuring deterministic dependency versions                     |

### Notable Directories and Files

#### `.yarn/plugins`

Contains Yarn plugins that extend functionality.

**Notable plugins:**

- `@yarnpkg/plugin-licenses`: Generates `THIRD_PARTY_LICENSES.md` listing third‑party packages and their licenses.
<!-- TODO: Investigate whether `@yarnpkg/plugin-typescript` would be beneficial for TypeScript support. -->

#### `.yarn/unplugged`

Contains packages that have been "unplugged" from PnP for manual patching, inspection, or compatibility reasons. These are extracted from the cache and stored here temporarily.

Since our linting and formatting tools (ESLint and Prettier) do not fully support Yarn's Plug’n’Play out of the box, we needed to unplug them for compatibility.

#### `.yarn.lock`

The lockfile is automatically generated by Yarn and contains the exact versions of all dependencies used in the project. It ensures that installs are reproducible across different environments.

The `yarn.lock` file is a critical artifact for reproducibility. SuiteTools treats it as a source of truth for dependency resolution.

### Key Settings

| Setting                     | Purpose                                                                 |
|----------------------------|-------------------------------------------------------------------------|
| `nodeLinker: pnp`          | Enables Plug’n’Play for strict dependency resolution (no `node_modules`) |
| `enableGlobalCache: false` | Ensures all cache is local to the repo for reproducibility              |
| `nmMode: hardlinks-local`  | (Optional) Enables hybrid mode for tooling compatibility                |
| `plugins:`                 | Lists Yarn plugins used (e.g. `workspace-tools`, `patch`, `interactive-tools`) |

### Custom Scripts

- `yarn reset`: Clears Yarn caches and restores a clean install state.

---

## Conclusion

SuiteTools leverages Yarn’s powerful workspace capabilities to manage a modular monorepo structure, ensuring consistent tooling, shared dependencies, and efficient development workflows.

Use this guide alongside these other documents to ensure every change is compliant, maintainable, and easy to integrate.

- [Yarn Dependencies](../governance/standards/yarn-dependencies.md)
- [Yarn Workflows](./yarn-workflows.md)
