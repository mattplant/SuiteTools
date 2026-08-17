# 🛠️ SuiteTools Build & Release Guide

Last updated: 2026-08-17

---

## 🎯 Purpose & Scope

This guide defines the **build and release process** for SuiteTools.
It ensures consistent, reproducible outputs and predictable delivery across all workspaces.

This guide is intended for **maintainers and advanced contributors** who are responsible for:

- Ensuring reproducible builds across workspaces
- Managing configuration and environment boundaries
- Preparing and tagging releases
- Writing the release changelog and migration notes

For day‑to‑day development and deployment, see the [📚 Customizing Guide](./customizing.md).
For quick commands, see the [📘 Build & Release Checklist](./build-release-checklist.md).

---

## 🧱 Principles

- **Build** — Per‑workspace builds; `shared/` is consumed by both frontend and backend.
- **CI gates** — GitLab CI runs typecheck, lint, test, and build on merge requests and the default branch (see below). SuiteCloud deploy is **not** part of MR CI.
- **Release** — One suite version; a dated changelog; an annotated git tag and a GitLab Release.
- **Reproducibility** — Deterministic builds; the same commit always produces the same outputs.
- **Isolation** — Workspaces build independently; no hidden cross‑dependencies.
- **Automation** — Validation is scriptable and CI‑ready. Do not add a release script until this checklist has been run for real.

---

## ⚙️ Configuration & Environment

- Read environment variables **only at boundaries** (backend startup or handler level).
  - These are NetSuite‑specific, not standard Node.js environment variables.
- Centralize configuration parsing in `backend/config`, validated with schemas.
- Pass typed config explicitly to dependent modules.

---

## 🛠️ Build Process

- Each workspace builds independently via configured package scripts.
- `shared/` outputs are consumed by both frontend and backend — ensure schema and helper compatibility.
- Use TypeScript path maps to enforce workspace boundaries and avoid accidental cross‑references.
- Downstream consumers (e.g., frontend) must **never** mutate `shared/` types or helpers.

---

## ✅ CI Pipeline (GitLab)

Defined in [`.gitlab-ci.yml`](../../.gitlab-ci.yml). Runs on **merge request** events and pushes to the **default branch**.

| Job | Command | Merge-blocking? | Notes |
| --- | --- | --- | --- |
| `typecheck` | `yarn typecheck` | Yes | Shared types emit, then frontend + backend `tsc --noEmit` |
| `lint` | `yarn lint` | Yes | Biome check (lint + format) across all workspaces |
| `test` | `yarn test` | Yes | Workspace Vitest (shared/frontend) + SuiteCloud Jest (backend) |
| `build` | `yarn build:all` | Yes | Full workspace build; Yarn does not run npm-style `prebuild` hooks |

- **Image / toolchain** — `node:24-bookworm` (matches [`.node-version`](../../.node-version)); Yarn **4.18.0** via Corepack / `packageManager` and the checked-in `.yarn/releases` binary; the `node-modules` linker, with `.yarn/cache` cached on `yarn.lock`.
- **SuiteCloud SDK license** — CI sets `npm_config_acceptsuitecloudsdklicense=true` so `@oracle/suitecloud-cli` postinstall can download the SDK JAR non-interactively (Oracle Free Use Terms and Conditions). Deploy credentials are still out of scope.
- **Merge policy** — Enable **Pipelines must succeed** under GitLab → Settings → Merge requests so red **required** jobs block merge.
- **Out of scope** — SuiteCloud `project:deploy` / file upload; keep account credentials out of MR pipelines. Tag-triggered release jobs are not used.

Local equivalent before opening an MR:

```bash
yarn install
yarn typecheck
yarn lint
yarn test
yarn build:all
```

Note: Yarn 4 does **not** run npm-style `pretest` / `prelint` / `prebuild` hooks. Root `yarn test` builds `shared/` first so backend Jest can resolve `@suiteworks/suitetools-shared/*` from `shared/dist` on a clean checkout. Root `yarn lint` no longer needs to emit shared types first: Biome does not use type information, so it has no equivalent of ESLint's typed rules.

---

## 📦 Release Process

SuiteTools is a private Yarn monorepo that ships as an SDF project. It is not published to npm.

- **Version** — [SemVer](https://semver.org/). The suite version lives only in the root `package.json`. Frontend, backend, and `shared` are private workspaces and do not carry a product version. One git tag (`v<version>`) covers the suite.
- **Changelog** — Written at release time. Each dated entry includes Why, Scope, and Developer Impact. Breaking changes must include impact and a migration path. Day-to-day merge requests do not edit `CHANGELOG.md`.
- **Validate** — CI green on the commit you will tag (typecheck, lint, test, build).
- **Publish** — An annotated git tag `v<version>` on that commit, plus a GitLab Release whose body is that changelog entry. That Release is the notification. There is no `yarn release` script.
- **Optional** — Deploy that tagged commit to a demo NetSuite account. This is not what makes the version real.

Follow the [Build & Release Checklist](./build-release-checklist.md) for the exact steps.

---

## 🗒️ Stewardship Notes

- Keep this guide in sync with actual build scripts and CI jobs.
- Ensure changelogs are accurate and migration notes are clear before tagging a release.
- Do not add a `yarn release` wrapper until this checklist has been used for a real cut.
- Cross‑link this guide from onboarding materials and contributor workflow docs.
- Review and update this guide during major dependency upgrades or CI/CD changes.
