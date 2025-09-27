# 📘 SuiteTools Monorepo Documentation

> Part of the SuiteTools governance set.
> See `/docs/governance` for related policies and resources.

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](./../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

---

## 🎯 Purpose & Scope

This README is the **entry point** to SuiteTools documentation.
It orients contributors, maintainers, and future developers to the suite‑wide documentation system and how to navigate it.

> **This documentation is not an accessory to the codebase—it’s a foundational layer of SuiteTools: architecture in prose, stewarded for discoverability, transparency, and long‑term maintainability.**

---

## 📖 About This Documentation

SuiteTools documentation is **modular by design**. It spans:

- **Governance** — enforceable standards, licensing, and stewardship practices
- **Architecture** — cross‑cutting patterns, boundaries, and documentation standards
- **Developer Guides** — practical, task‑oriented instructions for setup, customization, and release
- **Workspace Docs** — frontend, backend, and shared module responsibilities

For SuiteTools’ philosophy and modular architecture, see the [Project README](../README.md).
For workspace‑specific details, see the [Frontend](../frontend/README.md), [Backend](../backend/README.md), and [Shared](../shared/README.md).

---

## 🗂️ Documentation Map

| Layer            | Purpose                                | Key Docs |
|------------------|----------------------------------------|----------|
| **Governance**   | Enforceable standards & policies       | [Governance Index](./governance/README.md), [Attribution](../ATTRIBUTION.md), [Emoji Usage](./governance/emoji.md), [Badge Clusters](./governance/standards/badge-clusters.md) |
| **Architecture** | Philosophy & cross‑cutting rules       | [Documentation as Architecture](./architecture/docs-architecture.md), [Error Handling](./architecture/error-handling-architecture.md), [Validation & Type Safety](./architecture/validation.md), [Monorepo & Workspace Boundaries](./architecture/monorepo-and-workspace-boundaries.md) |
| **Developer Guides** | Practical, task‑oriented setup & workflows | [Installation](./guides/installation.md), [Customizing](./guides/customizing.md), [Build & Release](./guides/build-release.md), [Linting](./guides/linting.md), [VS Code](./guides/vscode.md), [Yarn](./guides/yarn.md), [Yarn Workflows](./guides/yarn-workflows.md) |
| **Workspaces**   | Implementation details                 | [Frontend](../frontend/README.md), [Backend](../backend/README.md), [Shared](../shared/README.md) |
| **Reference**    | Legal & versioning anchors             | [LICENSE](../LICENSE), [LICENSE-DOCS](../LICENSE-DOCS.md), [License Compliance](./governance/license-compliance.md), [CHANGELOG](../CHANGELOG.md) |

---

## 📚 Suite‑Wide Documentation

These guides form the backbone of SuiteTools documentation.
They provide suite‑wide standards, reproducible patterns, and onboarding clarity across all workspaces.

### 📜 Governance

Enforceable standards, licensing, and stewardship practices.

| Artifact | Purpose | Scope |
|----------|---------|-------|
| [Attribution Guide](../ATTRIBUTION.md) | Reusable attribution formats for documentation and visuals | Legal |
| [Code of Conduct](../CODE_OF_CONDUCT.md) | Community standards and expectations | Community |
| [Governance](./governance/GOVERNANCE.md) | Principles, stewardship roles, and decision‑making process | Project‑wide |
| [Source Code License](../LICENSE) | License terms for SuiteTools source code | Legal |
| [Documentation License](../LICENSE-DOCS.md) | License terms for SuiteTools documentation | Legal |
| [NOTICE](../NOTICE) | Required legal notices and attributions | Legal |
| [License Compliance](./governance/license-compliance.md) | Licensing model, attribution rules, and contributor responsibilities | Legal |
| [Security Policy](../SECURITY.md) | Security policy and reporting guidelines. | Security |
| [Style Guide](./governance/STYLE.md) | Suite‑wide style guide (prose + code) | Micro‑level |

See the [Governance Index](./governance/README.md) for the full set.

#### 📂 Governance Standards

Enforceable governance standards — including naming conventions, licensing headers, and compliance requirements — are maintained in the **[Standards Index](./governance/standards/README.md)**.

### 📐 Architecture

Cross‑cutting patterns, boundaries, and documentation standards.

<!-- “why + rules” layer -->
- [Architecture Overview](./architecture/architecture.md) – Documentation‑led guide to clarity
- [Documentation as Architecture](./architecture/docs-architecture.md) – Living standards for structure, style, and stewardship
- [Error Handling](./architecture/error-handling-architecture.md) – Unified lifecycle for predictable and safe error management
- [Monorepo & Workspace Boundaries](./architecture/monorepo-and-workspace-boundaries.md) – Structure, benefits, and enforcement rules
- [Validation & Type Safety](./architecture/validation.md) – Suite‑wide schema and type strategy

### 🧑‍💻 Developer Guides

Practical, task‑oriented instructions for contributors.

<!-- “how + steps” layer -->
- **Setup**: [Installation](./guides/installation.md), [VS Code](./guides/vscode.md), [Yarn](./guides/yarn.md), [Yarn Workflows](./guides/yarn-workflows.md)
- **Development**: [Customizing](./guides/customizing.md), [Linting](./guides/linting.md)
- **Release**: [Build & Release](./guides/build-release.md)

---

## 📖 Other Documentation

### Project Overview

For a suite‑wide introduction to SuiteTools—its philosophy, modular architecture, and onboarding standards—see the [Project README](../README.md).
It provides a high-level overview of the system’s structure, licensing model, and developer-facing documentation practices.

### Reference Documents

Root‑level files that provide legal and versioning anchors:

- [LICENSE](../LICENSE) – Source code license (GPL‑3.0‑or‑later)
- [LICENSE‑DOCS](../LICENSE-DOCS.md) – Documentation license (CC BY 4.0)
- [CHANGELOG.md](../CHANGELOG.md) – Versioned updates across the monorepo

### Workspace Documentation

Each workspace maintains its own documentation, focused on implementation details, customization patterns, and architectural responsibilities:

- [Frontend](../frontend/README.md) – UI components and client‑side logic
- [Backend](../backend/README.md) – NetSuite SDF project and server‑side logic
- [Shared](../shared/README.md) – Types, schemas, and utilities shared across workspaces

These complement the suite‑wide system by surfacing workspace‑specific logic, constraints, and integration points.
