# ⚙️ Yarn Config

> **SuiteTools Governance Artifact**
> Authoritative source: [.yarnrc.yml](../../../../.yarnrc.yml)

Last updated: August 13, 2026

---

## 🎯 Purpose & Scope

This document annotates the `.yarnrc.yml` configuration, explaining the suite‑wide Yarn settings, package extensions, and plugins that apply to all workspaces.

### 🔗 Related

- [Yarn Foundations](../../../guides/yarn.md) — baseline configuration and conventions
- [Yarn Dependencies](../yarn-dependencies.md) — dependency rules and enforcement
- [Yarn Workflows](../../../guides/yarn-workflows.md) — operational commands and contributor workflow

---

## 🛠️ Package Extensions

Package extensions declare dependencies that an upstream package uses but forgets to list. Under Plug'n'Play that omission was fatal — strict resolution rejected the import outright. Under the `node-modules` linker adopted in #74, hoisting resolves it anyway, so each extension has to justify itself on other grounds.

Each was re-evaluated in #74 by removing it, reinstalling, and diffing `yarn explain peer-requirements`. Passing tests are not sufficient evidence, because hoisting makes almost any extension look removable.

### `@oracle/suitecloud-unit-testing` → `@babel/core`

```yaml
packageExtensions:
  "@oracle/suitecloud-unit-testing@*":
    dependencies:
      "@babel/core": "*"
```

The SuiteCloud Jest transformer loads Babel presets but does not declare `@babel/core`.

**Kept.** `backend/package.json` declares `@babel/core` directly, so the backend suite passes either way — but removing the extension makes Yarn report `@babel/core` as an unmet peer of `@babel/preset-env` and 88 other packages. Keeping the peer graph clean is not a PnP-specific job.

### Removed

- **`ts-jest` → `jest-util`** (#74) — `ts-jest` reaches for `jest-util` without declaring it, which PnP rejected. `jest-util` is in the hoisted tree via `jest` itself, and removing the extension introduced no unmet peer requirement. It was inert.
- **`flowbite` → `tailwindcss`** (#73) — `flowbite` stopped being a dependency when #67 upgraded `flowbite-react` to 0.12, so the extension was patching a package that is no longer installed.

**Governance Notes:**

- All package extensions must be documented here with a clear rationale.
- Patches should be temporary — track upstream issues and remove once fixed.
- Avoid using broad `*` version ranges unless necessary for compatibility.
- Any new package extensions require governance review and approval.
- A missing dependency that only `node-modules` hoisting saves is still an upstream bug. Prefer declaring it in the workspace that needs it, as `backend` does for `@babel/core`, over reintroducing an extension.

## 🔐 Migrated Security Settings

Upgrading to Yarn 4.18.0 in #73 triggered Yarn's migration (`YN0087`), which wrote three settings into `.yarnrc.yml` to preserve the behaviour the project had under 4.9.2. Yarn 4.18 hardened all three defaults, so each pin is an explicit opt-out and is recorded here rather than left implicit.

### `npmMinimalAgeGate` — pinned to `0`

Yarn 4.18 default: `1d`.

**Purpose:**
Refuses package versions published within the last day, guarding against freshly published malicious releases. The migration pinned it to `0`, which opts out of that protection entirely. **Candidate for adoption.**

### `approvedGitRepositories` — pinned to `["**"]`

Yarn 4.18 default: `[]`.

**Purpose:**
Restricts which git repository URLs may be fetched. No dependency in `yarn.lock` resolves over git, so `["**"]` is broader than this project needs and carries no benefit. **Candidate for tightening.**

### `enableScripts` — pinned to `true`

Yarn 4.18 default: `false`.

**Purpose:**
Allows packages to run install scripts. Must stay `true` — `esbuild`, `rolldown`, `rollup`, `oxc-parser`, `lightningcss` and `@oracle/suitecloud-cli` all rely on install scripts to place their native binaries.

**Governance Notes:**

- These are behaviour-preserving values chosen by an automated migration, not deliberate project decisions.
- Adopting the hardened defaults is a separate change with its own risk profile and should be evaluated on its own.
- Keep this section in sync with `.yarnrc.yml`; the inline comments there carry the same rationale.

## 🔌 Plugin Extensions

```yaml
plugins:
  - checksum: ffd9b2dbbe2efe008987559cb4cfb8feeee45eae9b550bbd6154a535919362466f4a09a9de56f1e1502a804592b95848839bc9c5bdd7d4e2891d8532e7045258
    path: .yarn/plugins/@yarnpkg/plugin-licenses.cjs
    spec: "https://raw.githubusercontent.com/mhassan1/yarn-plugin-licenses/v0.15.1/bundles/@yarnpkg/plugin-licenses.js"
```

**Plugin:** `@yarnpkg/plugin-licenses`
**Purpose:** Generates `THIRD_PARTY_NOTICES.md` listing all third‑party packages and their licenses, supporting compliance tracking and legal review.

**Governance Notes:**

- Plugin checksums ensure integrity — do not modify without governance approval.
- Any plugin additions or updates must be documented here with rationale.
- Keep plugin versions pinned or checksum‑locked to avoid unexpected changes.
- Removal of a plugin requires governance review to confirm no loss of required functionality.

---

## 🧭 Stewardship Callout

- This configuration applies to **all workspaces** — do not override without governance approval.
- Update this document in sync with [.yarnrc.yml](../../../../.yarnrc.yml).
- Treat changes to package extensions or plugins as **suite‑wide** — coordinate updates across all workspaces.
- Remove package extensions once upstream packages declare correct dependencies.
- Keep plugin usage minimal and purposeful to reduce maintenance overhead.
