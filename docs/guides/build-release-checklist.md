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

## ✅ CI Gates (Merge Requests)

GitLab CI (`.gitlab-ci.yml`) on MRs and the default branch:

```bash
yarn typecheck   # merge-blocking — shared types + FE/BE tsc
yarn test        # merge-blocking
yarn lint        # advisory (allow_failure) until ESLint debt is cleared
```

- ✅ Red **typecheck** / **test** should block merge when **Pipelines must succeed** is enabled in project settings.
- ❌ SuiteCloud deploy is not run in MR CI.

---

## 📦 Release Steps (Maintainers)

1. **Version bump** — update suite‑wide version according to [SemVer](https://semver.org/).
2. **Changelog** — update `CHANGELOG.md` with features, fixes, and migration notes.
3. **Breaking changes** — document impact + migration path clearly.
4. **Validate** — confirm CI green (or run `yarn typecheck && yarn lint && yarn test` locally).
5. **Tag & push** — create a Git tag for the release version.
6. **Publish** — run release script when available (`yarn release` or release automation).
7. **Notify** — share release notes with consumers.

---

## ⚠️ Common Pitfalls

- ❌ Skipping `CHANGELOG.md` → ✅ Always document changes
- ❌ Publishing without typecheck/tests → ✅ Rely on CI gates / run full validation before tagging
- ❌ Cross‑workspace imports → ✅ Use `shared/` outputs only
- ❌ Missing migration notes → ✅ Every breaking change must include guidance
- ❌ Backend deploy without a prior frontend build on a fresh account → ✅ Build FE then BE for first install
- ❌ Using a different Yarn than this repo pins → ✅ Use Yarn 4 from `packageManager` / `.yarn/releases`

---

## 🔗 Related Docs

- [📚 Installation Guide](./installation.md)
- [📚 Customizing Guide](./customizing.md)
- [🛠️ Build & Release Guide](./build-release.md)
