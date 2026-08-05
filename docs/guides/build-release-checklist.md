# 📘 SuiteTools Build & Release Checklist

Last updated: 2026-08-04

---

## 🎯 Purpose

This checklist is a **quick reference** for contributors and maintainers.
It summarizes the most common **deploy commands** (for day‑to‑day development) and **release steps** (for suite‑wide versioning).

For full context, see:

- [📚 Installation Guide](./installation.md) — first-time setup, prereqs (Node, Yarn 4, Java), monorepo build order
- [📚 Customizing Guide](./customizing.md) — contributor‑level development and deployment
- [🛠️ Build & Release Guide](./build-release.md) — maintainer‑level build and release process

---

## 🚀 Deploy Commands (Users and Contributors)

Prereqs: NetSuite auth configured (`yarn run sdf-account-setup`), **JDK** available for SuiteCloud CLI, and Yarn 4 from this repo (`packageManager` / `.yarn/releases`).

### Frontend (SPA only)

From the monorepo root:

```bash
yarn workspace frontend run build-and-deploy
```

- ✅ Builds **shared** (`prebuild`), builds the SPA into `backend/.../SuiteTools/dist/`, then `suitecloud file:upload` for those assets.
- ✅ Always use `build-and-deploy` — bare `deploy` uploads without rebuilding.
- ❌ Don’t forget to reload the Suitelet — stale browser assets may mask changes.

### Backend (SuiteScript / SDF objects)

```bash
yarn workspace backend run build
yarn workspace backend run deploy
```

- ✅ `prebuild` builds **shared** automatically.
- ✅ `deploy` is full SDF `project:deploy` (scripts, objects, FileCabinet).
- ✅ For a **first-time** account install, build **frontend** as well before `backend` deploy so SPA `dist/` is present — see [Installation](./installation.md).

---

## 📦 Release Steps (Maintainers)

1. **Version bump** — update suite‑wide version according to [SemVer](https://semver.org/).
2. **Changelog** — update `CHANGELOG.md` with features, fixes, and migration notes.
3. **Breaking changes** — document impact + migration path clearly.
4. **Tag & push** — create a Git tag for the release version.
5. **Publish** — run release script (CI/CD pipeline or `yarn release`).
6. **Notify** — share release notes with consumers.

---

## ⚠️ Common Pitfalls

- ❌ Skipping `CHANGELOG.md` → ✅ Always document changes
- ❌ Publishing without typecheck/tests → ✅ Run full validation before tagging
- ❌ Cross‑workspace imports → ✅ Use `shared/` outputs only
- ❌ Missing migration notes → ✅ Every breaking change must include guidance
- ❌ Backend deploy without a prior frontend build on a fresh account → ✅ Build FE then BE for first install
- ❌ Using a different Yarn than this repo pins → ✅ Use Yarn 4 from `packageManager` / `.yarn/releases`

---

## 🔗 Related Docs

- [📚 Installation Guide](./installation.md)
- [📚 Customizing Guide](./customizing.md)
- [🛠️ Build & Release Guide](./build-release.md)
