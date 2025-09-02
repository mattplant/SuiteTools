# 📘 SuiteTools Monorepo Documentation

_Last updated: September 1, 2025_

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](./../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

Welcome to the SuiteTools **Monorepo Documentation**—a living system of suite-wide knowledge, reproducible design principles, and cross-cutting patterns built to support every workspace with clarity and intent.

This documentation is not an accessory to the codebase—it’s a foundational layer of SuiteTools: architecture in prose, stewarded for discoverability, transparency, and long-term maintainability.

Modular by design, this living system spans setup, governance, attribution, and workspace-specific implementation. Whether onboarding, developing within a workspace, or refining system design, clarity is embedded in every page.

For a high-level overview of SuiteTools’ philosophy and modular architecture, see the [Project README](../README.md).

In addition to suite-wide guides, each workspace maintains its own documentation—focused on implementation details, customization patterns, and architectural responsibilities within the suite.

---

## Suite-Wide Documentation

The following suite-wide guides form the backbone of SuiteTools—supporting reproducibility, onboarding, and architectural clarity across all workspaces.

### 📜 Governance & Licensing

- [Attribution Guide](../ATTRIBUTION.md) – Reusable attribution formats for documentation and visuals
- [Code of Conduct](../CODE_OF_CONDUCT.md) – Community standards and expectations
- [Contributing Guide](../CONTRIBUTING.md) – How to propose changes and contribute
- [Governance](./governance/GOVERNANCE.md) – Principles, stewardship model, and workspace boundaries
- [Source Code License](../LICENSE) – GPL‑3.0‑or‑later
- [Documentation License](../LICENSE-DOCS.md) – CC BY 4.0
- [Notice](../NOTICE) – Third‑party code and attribution obligations
- [Security Policy](../SECURITY.md) – Security policy and reporting guidelines
- [Style Guide](../STYLE.md) – Suite‑wide style guide (prose + code)

### 🏛 Architecture

- [Architecture Overview](./architecture/architecture.md) – A Documentation-Led Guide to Clarity
- [SuiteTools Documentation as Architecture](./architecture/docs-architecture.md) Living Standards for Structure, Style, and Stewardship
- [Error Handling](./architecture/error-handling.md) – A Unified Lifecycle for Predictable, Discoverable, and Safe Error Management

### 📚 Guides

- [Installation Guide](./guides/installation.md) – Setup and deployment to your NetSuite account
- [Customizing Guide](./guides/customizing.md) – Developing and deploying SuiteTools-aligned customizations
- [Linting](./guides/linting.md) – Tooling overview, config composition, and enforcement strategy
- [VS Code](./guides/vscode.md) – Editor setup and recommended tasks
- [Yarn Configuration](./guides/yarn.md) – Suite-wide package management and workspace boundaries

---

## Other Documentation

### Project Overview

For a suite-wide introduction to SuiteTools—its philosophy, modular architecture, and onboarding standards—see the [Project README](../README.md).
It provides a high-level overview of the system’s structure, licensing model, and developer-facing documentation practices.

### Workspace Documentation

Each workspace maintains its own documentation, focused on implementation details, customization patterns, and architectural responsibilities within the suite:

- [Frontend](../frontend/README.md)
- [Backend](../backend/README.md)
- [Shared](../shared/README.md)

These documents complement the suite-wide system by surfacing workspace-specific logic, constraints, and integration points—helping developers understand how each part contributes to the whole.

---

## Governance

> **Governance Philosophy**
> SuiteTools governance is built on empathy, reproducibility, and architectural clarity.
> Decisions are made upstream-first, documented with context, and designed to empower future contributors—not just protect the present.

SuiteTools is actively maintained by its core steward. While external contributions are currently paused, the system is architected for future contributors—designed to be discoverable, reproducible, and welcoming by default.

For stewardship principles, contribution boundaries, and governance structure, see the [Governance document](../GOVERNANCE.md).

---

## Licensing Model

### License Structure

**SuiteTools separates source and documentation licensing to balance copyleft protections with remixable, attribution-friendly docs.**

| Component      | License                          | Purpose                                        |
|----------------|----------------------------------|------------------------------------------------|
| Source Code    | [GPL-3.0-or-later](../LICENSE)   | Ensures strong copyleft protections            |
| Documentation  | [CC BY 4.0](../LICENSE-DOCS.md)  | Encourages reuse and remixing with attribution |

Please preserve SPDX headers and NOTICE references when referencing SuiteTools in your own work.

### Attribution Badges

Badge clusters are used throughout SuiteTools to signal licensing, attribution, and compliance status—reinforcing visual discoverability and suite-wide stewardship.

Each badge is a compact signal of reuse boundaries, contributor intent, and documentation integrity.

For formats, usage patterns, and integration guidance, see the [Attribution Guide](../ATTRIBUTION.md).
