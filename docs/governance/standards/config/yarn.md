# ⚙️ Yarn Config

> **SuiteTools Governance Artifact**
> Authoritative source: [.yarnrc.yml](../../../../.yarnrc.yml)

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

This document annotates the `.yarnrc.yml` configuration, explaining the suite‑wide Yarn settings, package extensions, and plugins that apply to all workspaces.

### 🔗 Related

- [Yarn Foundations](../../../guides/yarn-core.md) — baseline configuration and conventions
- [Yarn Dependencies](../yarn-dependencies.md) — dependency rules and enforcement
- [Yarn Workflows](../../../guides/yarn-workflows.md) — operational commands and contributor workflow

---

## 🛠️ Package Extensions

<!-- heading-title-case: ignore -->
### `flowbite` → `tailwindcss` Patch

```yaml
packageExtensions:
  flowbite@*:
    dependencies:
      tailwindcss: "*"
```

**Purpose:**
The Flowbite plugin requires `tailwindcss` but does not declare it as a dependency.
Under Yarn Plug’n’Play strict mode, this omission causes resolution failures.
This package extension explicitly adds `tailwindcss` as a dependency for all versions of `flowbite`, ensuring compatibility without manual installs.

**Governance Notes:**

- All package extensions must be documented here with a clear rationale.
- Patches should be temporary — track upstream issues and remove once fixed.
- Avoid using broad `*` version ranges unless necessary for compatibility.
- Any new package extensions require governance review and approval.

## 🔌 Plugin Extensions

```yaml
plugins:
  - checksum: ffd9b2dbbe2efe008987559cb4cfb8feeee45eae9b550bbd6154a535919362466f4a09a9de56f1e1502a804592b95848839bc9c5bdd7d4e2891d8532e7045258
    path: .yarn/plugins/@yarnpkg/plugin-licenses.cjs
    spec: "https://raw.githubusercontent.com/mhassan1/yarn-plugin-licenses/v0.15.1/bundles/@yarnpkg/plugin-licenses.js"
```

**Plugin:** `@yarnpkg/plugin-licenses`
**Purpose:** Generates `THIRD_PARTY_LICENSES.md` listing all third‑party packages and their licenses, supporting compliance tracking and legal review.

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
