# 🛠️ SuiteTools Build & Release Guide

Last updated: 2026-08-05

---

## 🎯 Purpose & Scope

This guide defines the **build and release process** for SuiteTools.
It ensures consistent, reproducible outputs and predictable delivery across all workspaces.

This guide is intended for **maintainers and advanced contributors** who are responsible for:

- Ensuring reproducible builds across workspaces
- Managing configuration and environment boundaries
- Preparing and tagging releases
- Maintaining changelogs and migration notes

For day‑to‑day development and deployment, see the [📚 Customizing Guide](./customizing.md).
For quick commands, see the [📘 Build & Release Checklist](./build-release-checklist.md).

---

## 🧱 Principles

- **Build** — Per‑workspace builds; `shared/` is consumed by both frontend and backend.
- **CI gates** — GitLab CI runs typecheck, lint, and test on merge requests and the default branch (see below). SuiteCloud deploy is **not** part of MR CI.
- **Release** — Consistent versioning; document breaking changes and migration notes.
- **Reproducibility** — Deterministic builds; the same commit always produces the same outputs.
- **Isolation** — Workspaces build independently; no hidden cross‑dependencies.
- **Automation** — Build and release steps are scriptable and CI‑ready for validation gates.

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
| `lint` | `yarn lint` | Yes | ESLint across workspaces (`--max-warnings 0`) |
| `test` | `yarn test` | Yes | Workspace Vitest (shared/frontend) + SuiteCloud Jest (backend) |

- **Image / toolchain** — `node:24-bookworm` (matches [`.node-version`](../../.node-version)); Yarn **4.9.2** via Corepack / `packageManager` and the checked-in `.yarn/releases` binary; Yarn PnP with `.yarn/cache` cached on `yarn.lock`.
- **SuiteCloud SDK license** — CI sets `npm_config_acceptsuitecloudsdklicense=true` so `@oracle/suitecloud-cli` postinstall can download the SDK JAR non-interactively (Oracle Free Use Terms and Conditions). Deploy credentials are still out of scope.
- **Merge policy** — Enable **Pipelines must succeed** under GitLab → Settings → Merge requests so red **required** jobs block merge.
- **Out of scope** — SuiteCloud `project:deploy` / file upload; keep account credentials out of MR pipelines.

Local equivalent before opening an MR:

```bash
yarn install
yarn typecheck
yarn lint
yarn test
```

Note: Yarn 4 does **not** run npm-style `pretest` / `prelint` hooks. Root `yarn test` builds `shared/` first so backend Jest can resolve `@suiteworks/suitetools-shared/*` from `shared/dist` on a clean checkout. Root `yarn lint` emits shared types first so typed ESLint rules do not see unresolved `error` types when `shared/dist` is missing.

---

## 📦 Release Process

SuiteTools uses consistent versioning and changelog documentation:

- Versioning follows [SemVer](https://semver.org/) with suite‑wide tagging.
- All workspaces share a single version tag to ensure compatibility across the suite.
- Breaking changes must document impact and migration path in `CHANGELOG.md`.
- Consumers are notified through release notes and update summaries.
- Follow the release checklist (version bump, changelog update, tag, publish).

---

## 🗒️ Stewardship Notes

- Keep this guide in sync with actual build scripts and release automation.
- Ensure changelogs are accurate and migration notes are clear before tagging a release.
- Cross‑link this guide from onboarding materials and contributor workflow docs.
- Review and update this guide during major dependency upgrades or CI/CD changes.
