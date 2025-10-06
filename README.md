# SuiteTools README

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

---

## 🎯 Purpose

Welcome to **SuiteTools** — *the missing NetSuite tools*.
This monorepo delivers a cohesive suite of NetSuite admin utilities that fill gaps in the native UI, providing faster workflows, richer insights, and an intuitive experience.

It fills in the blind spots with high-value tools that minimize friction including:

- **Script Logs** — Unified execution logs with advanced filtering and export options
- **Concurrency Dashboard** — Precise concurrency metrics with full details (no paging, no coarse buckets)
- **Integration Manager** — Monitor external integrations with an organized, user‑friendly interface

---

## 📐 Architecture

SuiteTools is structured as a modular monorepo with isolated workspaces and shared governance:

- **Frontend** — React + TypeScript SPA powered by Vite and Flowbite‑React
- **Backend** — SuiteScript modules and SDF deployment scripts
- **Shared** — Centralized types, validation schemas, and utilities

This design delivers:

- Unified developer environment with consistent linting, formatting, and build tooling
- Single source of truth for data shapes and validation
- Modular, composable feature development for rapid scaling

> 📘 For detailed design information, see [SuiteTools Architecture Overview](./docs/architecture/architecture.md).

### Directory Structure

Core monorepo layout:

```plaintext
SuiteTools monorepo
├── .vscode/           # VS Code workspace settings
│   ├── extensions.json   # recommended extensions
│   ├── settings.json     # workspace settings
│   └── tasks.json        # workspace tasks
├── .yarn/             # Yarn 3+ configuration, plugins, and cache
├── backend/           # NetSuite SDF project: SuiteScript backend code, deployment scripts, and SDF configs
├── docs/              # Documentation: overarching guides and cross-cutting documentation
├── frontend/          # React SPA: UI components, feature modules, data fetching hooks, and build setup
├── scripts/           # Monorepo scripts: cross-workspace automation scripts and utilities
├── shared/            #  Types & utilities: shared TypeScript types, validation schemas, and utilities
├── ATTRIBUTION.md     # Third-party code and asset attributions
├── CHANGELOG.md       # Monorepo changelog following Keep a Changelog principles
├── CODE_OF_CONDUCT.md # Contributor Code of Conduct
├── CONTRIBUTING.md    # Contributor guidelines and workflows
├── GOVERNANCE.md      # Governance overview and principles
├── LICENSE            # The GPL-3.0-or-later license file
├── LICENSE-DOCS.md    # The CC BY 4.0 license file for documentation
├── NOTICE             # Notices for third-party code and attributions
├── package.json       # Yarn workspace definition & top-level scripts
├── README.md          # This README file
├── SECURITY.md        # Security policy and vulnerability reporting guidelines
├── STYLE.md           # Coding and documentation style guide
└── THIRD_PARTY_NOTICES.md # Third-party code and asset notices
```

#### ⚙️ `backend/`

- Leverages my [NetSuite-TypeScript-SDF template](https://github.com/mattplant/NetSuite-TypeScript-SDF)
- Contains all backend logic, SuiteScript modules, and deployment scripts for NetSuite
- For additional information, see the [backend README](./backend/README.md)

#### 💻 `frontend/`

- Implements a single‑page application with React, TypeScript, Flowbite‑React components, and Zod schemas
- Organizes components in a hybrid structure:
  - `components/shared/` for UI primitives and inline feedback components
  - `components/features/` for feature‑specific composites and data hooks
  - `layout/` for top‑level layouts (AppLayout, Header)
- Includes build scripts and optimized bundling via Vite
- For additional information, see the [frontend README](./frontend/README.md)

#### 📦 `shared/`

- Houses cross‑workspace TypeScript types, Zod validation schemas, and utility functions
- Enables DRY principles by centralizing logic used by both frontend and backend
- For additional information, see the [shared README](./shared/README.md)

---

## 🚀 Getting Started

### Installation

For detailed instructions on installing SuiteTools, see the [Installation Guide](./docs/guides/installation.md).

### Customization

For detailed instructions on customizing SuiteTools, see the [Customizing Guide](./docs/guides/customizing.md).

---

## 📚 Documentation Ecosystem

SuiteTools documentation is modular and governed by architectural standards:

- [Documentation Overview](./docs/README.md)
- [Architecture Philosophy](./docs/architecture/docs-architecture.md)
- [Governance Index](./docs/governance/README.md)

---

## 🏷️ Licensing & Attribution

SuiteTools applies a dual‑license model to balance strong copyleft protections with open documentation reuse:

| Component      | License                       |
|----------------|-------------------------------|
| Source Code    | [GPL‑3.0‑or‑later](LICENSE)   |
| Documentation  | [CC BY 4.0](LICENSE-DOCS.md)  |

All files include SPDX license identifiers for machine‑readable clarity.
See [NOTICE](NOTICE) for required third‑party attributions.

> 📘 For additional details, see [License Compliance & Attribution](./docs/governance/license-compliance.md).

---

## 🗒️ Stewardship Notes

This README is part of the **living documentation ecosystem**.
It should be updated whenever SuiteTools’ structure, governance, or onboarding practices evolve.

> 💡 **Principle:** Documentation about the project is as important as the project itself.
> Keeping this file current ensures contributors always have a reliable entry point.

> 🔗 **Practice:** Revise this README in the same pull request as related architectural or governance changes, and cross‑link to updated standards or guides.
> For the full set of enforceable standards, see the [Governance Index](./docs/governance/README.md).
