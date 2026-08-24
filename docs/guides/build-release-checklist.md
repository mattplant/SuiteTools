# 📘 SuiteTools Build & Release Checklist

Last updated: 2026-08-23

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
yarn install --immutable                              # before_script — lockfile must match
yarn typecheck                                        # merge-blocking — shared types + FE/BE tsc
yarn lint                                             # merge-blocking — Biome check (lint + format)
yarn test:coverage                                    # merge-blocking — tests, plus the coverage report
yarn build:all                                        # merge-blocking — full workspace build
yarn dedupe --check                                   # merge-blocking — no duplicate resolutions
yarn npm audit --all --recursive --severity moderate  # advisory — allow_failure: true
```

Plus two GitLab scanner templates, both non-blocking: `semgrep-sast` and `secret_detection`.

- ✅ Red **typecheck** / **lint** / **test** / **build** / **dedupe** blocks merge when **Pipelines must succeed** is enabled in project settings.
- ✅ Dependency MRs: run `yarn install` and `yarn dedupe --check` locally before push, so both the immutable install and the dedupe gate succeed.
- ℹ️ **Coverage is reported, not gated** (#111). The `test` job publishes a cobertura report per workspace, so the MR diff is annotated per line, and prints one combined figure. Baseline when it landed: **16.37% of lines** (571/3488). No threshold exists yet — a low number does not red the job. Raising it is follow-on work, aimed by what the report shows.
- ⚠️ **audit** is advisory, not blocking. There is a pre-existing backlog (1 critical / 29 high / 12 moderate as of #113), all of it in dev and build tooling. A newly published CVE in a transitive dep should not red an unrelated MR — read the job, do not ignore it.
- ⚠️ On the **Free** plan the scanners publish JSON report artifacts only. The MR security widget, vulnerability report and security dashboard are all Ultimate, so findings must be read from the job log or the artifact.
- ❌ SuiteCloud deploy is not run in MR CI.
- ❌ No automated dependency updates (Renovate / Dependabot). Declined deliberately in #113: this is a small repo with a hand-ordered upgrade sequence, and bot-raised MRs would fight that order rather than help it. Revisit if the dependency surface grows.

---

## 📦 Release Steps (Maintainers)

A release is an annotated git tag plus a GitLab Release. Workspaces are private; nothing is published to npm. There is no `yarn release` script.

1. **Version** — set the root `package.json` `version` to the [SemVer](https://semver.org/) you are cutting. Do not add a product version on frontend, backend, or `shared`.
2. **Changelog** — write Why / Scope / Developer Impact in `CHANGELOG.md`; date the heading; leave `## [Unreleased]` empty. Include a migration path for every breaking change.
3. **Notices** — regenerate `THIRD_PARTY_NOTICES.md` if `yarn.lock` changed since the last run (`yarn generate-third-party-notices`).
4. **Validate** — CI green on the commit you will tag, or run `yarn typecheck && yarn lint && yarn test && yarn build:all` locally.
5. **Tag** — annotated tag `v<version>` on that commit; push the tag.
6. **GitLab Release** — create from the tag; body = that changelog entry. This is the public note.

Optional, after step 6: deploy that tagged commit to a demo NetSuite account (`yarn deploy:all`). That does not make the version real.

---

## ⚠️ Common Pitfalls

- ❌ Skipping `CHANGELOG.md` at tag time → ✅ Write Why / Scope / Impact in the release merge request
- ❌ Editing `CHANGELOG.md` on every merge request → ✅ Conventional commits are the running log; the changelog is curated when you cut
- ❌ Tagging a commit whose files still disagree on the version → ✅ Root `package.json` and the dated changelog entry must match before you tag
- ❌ Publishing without typecheck/tests/build → ✅ Rely on CI gates / run full validation before tagging
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
