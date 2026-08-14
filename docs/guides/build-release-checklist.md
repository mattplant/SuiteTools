# 📘 SuiteTools Build & Release Checklist

Last updated: 2026-08-06

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

Prereqs: **Node 24** (`.node-version`), NetSuite auth configured (`yarn run sdf-account-setup`), **JDK** available for SuiteCloud CLI, and Yarn 4 from this repo (`packageManager` / `.yarn/releases`).

Prefer `build-and-deploy` (or root `deploy:all`) over bare `deploy` so you never upload a stale build.

### Frontend (SPA only)

From the monorepo root:

```bash
yarn workspace frontend run build-and-deploy
```

- ✅ Builds **shared** first, then the SPA into `backend/.../SuiteTools/dist/`, then `suitecloud file:upload` for those assets.
- ✅ Always use `build-and-deploy` — bare `deploy` uploads without rebuilding.
- ❌ Don’t forget to reload the Suitelet — stale browser assets may mask changes.

### Backend (SuiteScript / SDF objects)

```bash
yarn workspace backend run build-and-deploy
```

- ✅ Builds **shared** first, then the SuiteScript bundles, then full SDF `project:deploy` (scripts, objects, FileCabinet).
- ✅ Prefer `build-and-deploy` — bare `deploy` uploads without rebuilding.
- ❌ SPA `dist/` is only included if you built frontend first (or use `deploy:all` below).

### Full-stack (first install / shared or cross-cutting changes)

```bash
yarn deploy:all
```

- ✅ Runs `yarn build:all`, then backend `deploy` (bare deploy is fine here — artifacts were just built).
- ✅ After FE `build`, SPA assets sit under FileCabinet `dist/`; BE `project:deploy` ships them — do **not** also run FE `build-and-deploy` in this path (redundant `file:upload`).
- ✅ Local builds only (no NetSuite): `yarn build:all`.

---

## ✅ CI Gates (Merge Requests)

GitLab CI (`.gitlab-ci.yml`) on MRs and the default branch:

```bash
yarn install --immutable   # before_script — lockfile must match
yarn typecheck             # merge-blocking — shared types + FE/BE tsc
yarn lint                  # merge-blocking — Biome check (lint + format)
yarn test                  # merge-blocking
```

- ✅ Red **typecheck** / **lint** / **test** should block merge when **Pipelines must succeed** is enabled in project settings.
- ✅ Dependency MRs: run `yarn install` locally (and `yarn dedupe --check` when touching deps) before push so immutable CI install succeeds.
- ❌ SuiteCloud deploy is not run in MR CI.
- ❌ `yarn dedupe --check` is not a CI job yet — enforce locally on dependency changes.

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
- ❌ Backend deploy without a prior frontend build on a fresh account → ✅ Use `yarn deploy:all` (or build FE then BE `build-and-deploy`)
- ❌ Using a different Yarn than this repo pins → ✅ Use Yarn 4 from `packageManager` / `.yarn/releases`
- ❌ Pushing lockfile drift → ✅ Run `yarn install` locally; CI uses `--immutable`

---

## 🔗 Related Docs

- [📚 Installation Guide](./installation.md)
- [📚 Customizing Guide](./customizing.md)
- [🛠️ Build & Release Guide](./build-release.md)
- [📦 Yarn Foundations](./yarn.md)
