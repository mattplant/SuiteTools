# SuiteTools — Backend Workspace

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

---

## 🎯 Purpose & Scope

This workspace contains SuiteTools’ backend logic, APIs, and data processing — the server‑side foundation for NetSuite integration, separate from frontend and shared modules.

**Out of scope:** frontend assets, shared UI modules, or client‑only utilities.

See the parent directory [README](../README.md) for more information about the SuiteTools project.

---

## 🧱 Design Principles

- **Type Safety First** — All modules are written in TypeScript.
- **Backend-Only Logic** — Avoid importing frontend or shared modules.
- **DX Matters** — All code should be easy to read, test, and onboard into.

---

## 📐 Structure

SuiteTools uses the standard NetSuite SuiteCloud Development Framework (SDF) structure*, with SuiteTools installed in its own folder under `FileCabinet/SuiteScripts/SuiteTools/`.

```plaintext
backend/
├── src/     # Backend source code
│   ├── FileCabinet/  # 📦 SDF standard
│   │   └── SuiteScripts/
│   │       └── SuiteTools/  # 🛠 SuiteTools-specific JavaScript
│   ├── Objects/        # 📦 SDF standard — NetSuite object definitions
│   ├── TypeScript/
│   │   └── SuiteTools/   # 🛠 SuiteTools-specific TypeScript source
│   ├── deploy.xml        # 📦 SDF standard — deployment config
│   └── manifest.xml      # 📦 SDF standard — manifest file
├── .gitignore            # Git ignore file for frontend
├── LICENSE               # GPL-3.0-or-later
├── package.json          # Yarn workspace definition & backend scripts
├── project.json          # SDF project definition
├── suitecloud.config.js  # SDF CLI configuration
└── README.md             # This README file
```

*The main change to the standard NetSuite SDF Structure is the addition of the `/src/TypeScript/` folder.  By leveraging my [NetSuite-TypeScript-SDF template](https://github.com/mattplant/NetSuite-TypeScript-SDF), the TypeScript files are automatically compiled to JavaScript and deployed to the `/src/FileCabinet/SuiteScripts/SuiteTools/` folder.

---

## 📦 Dependencies

This workspace requires the following tools and libraries:

- **NetSuite Account** — with SDF enabled
- **NetSuite SDF CLI** — v3.0.0 (for `suitecloud project:deploy` and `suitecloud project:validate`)
- **Yarn (Berry)** — v4.9.2 (workspace and package manager)

### Development Dependencies

Installed via `package.json`:

- **TypeScript** — 5.7.x (compile backend code)
- **@hitc/netsuite-types** — 2024.2.x (NetSuite API type definitions)

---

## 🗒️ Stewardship Notes

- Update when SDF or TypeScript template versions change
- Review annually for structure drift
