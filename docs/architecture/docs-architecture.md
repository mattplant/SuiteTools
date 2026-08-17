# 📐 SuiteTools Documentation as Architecture

Living Standards for Structure, Style, and Stewardship

Last updated: 2026-08-17

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://gitlab.com/idev-systems/labs/SuiteTools/)

---

## 🎯 Purpose & Philosophy

SuiteTools treats documentation as a **living system**: every file is a structural element designed for reproducibility, onboarding clarity, and developer empathy.

We believe:

- **Documentation is onboarding** — every file should teach something (README, changelog, JSDoc).
- **Boundaries are contracts** — isolation, taxonomies, and schema‑driven flows reduce ambiguity and technical debt.

> 🔗 For licensing and attribution philosophy, see [Attribution](../../ATTRIBUTION.md).

Docs are modular, discoverable, and versioned with intent. They evolve through changelogs, attribution formats, and governance notes that capture not just what changed, but _why_.

---

## 🧱 Three Pillars of Style

| Pillar | Scope | Role | Link |
|--------|-------|------|------|
| **Documentation as Architecture** | Conceptual | **`Why` we document** — guiding philosophy for docs as governed architecture. | (this doc) |
| **Standards Index** | Macro‑level | **`What` to follow** — enforceable patterns for doc structure, placement, and governance. | [Standards Index](../governance/standards/README.md) |
| **Style Guide** | Micro‑level | **`How` to express** — tone, structure, formatting, and naming conventions. | [Style Guide](../governance/STYLE.md) |

---

## 🗂️ Structural Conventions

Docs mirror the suite’s modular architecture. Each workspace is isolated, versioned, and discoverable—reinforcing boundaries while enabling suite‑wide clarity.

### Naming Conventions

- Use lowercase, hyphenated filenames (e.g., `error-handling.md`).
- Use `README.md` only for entry‑point files introducing a folder’s purpose.

### Folder Layout

- `/docs/architecture` — conceptual guides (philosophy, structure, style)
- `/docs/governance` — enforceable standards and policies (e.g., license compliance, emoji usage)
- `/docs/guides` — task‑oriented contributor guides (e.g., JSDoc, onboarding, build & release)

> **Rule of thumb:** Architecture docs explain _why_, governance docs define _what_, guides show _how_, and workspace docs apply it in context.

### Mapping Docs to Architecture

- **Modularity** — each guide serves a specific concern.
- **Isolation** — workspace docs shouldn’t assume knowledge of others unless linked.
- **Discoverability** — use badge clusters, intro lines, and consistent naming.

---

## 📜 Documentation Stewardship

Docs are **architecture in prose**: modular, reproducible, and discoverable. Every guide should reinforce suite‑wide clarity while anticipating future maintainers.

### Stewardship Rhythm

When introducing new guides, follow the suite‑wide rhythm:

- **Onboarding → Workspace → System refinement**
- Begin with intro lines that reinforce architectural intent
- Keep docs concise; link for depth, split when needed

### Stewardship Continuity

Documentation is written with **future developers in mind**. Every guide should be discoverable, reproducible, and welcoming by default.

- **Onboarding by Design** — orient new contributors quickly
- **Stewardship Signals** — badge clusters, changelogs, governance notes
- **Iteration Loops** — refine docs, attribution, and governance continuously

### Onboarding & Developer Empathy

SuiteTools is designed for **frictionless onboarding**. Every step should anticipate new contributors and guide them toward confident, responsible contributions.

- Provide a “first 5 minutes” guide to orient contributors
- Surface navigation cues at natural decision points
- Pair instructions with architectural reasoning — always explain the “why”
- Show how to extend docs responsibly
- Reduce cognitive load with consistent headings and signals

> **Empathy is architecture in prose.** Every onboarding step should make the next one feel obvious.

---

## 📑 Stylistic Standards

Style is architectural: it ensures readability, discoverability, and empathy.

### Markdown Rhythm

- Use `##` for major sections; `###` for nested topics
- Begin each section with a short lead‑in
- Favor bullet points over long paragraphs
- Use callouts (`>`) for stewardship notes or onboarding tips
- Prefer present tense and active voice (“This guide explains…”)

> 🔗 For full stylistic rules, see the [Style Guide](../governance/STYLE.md).

### Badge Clusters

Badges signal stewardship, surfacing licensing, attribution, and source clarity.

> 🔗 See [Badge Clusters Standard](../governance/standards/badge-clusters.md).

### Contributor‑Facing Phrasing

- Use inclusive, welcoming language
- Avoid jargon unless defined or linked
- Reinforce architectural clarity in intros
- Keep docs concise; link for depth, split when needed, aim under 1,000 words.

> **Clarity is a form of welcome.** Every sentence should lower cognitive load and invite understanding.

### JSDoc Clarity

Every source file begins with a structured JSDoc block that communicates intent, boundaries, and licensing. Treat JSDoc as **architectural metadata**.

> 🔗 See [JSDoc Standards](../guides/jsdoc-standards.md).

---

## 🔄 Living Documentation Workflow

Docs are **living architecture**: always accurate, discoverable, and aligned with current suite behavior.

### Keep Documentation Alive

- **Track updates visibly** — changelogs, commits, badge clusters
- **Record significant changes in the next release changelog** — not in the same merge request; see the [Build & Release Checklist](../guides/build-release-checklist.md)
- **Revise at the point of change** — update docs in the same PR as code/governance changes
- **Link related updates** — connect guides, patterns, and governance notes

### Revise Documentation When

- Public API changes
- Governance or licensing updates
- Patterns or workflows are introduced, deprecated, or renamed
- Badge cluster or attribution formats change

---

## 🧭 Stewardship Callout

This document is itself **living architecture**. Revise it whenever SuiteTools’ documentation practices, governance standards, or onboarding flows evolve.

Stewardship means knowing **when to revise** and **how to track changes** so docs remain trusted.

> 💡 **Principle:** Documentation about documentation must also live.
> 🔗 **Practice:** Update this guide in the same pull request as related architectural or governance changes, and cross‑link new or updated standards so it remains a reliable map of the documentation ecosystem. See the [Governance Standards Index](../governance/standards/README.md).
