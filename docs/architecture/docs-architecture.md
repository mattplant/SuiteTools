# SuiteTools Documentation as Architecture

_Living Standards for Structure, Style, and Stewardship_

_Last updated: September 1, 2025_

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)


## Purpose & Philosophy

SuiteTools treats documentation, licensing, and error boundaries as **living systems**—not static artifacts. Every doc is a structural element in the suite-wide architecture, designed with reproducibility, onboarding clarity, and developer empathy in mind.

We believe that:

- **Documentation is onboarding**: Every file should teach something—whether it's a README, a changelog, or a JSDoc block. Clarity is a form of welcome.
- **Licensing is empowerment**: Attribution and transparency protect contributors, enable reuse, and signal stewardship.
- **Boundaries are contracts**: Workspace isolation, error taxonomies, and schema-driven flows reduce ambiguity and technical debt.

These principles guide every decision—from badge clusters to prose rhythm. Every file, changelog, and attribution note is part of a reference architecture for open source stewardship—designed not just for functionality, but for future clarity, reproducibility, and developer empathy.

SuiteTools is not yet open to external contributions, but its documentation is written as if it were. Every element is crafted to welcome future maintainers, signal intent, and model best practices in architectural transparency.

SuiteTools documentation is modular, discoverable, and versioned with intent. It evolves through changelogs, attribution formats, and governance notes that reflect not just what changed, but _why_ it matters.

This philosophy isn’t abstract—it’s structural. The following sections outline how SuiteTools documentation is organized, styled, and stewarded to reflect these living standards in practice.

## Structural Conventions
<!-- Folder layout, naming conventions, and how docs map to suite-wide architecture. -->

SuiteTools documentation is organized to mirror the suite’s modular architecture. Each workspace is isolated, versioned, and discoverable—reinforcing boundaries while enabling suite-wide clarity.

### Naming Conventions

#### File Naming

- Use lowercase, hyphenated filenames (e.g., `error-handling.md`, `governance-notes.md`) for consistency and discoverability.
- Use `README.md` only for entry-point files that introduce a folder’s purpose.

### Mapping Docs to Architecture

Documentation should reflect the same principles as the codebase:

- **Modularity**: Each guide should serve a specific workspace or suite-wide concern.
- **Isolation**: Workspace docs should not assume knowledge of other workspaces unless explicitly linked.
- **Discoverability**: Use badge clusters, intro lines, and consistent naming to help contributors find what they need.

> Documentation is not just stored—it’s mapped. Every file should reinforce the architecture it describes.

## Stylistic Standards

SuiteTools documentation follows a consistent stylistic rhythm—designed for readability, discoverability, and developer empathy. Style is not cosmetic; it’s architectural. Every phrase, badge, and block reinforces the suite’s modular clarity.

### Markdown Rhythm

- Use level-2 headings (`##`) for major sections; level-3 (`###`) for nested topics.
- Start each section with a short lead-in that explains its purpose.
- Use bullet points for scannable lists; avoid long paragraphs.
- Use callouts (`>`) for stewardship notes, onboarding tips, or architectural reminders.
- Prefer present tense and active voice: “This guide explains…” vs. “This guide is intended to…”

### Badge Clusters

Badges are not decoration—they’re signals of stewardship. Use them to surface licensing, attribution, and source clarity.

- Place badge clusters at the top of each guide or README.
- Keep badge order consistent: Docs License → Source Code License → Attribution → Source.
- Link each badge to its authoritative source

Example:

```markdown
[![Docs License: CC BY 4.0](...)](../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](...)](../LICENSE)
[![Attribution Formats](...)](./ATTRIBUTION.md) [![Source: SuiteTools](...)](https://github.com/mattplant/SuiteTools/)
```

### Contributor‑Facing Phrasing

SuiteTools is designed for frictionless onboarding, and that starts with how we write. Even though it’s not yet open to external contributions, documentation is written with future maintainers in mind. Every phrase should reflect architectural intent and developer empathy.

- **Use inclusive, welcoming language** — e.g., “This guide helps you…” or “To extend this pattern…”
- **Avoid jargon** unless it’s defined or linked.
- **Reinforce architectural clarity** in intro lines — e.g., “This guide supports workspace isolation by…”
- **Keep docs concise** — link for depth, split when needed, aim under 1,000 words.

> **Clarity is a form of welcome.** Every sentence should lower cognitive load and invite understanding.

### JSDoc Clarity

Every source file should begin with a structured JSDoc block that includes:

<!-- TODO: come up with a standard template -->

```ts
/**
 * @fileoverview [Short summary]
 * @module [Logical module name]
 * @remarks [Boundary assumptions or design notes]
 * @license [SPDX identifier]
 * @attribution [Upstream inspiration or references]
 * @see [Related files or docs]
 */
```

<!-- TODO: Should I add a new document about JSDoc standards or include it here which was my original intent? -->
This ensures discoverability, licensing clarity, and contributor context. See `JSDoc Standards` for examples and lint rules.

> Treat JSDoc as architectural metadata—not just comments. It’s how SuiteTools communicates intent across boundaries.

This stylistic rhythm reinforces SuiteTools’ architectural clarity, reproducibility, and stewardship mindset. The next section outlines how licensing, attribution, and governance practices support these principles in practice.

## Documentation Stewardship

<!-- TODO: do we reallly need this section? -->

SuiteTools documentation is treated as architecture in prose—modular, reproducible, and discoverable by design. This section offers guidance for maintaining that clarity over time.

- When introducing new guides, match the suite-wide rhythm: onboarding → workspace → system refinement.
- Use intro lines that reinforce SuiteTools’ architectural intent, reproducibility standards, and contributor empathy.
- Badge clusters, changelog entries, and README snippets should reflect stewardship—not just structure.
- Documentation updates should be versioned when they affect onboarding, licensing, or architectural understanding.

## Stewardship Practices

SuiteTools models reproducible stewardship through transparent licensing, discoverable attribution, and governance notes that empower future contributors—even before external contributions are open.

### Licensing Models

- **Dual-License Strategy**
  SuiteTools applies a consistent dual-license model across the monorepo:
  - Source code is licensed under [GPL-3.0-or-later](../LICENSE) to ensure strong copyleft protections.
  - Documentation is licensed under [CC BY 4.0](../LICENSE-DOCS.md) to encourage reuse and remixing with attribution.

- **SPDX Identifiers**
  Every file includes a top-line SPDX license tag for machine-readable clarity and attribution traceability.
  <!-- TODO: add to every file -->

- **NOTICE File Enforcement**
  License obligations and third-party attributions are centralized in a suite-wide `NOTICE.md`, maintained through changelog discipline.
  <!-- TODO: verify that we have the notice file and that it is up to date -->

### Attribution Formats

- **Badge Clusters**
  Every README and guide begins with a badge cluster signaling license, source, and stewardship status.

- **Visual Attribution**
  Icons and badge styles reinforce discoverability and reuse clarity.

- **Source Linking**
  Attribution badges link directly to source files, license texts, and governance notes.

### Governance Notes

- **Workspace-Level Governance**
  Each workspace includes a `GOVERNANCE.md` outlining its architectural role, license scope, and stewardship boundaries.

<!-- TODO: Do we really need a governance file per workspace? -->

- **Changelog Integration**
  Governance changes are versioned and explained in changelogs to preserve reproducibility.

- **Decision Logs**
  Major architectural or licensing decisions are documented in `DECISIONS.md` with rationale and stewardship impact.

<!-- TODO: add documentwith the documenations license addition -->

### Stewardship Continuity

- **Onboarding by Design**
  Documentation is written with future maintainers in mind—every guide is discoverable, reproducible, and welcoming by default.

- **Stewardship Signals**
  Badge clusters, changelogs, and governance notes reinforce SuiteTools’ commitment to architectural clarity and long-term maintainability.

- **Internal Iteration Loops**
  SuiteTools evolves through internal refinement—documentation, attribution, and governance clarity are continuously improved as part of suite-wide stewardship.

## Onboarding & Developer Empathy

SuiteTools is designed for frictionless onboarding. Every step should anticipate the needs of someone new to the suite, guiding them toward confident, responsible contributions.

- **Start with a clear path** — provide a “first 5 minutes” guide that orients contributors to the suite’s structure and goals.
- **Surface navigation cues** — link to related docs, patterns, and references at natural decision points.
- **Explain the “why”** — pair instructions with the architectural reasoning behind them to build shared understanding.
- **Model responsible extension** — show how to add or modify docs without breaking suite‑wide clarity or governance.
- **Reduce cognitive load** — use consistent headings, badge clusters, and visual cues to make scanning effortless.

> **Empathy is architecture in prose.** Every onboarding step should make the next one feel obvious.

## Living Documentation Workflow

SuiteTools treats documentation as living architecture — always accurate, discoverable, and aligned with current suite behavior.

Stewardship means knowing **when to revise** and **how to track changes** so documentation remains accurate, discoverable, and trusted.

**Do this to keep documentation alive and in sync:**

- **Track updates visibly** — use changelogs, commit messages, and badge clusters to signal what changed and when.
- **Revise at the point of change** — update docs in the same pull request as the code or governance change they describe.
- **Link related updates** — connect changes across guides, patterns, and governance notes to preserve suite‑wide coherence.

**Revise documentation when:**

- **Public API changes** (added, removed, or altered)
- **Governance or licensing updates**
- **Pattern or workflow changes** (introduced, deprecated, or renamed)
- **Badge cluster or attribution format changes**

## Appendices

Quick references for SuiteTools’ key governance signals and supporting resources.

- **Badge glossary** — see [Badge Usage](../governance/ATTRIBUTION.md#badge-usage) for current badge clusters, meanings, and source links.
- **Attribution templates** — see [Attribution Formats](../governance/ATTRIBUTION.md#attribution-formats) for Markdown and plaintext formats for code, docs, and visuals.
- **Licensing references** — [LICENSE](../../LICENSE) (GPLv3-or-later) and [LICENSE-DOCS.md](../../LICENSE-DOCS.md) (CC BY 4.0).
- **Governance principles** — see [Governance Principles](../governance/GOVERNANCE.md#governance-principles) for stewardship philosophy, decision-making process, and workspace boundaries.
- **Supporting files** — [Contributor Guide](../../CONTRIBUTING.md), [Style Guide](./STYLE.md), and governance notes.
