# Change Log

> Part of the SuiteTools governance set.
> See `/docs/governance` for related policies and resources.

Last updated: September 26, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

## [1.0.0-beta.1] — Unreleased

### ⭐ Highlights

- Clarified dual licensing: GPL‑3.0‑or‑later for code, CC BY 4.0 for docs
- Introduced layered error handling docs (standards, guide, advanced, cheat sheet)
- Expanded governance standards (documentation, emoji, linting, yarn, configs)
- Added CHANGELOG.md as a governed artifact with Why/Scope/Impact structure

### 📚 Documentation Overhaul

#### Why

SuiteTools’ documentation had grown unevenly over time — some areas were missing, others were too dense, and governance rules weren’t consistently discoverable.
This release restructures the documentation into **bite‑sized, enforceable standards and practical guides**, filling gaps with new documents and aligning everything under a consistent style, taxonomy, and stewardship model.

It also clarifies licensing:

- **Source code** is explicitly documented as **GPL‑3.0‑or‑later** (as it always was).
- **Documentation** is explicitly licensed under **CC BY 4.0**, encouraging reuse with attribution.
- **CHANGELOG.md** was added as a governed artifact, ensuring every release documents its **Why**, **Scope**, and **Developer Impact**. Contributors are expected to provide feedback and keep it updated in lockstep with governance changes.

#### Scope

- **Governance standards** — Added and expanded rules for documentation, emoji usage, error handling, linting, yarn, callouts, badge clusters, and configuration (ESLint, Prettier, TypeScript, Yarn).
- **Architecture docs** — Added guides for error handling, monorepo/workspace boundaries, and validation; updated core architecture references.
- **Contributor guides** — Added installation, customizing, VS Code setup, linting, build & release (guide + checklist), yarn workflows, and JSDoc standards.
- **Error handling** — Introduced a layered set of resources — standards, core guide, advanced guide, and cheat sheet.
- **Root governance/legal files** — Updated attribution, licenses, notice, code of conduct, contributing, governance, security, style docs, and commit template for clarity and consistency.
- **Workspace docs** — Refreshed backend, frontend, shared, and component READMEs to align with governance standards.
- **Consistency** — Standardized purpose sections, icons, and stewardship notes across all docs; improved cross‑linking; corrected typos and clarified enforceable rules.

#### 🏛️ Governance & Legal

- Updated **ATTRIBUTION.md**, **LICENSE**, **LICENSE-DOCS.md**, **NOTICE**, **README.md**, **STYLE.md**, **CODE_OF_CONDUCT.md**, **CONTRIBUTING.md**, **GOVERNANCE.md**, **SECURITY.md**, and **commit-draft-TEMPLATE.md**.
- Added **CHANGELOG.md** as a governed artifact with required structure and contributor feedback loop.
- Added **docs/governance/README.md** and **license-compliance.md**.
- Introduced **docs/governance/standards** index with new standards:
  - **Documentation Standard** (header, body, footer, sections)
  - **Emoji Usage & Reference**
  - **Error Handling Standards**
  - **Linting Standards**
  - **Yarn Dependencies**
  - **Badge Clusters** and **Callout Blocks**
  - **Config Standards** (ESLint, Prettier, TypeScript, Yarn)
  - **Governance Document Definition**

#### 👩‍💻 Developer Impact

- **Reuse** — Developers can confidently reuse documentation and visual assets under CC BY 4.0.
- **Onboard** — Contributors have a single, discoverable entry point for governance, licensing, and style guidance.
- **Extend** — Documentation structure is explicitly modeled, making it easier to extend and maintain.
- **Discover** — Suite‑wide discoverability is reinforced through consistent linking, naming, and attribution patterns.
- **Trace** — Every release now has a governed changelog entry with clear Why, Scope, and Impact, making history auditable and feedback actionable.
- **Contribute** — Contributors are expected to provide feedback and keep docs in sync with governance standards.

---

## 🧭 Stewardship Callout

- Each release entry must include **Why**, **Scope**, and **Developer Impact**.
- Keep artifact links valid and scoped to canonical governance sources.
- Update this changelog in lockstep with governance and documentation changes.
