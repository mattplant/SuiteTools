# 📚 SuiteTools Customizing Guide

Last updated: 2026-08-05

---

## 🎯 Purpose & Scope

This guide explains how to **customize SuiteTools** by extending or modifying code in the appropriate workspace.
It covers development setup, editor recommendations, deployment steps, and licensing guardrails.

---

## 🛠️ Development

Each workspace can be developed independently, and all are built with TypeScript:

- **Frontend** — React + Flowbite for UI components (`frontend/src/`).
- **Backend** — NetSuite SDF project. Edit SuiteScript TypeScript under `backend/TypeScripts/` (not generated JS under `backend/src/FileCabinet/`). Unit-test those sources with `yarn workspace backend run test` (Jest + `N/*` stubs); do not assert on FileCabinet bundles.
- **Shared** — Types, schemas, and helpers used by both frontend and backend (`shared/src/`).

SuiteTools provides a developer‑friendly environment designed to be easy to extend and customize, drawing on years of NetSuite development experience.

First-time install and prereqs (Node, Yarn 4, Java JDK for SuiteCloud): see the [📚 Installation Guide](./installation.md).

---

## 💻 Editor Setup

We recommend using **Visual Studio Code** as your editor.
For additional details, see the [VS Code](vscode.md) documentation.

---

## 🚀 Deploying Changes

When you make changes, you’ll need to deploy them to NetSuite.

See the [🚀 Deploy Commands](./build-release-checklist.md#-deploy-commands-contributors) section of the Build & Release Checklist for the exact commands and guardrails.

> 🔗 For suite‑wide versioning and release process, see the [📦 Release Steps](./build-release-checklist.md#-release-steps-maintainers) or the [🛠️ Build & Release Guide](./build-release.md).

---

## 🏷️ License Compliance

> See [🏷️ License Compliance](../governance/license-compliance.md) for licensing model, attribution expectations, and contributor responsibilities for license compliance.

---

## Conclusion

By following this guide, you can confidently extend SuiteTools while keeping builds reproducible, compliant, and aligned with suite‑wide standards.
