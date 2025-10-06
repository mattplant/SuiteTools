# 📚 SuiteTools Customizing Guide

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

This guide explains how to **customize SuiteTools** by extending or modifying code in the appropriate workspace.
It covers development setup, editor recommendations, deployment steps, and licensing guardrails.

---

## 🛠️ Development

Each workspace can be developed independently, and all are built with TypeScript:

- **Frontend** — React + Flowbite for UI components.
- **Backend** — NetSuite SDF project.
- **Shared** — Types, schemas, and helpers used by both frontend and backend.

SuiteTools provides a developer‑friendly environment designed to be easy to extend and customize, drawing on years of NetSuite development experience.

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
