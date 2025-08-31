# SuiteTools Monorepo Documentation

<!-- License badges: keep in sync with LICENSE and LICENSE-DOCS.md -->
[![Source License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPLv3+-blue.svg)](./LICENSE)
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md)
[![Attribution Guide](https://img.shields.io/badge/Attribution%20Formats-docs%2FATTRIBUTION.md-blue)](../docs/ATTRIBUTION.md)

Welcome to SuiteTools **Monorepo Documentation** containing _suite-wide_ guides and cross-cutting patterns that apply across all workspaces.

---

## Overview

SuiteTools is designed to be a reference-quality OSS project. It enforces predictable workspace boundaries, schema-driven contracts, and transparent licensing across all modules.

This documentation includes:

- [Installation Guide](installation.md) - setup and deployment to your NetSuite account
- [Architecture Overview](architecture.md) - overview of the SuiteTools architecture, including design principles and patterns
- [Customizing Guide](customizing.md) - guide to developing and deploying SuiteTools customizations
- [Linting](./linting.md) - tooling overview, config composition, and enforcement strategy
- [Error Handling & Reporting Guide](error.md) - patterns and utilities for consistent error handling and reporting
- [VS Code](vscode.md) - editor setup and recommended tasks
- [Yarn Configuration](yarn.md) - suite‑wide package management, Plug’n’Play, and workspace boundaries
- [Attribution Guide](ATTRIBUTION.md) - reusable attribution formats for documentation and visuals
- [Governance](governance.md) - principles, contribution status, and workspace boundaries

---

## Other Documentation

For an overview of the SuiteTools project, see the [README](../README.md).

For workspace-specific documentation, see the individual workspace directories:

- [Frontend](../frontend/README.md)
- [Backend](../backend/README.md)
- [Shared](../shared/README.md)

---

## Governance

> **Governance Philosophy**
> SuiteTools governance is built on empathy, reproducibility, and architectural clarity.
> Decisions are made upstream-first, documented with context, and designed to empower future contributors—not just protect the present.

SuiteTools is actively maintained by its core steward. External contributions are not accepted at this time, but the project is built with future contributors in mind. For details, see the [Governance document](governance.md).

---

## Licensing Model

| Component      | License                          | Purpose                                        |
|----------------|----------------------------------|------------------------------------------------|
| Source Code    | [GPL-3.0-or-later](../LICENSE)   | Ensures strong copyleft protections            |
| Documentation  | [CC BY 4.0](../LICENSE-DOCS.md)  | Encourages reuse and remixing with attribution |

Please preserve SPDX headers and NOTICE references when referencing SuiteTools in your own work.

_Last updated: August 30, 2025_
