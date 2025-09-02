# SuiteTools Governance

> This document is part of the SuiteTools governance set.
> See `/docs/governance` for related policies and resources.

_Last updated: September 1, 2025_

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

<!-- TODO: improve flow in this section -->

This document serves as SuiteTools’ governance blueprint—clarifying stewardship principles, architectural structure, and reproducibility standards across the monorepo.

SuiteTools is a modular TypeScript monorepo designed for long-term clarity, reproducibility, and developer empowerment. This document outlines governance principles for the entire monorepo, including licensing boundaries, workspace structure, and current contribution status.

> **Governance Philosophy**
> SuiteTools governance is built on empathy, reproducibility, and architectural clarity.
> Decisions are made upstream-first, documented with context, and designed to empower future developers—not just protect the present.

---

## 🚫 Contribution Status

> SuiteTools is actively being developed by its core maintainer.
> **External contributions are not being accepted at this time**.

However, the project is being built with future developers in mind—prioritizing onboarding clarity, licensing transparency, and architectural consistency.

Feel free to explore the codebase and documentation.

### Licensing Clarity and Attribution

SuiteTools applies a consistent dual-license model across the entire monorepo to balance strong copyleft protections with open documentation reuse:

| Component      | License                          | Purpose                                        |
|----------------|----------------------------------|------------------------------------------------|
| Source Code    | [GPL-3.0-or-later](LICENSE)   | Ensures strong copyleft protections            |
| Documentation  | [CC BY 4.0](LICENSE-DOCS.md)  | Encourages reuse and remixing with attribution |

If you're referencing SuiteTools in your own work—whether code, documentation, or architectural patterns—please follow the attribution guidelines in [ATTRIBUTION.md](ATTRIBUTION.md) and preserve SPDX headers and NOTICE references where applicable.

---

## Governance Principles

SuiteTools is stewarded with a long-term vision: to be a reference-quality OSS monorepo that empowers developers through:

- **Documentation-led architecture** that anticipates developer needs
- **Predictable workspace boundaries** and schema-driven contracts
- **Transparent licensing** that balances openness with protection
- **Upstream-first fixes** that reduce downstream complexity

Governance decisions apply across the monorepo and prioritize clarity, maintainability, and developer empathy. Architectural changes, licensing refinements, and onboarding flows are documented with reproducibility in mind—through changelogs, README updates, and curated notes where appropriate.

---

## Decision-Making Process

SuiteTools is maintained by its core maintainer, who documents architectural decisions, licensing refinements, and onboarding flows with clarity and context in mind. While not all notes are versioned, key changes that affect developer experience—such as workspace structure, linting rules, or licensing boundaries—are:

- Reflected in root and workspace-level `README.md` files
- Reinforced through lint rules and reusable snippets
- Logged in changelogs or architectural summaries when appropriate

The goal is to make onboarding **predictable, contextual, and reproducible** — so future developers understand not just what to do, but why it’s done that way. Notes are curated for clarity, not volume, and evolve alongside the monorepo’s architecture.

---

## Version History and Changelog

SuiteTools maintains a centralized changelog (`CHANGELOG.md`) to document versioned updates across the monorepo. This includes:

- Licensing refinements and attribution system changes
- Architectural decisions affecting workspace boundaries or shared contracts
- Onboarding improvements, lint rules, and developer-facing utilities
- Error-handling conventions and runtime patterns

Changelog entries are scoped by release and include developer impact summaries to reinforce SuiteTools’ commitment to clarity, reproducibility, and long-term stewardship.

> For the latest updates, see [`CHANGELOG.md`](CHANGELOG.md).

---

## Workspace Boundaries

SuiteTools enforces strict workspace separation to maintain modularity, predictability, and developer clarity. Each workspace is designed to be self-contained, with clearly defined responsibilities and minimal coupling.

### Structure and Separation

- **Self-contained Workspaces**: Every workspace includes its own `README`, SPDX license headers, and licensing snippets to clarify scope and reuse boundaries.
- **Shared Contracts**: Common types, validation schemas, and utilities live in the `shared/` workspace and are versioned for reproducibility.
- **Explicit Cross-Cutting Logic**: Cross-workspace dependencies are discouraged unless explicitly justified and documented. When necessary, they must be surfaced in architectural notes and linted for clarity.

### Attribution and Compliance

- **Local Enforcement**: Attribution and license compliance are enforced at the workspace level via lint rules, reusable README snippets, and `NOTICE` files.
- **SPDX and NOTICE**: All source files include SPDX identifiers, and each workspace maintains its own `NOTICE` file to document third-party code and attribution obligations.

---

## Questions or Feedback

SuiteTools welcomes thoughtful engagement. If you’re exploring the project, referencing its documentation, or curious about its governance model, feel free to open an issue.
