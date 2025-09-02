# Change Log

> This document is part of the SuiteTools governance set.
> See `/docs/governance` for related policies and resources.

_Last updated: September 1, 2025_

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

## [1.0.0-beta.1] - Unreleased

**Why:** Establishes and aligns SuiteTools’ governance, licensing, and documentation architecture into a reproducible, discoverable system — reinforcing transparent stewardship, predictable onboarding, and developer empowerment.
**Scope:** Foundational governance and documentation framework for the 1.0.0‑beta series.

### 🆕 Added

- [`LICENSE-DOCS.md`](LICENSE-DOCS.md): Introduces the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license for documentation reuse, including scope for onboarding guides, diagrams, and taxonomy references
- Governance docs: [`ATTRIBUTION.md`](ATTRIBUTION.md), [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md), [`GOVERNANCE.md`](GOVERNANCE.md), [`NOTICE`](NOTICE), [`SECURITY.md`](SECURITY.md), [`STYLE.md`](STYLE.md) — formalizing suite‑wide principles, security reporting, style conventions, and attribution formats
- [`CHANGELOG.md`](CHANGELOG.md): Establishes versioned tracking across workspaces for reproducibility and governance transparency
- [`CONTRIBUTING.md`](CONTRIBUTING.md): Defines contributor pathways, PR expectations, and review flow to support predictable onboarding
- [`docs-architecture.md`](docs-architecture.md): Documents SuiteTools’ documentation structure, cross‑linking strategy, and discoverability patterns

...

### 🔧 Updated

- Root `README.md`: Refined dual‑license model — GPL for code, CC BY 4.0 for documentation — to reinforce SuiteTools’ developer‑first licensing philosophy
- Monorepo root and workspace `README.md` files for clarity, consistency, and alignment
- Linked governance, attribution, and licensing consistently across major documentation touchpoints

---

### 👩‍💻 Developer Impact

- Developers can confidently reuse documentation and visual assets under CC BY 4.0, with clear attribution formats and badge signals
- Contributors have a single, discoverable entry point for governance, licensing, and style guidance
- Documentation structure is now explicitly modeled, making it easier to extend and maintain without breaking suite‑wide patterns
- Error‑handling utilities (`handleError`, `AppErrorBoundary`) offer consistent patterns for managing SuiteScript exceptions
- Suite‑wide discoverability is reinforced through consistent linking, naming, and attribution patterns
