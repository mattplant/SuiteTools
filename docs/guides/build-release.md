# 🛠️ SuiteTools Build & Release Guide

Last updated: September 22, 2025

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
<!-- - **CI gates** — Typecheck, lint, test, build; optionally boundary checks. -->
- **Release** — Consistent versioning; document breaking changes and migration notes.
- **Reproducibility** — Deterministic builds; the same commit always produces the same outputs.
- **Isolation** — Workspaces build independently; no hidden cross‑dependencies.
- **Automation** — Build and release steps are fully scriptable. <!-- and CI‑ready.-->

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
