# 💻 VS Code Setup Guide

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://gitlab.com/idev-systems/labs/SuiteTools/)

---

## 🎯 Purpose & Scope

This guide explains how to configure **Visual Studio Code** for SuiteTools development.
It ensures contributors have a consistent, productive environment with TypeScript and SuiteCloud Development Framework (SDF) support.

---

## 📋 Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) installed
- [SuiteCloud Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Oracle.suitecloud-vscode-extension)
- [Biome Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) — the single linter and formatter for this repo

Both are listed in `.vscode/extensions.json`, so VS Code offers to install them when you first open the workspace.

---

## ⚙️ Workspace Settings

SuiteTools includes a `.vscode` folder with recommended settings:

- Automatically builds backend code on save
- Provides NPM script integration for build and deploy tasks
- Formats and applies safe lint fixes on save via Biome

### Workspace TypeScript Version

`.vscode/settings.json` points `typescript.tsdk` at `node_modules/typescript/lib`, so the compiler VS Code
uses is the one this repo pins — no SDK generation and nothing to run after `yarn install`.

VS Code still asks before switching away from its own bundled TypeScript. Accept the **"Use Workspace
Version"** prompt the first time you open a `.ts` or `.tsx` file. If you dismissed it, run
**"TypeScript: Select TypeScript Version…"** from the Command Palette and pick **Use Workspace Version**.

Declining leaves you on VS Code's bundled TypeScript, which is a different version from the repo's — the
editor will disagree with `yarn typecheck` and CI.

---

## 🚀 Running Commands

Instead of running commands manually in the terminal, you can use the **NPM Scripts** panel in VS Code:

- Open the Explorer sidebar
- Expand **NPM Scripts**
- Click the ▶️ play icon next to `build-and-deploy`

> 🔗 For full deploy instructions, see the [Customizing Guide](./customizing.md#-deploying-changes).

---

## 📋 Next Steps

- Verify your editor is using the **workspace TypeScript version**.
- Use the **NPM Scripts panel** for build and deploy tasks instead of manual commands.
- Explore the [📏 Linting Guide](./linting.md) to ensure your environment enforces SuiteTools’ coding standards.

By following this setup, you’ll have a consistent, reproducible development environment aligned with SuiteTools’ suite‑wide practices.

---

## 🧭 Stewardship Note

This guide is part of the SuiteTools developer setup.
Update it whenever `.vscode` settings or recommended extensions change, and cross‑link to related guides to keep onboarding smooth.
