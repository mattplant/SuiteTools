# SuiteTools — Backend Workspace

Last updated: 2026-08-05

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://gitlab.com/idev-systems/labs/SuiteTools/)

---

## 🎯 Purpose & Scope

This workspace contains SuiteTools’ backend logic, APIs, and data processing — the server‑side foundation for NetSuite integration, separate from frontend and shared modules.

**Out of scope:** frontend assets, shared UI modules, or client‑only utilities.

See the parent directory [README](../README.md) for more information about the SuiteTools project.

---

## 🧱 Design Principles

- **Type Safety First** — All modules are written in TypeScript.
- **Backend-Only Logic** — Avoid importing frontend modules; consume **shared** via the workspace package.
- **DX Matters** — All code should be easy to read, test, and onboard into.

---

## 📐 Structure

SuiteTools uses the standard NetSuite SuiteCloud Development Framework (SDF) layout under `src/`, with SuiteTools installed in its own folder under `FileCabinet/SuiteScripts/SuiteTools/`.

**Author TypeScript outside `src/`** so SDF stays FileCabinet/objects-only. Edit only under `TypeScripts/` — never hand-edit generated JavaScript under `src/FileCabinet/SuiteScripts/`.

```plaintext
backend/
├── TypeScripts/              # 🛠 SuiteTools TypeScript source (edit here)
│   └── SuiteTools/
├── src/                      # 📦 SDF project root
│   ├── FileCabinet/
│   │   └── SuiteScripts/
│   │       └── SuiteTools/   # Generated JS + frontend dist/ (build products)
│   ├── Objects/              # NetSuite object definitions
│   ├── deploy.xml
│   └── manifest.xml
├── build/                    # TypeScript → SuiteScript bundle scripts
├── package.json
├── project.json              # SDF project definition
├── suitecloud.config.js
├── tsconfig.json
└── README.md
```

Build compiles `TypeScripts/SuiteTools/` → `src/FileCabinet/SuiteScripts/SuiteTools/` (see [NetSuite-TypeScript-SDF](https://github.com/mattplant/NetSuite-TypeScript-SDF)).

### Unit tests (Jest + SuiteCloud stubs)

- Edit and assert against **`TypeScripts/`** only — do not treat generated FileCabinet JS as the system under test.
- Run: `yarn workspace backend run test` (builds shared first via `pretest`, then Jest).
- `N/*` modules are mocked via `@oracle/suitecloud-unit-testing` stubs; no live NetSuite account is required.
- Suite lives under `backend/__tests__/`. Jest is configured for Yarn PnP (Oracle’s default `node_modules/…` paths are rewritten).

---

## 📦 Dependencies

This workspace requires the following tools and libraries:

- **NetSuite Account** — with SDF enabled
- **Java JDK** — 17+ (21 recommended) for SuiteCloud CLI
- **NetSuite SDF CLI** — via `@oracle/suitecloud-cli` (for `suitecloud project:deploy` and `suitecloud project:validate`)
- **Yarn (Berry)** — v4.9.2 (via this repo’s `packageManager` / `.yarn/releases`)

### Development Dependencies

Installed via `package.json`:

- **TypeScript** — 5.7.x (compile backend code)
- **@hitc/netsuite-types** — 2024.2.x (NetSuite API type definitions)

---

## 🗒️ Stewardship Notes

- Update when SDF or TypeScript template versions change
- Review annually for structure drift
