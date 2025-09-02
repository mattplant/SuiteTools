# SuiteTools — Backend Workspace

_Last updated: September 1, 2025_

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

This is the **backend workspace** for the SuiteTools project.


It contains all server‑side logic, API endpoints, and data processing for SuiteTools’ NetSuite integration.

**Out of scope:** frontend assets, shared UI modules, or client‑only utilities.

## 🧱 Structure

SuiteTools uses the standard NetSuite SuiteCloud Development Framework (SDF) structure*, with SuiteTools installed in its own folder under `FileCabinet/SuiteScripts/SuiteTools/`.

```plaintext
backend/
├── src/     # Backend source code
│   ├── FileCabinet/   # 📦 SDF standard
│   │   └── SuiteScripts/
│   │       └── SuiteTools/   # 🛠 SuiteTools-specific JavaScript
│   ├── Objects/       # 📦 SDF standard — NetSuite object definitions
│   ├── TypeScript/    # 🛠 SuiteTools-specific TypeScript (compiled to JS)
│   ├── deploy.xml     # 📦 SDF standard — deployment config
│   └── manifest.xml   # 📦 SDF standard — manifest file
├── LICENSE            # GPL-3.0-or-later
├── project.json       # SDF project definition
├── package.json       # Yarn workspace definition & backend scripts
└── README.md      # This README file
```

*The only change to the SDF Structure is the addition of the `/src/TypeScript/` folder.  With leveraging my [NetSuite-TypeScript-SDF template](https://github.com/mattplant/NetSuite-TypeScript-SDF), the TypeScript files are automatically compiled to JavaScript and deployed to the `/src/FileCabinet/SuiteScripts/SuiteTools/` folder.

---

## 🎯 Design Principles

- **Type Safety First** — All modules are written in TypeScript.
- **Backend-Only Logic** — Avoid importing frontend or shared modules.
- **DX Matters** — All code should be easy to read, test, and onboard into.
