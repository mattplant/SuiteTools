# 💻 VS Code Setup Guide

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

---

## 🎯 Purpose & Scope

This guide explains how to configure **Visual Studio Code** for SuiteTools development.
It ensures contributors have a consistent, productive environment with TypeScript and SuiteCloud Development Framework (SDF) support.

---

## 📋 Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) installed
- [SuiteCloud Extension for VS Code](https://marketplace.visualstudio.com/items?itemName=Oracle.suitecloud-vscode-extension)

---

## ⚙️ Workspace Settings

SuiteTools includes a `.vscode` folder with recommended settings:

- Automatically builds backend code on save
- Provides NPM script integration for build and deploy tasks

### Use Workspace TypeScript Version

1. Open any `.ts` or `.tsx` file
2. Open the Command Palette (`Cmd+Shift+P` on macOS, `Ctrl+Shift+P` on Windows/Linux)
3. Search for **“TypeScript: Select TypeScript Version...”**
4. Select **“Use Workspace Version”**

---

## 🚀 Running Commands

Instead of running commands manually in the terminal, you can use the **NPM Scripts** panel in VS Code:

- Open the Explorer sidebar
- Expand **NPM Scripts**
- Click the ▶️ play icon next to `build-and-deploy`

> 🔗 For full deploy instructions, see the [Customizing Guide](../customizing.md#-deploying-changes).

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
