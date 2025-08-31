# SuiteTools

<!-- License badges: keep in sync with LICENSE and LICENSE-DOCS.md -->
[![Source License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPLv3+-blue.svg)](./LICENSE)
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md)
[![Attribution Guide](https://img.shields.io/badge/Attribution%20Formats-docs%2FATTRIBUTION.md-blue)](../docs/ATTRIBUTION.md)

This is the **backend workspace** for the SuiteTools project.

The backend workspace provides the server-side logic, API endpoints, and data processing capabilities for SuiteTools to connect to NetSuite.

---

## 🧱 Structure

SuiteTools uses the standard NetSuite SuiteCloud Development Framework (SDF) structure*, with SuiteTools installed in its own folder under `FileCabinet/SuiteScripts/SuiteTools/`.

```plaintext
backend/
├── src/     # Backend Source code
│   ├── FileCabinet/
│   │   └── SuiteScripts/
│   │       └── SuiteTools/   # SuiteTools' SuiteScripts (JavaScript)
│   ├── Objects/       # SuiteTools' NetSuite object definitions
│   ├── TypeScript/    # SuiteTools' SuiteScripts (TypeScript)
│   ├── deploy.xml     # SDF deployment configuration
│   └── manifest.xml   # SDF manifest file
├── LICENSE        # The GPL-3.0-or-later license file
├── project.json   # SDF project definition
├── package.json   # Yarn workspace definition & backend scripts
└── README.md      # This README file
```

*The only change to the SDF Structure is the addition of the `/src/TypeScript/` folder.  With leveraging my [NetSuite-TypeScript-SDF template](https://github.com/mattplant/NetSuite-TypeScript-SDF), the TypeScript files are automatically compiled to JavaScript and deployed to the `/src/FileCabinet/SuiteScripts/SuiteTools/` folder.

---

## Design Principles

- **Type Safety First** — All modules are written in TypeScript.
- **Backend-Only Logic** — Avoid importing frontend or shared modules.
- **DX Matters** — All code should be easy to read, test, and onboard into.

> 📚 This workspace is part of the SuiteTools monorepo.
> Licensing and contributor guidelines are defined at the [root README](../README.md).
> Documentation is covered by [CC BY 4.0](../LICENSE-DOCS.md); source code by [GPL-3.0-or-later](../LICENSE).

_Last updated: August 30, 2025_
