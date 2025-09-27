# 🏷️ Badge Cluster Usage Standard

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: September 22, 2025

---

## 🎯 Purpose

The badge cluster is a visual governance signal for licensing, attribution, and source details.
It reinforces discoverability, stewardship, and reuse boundaries by indicating compliance, contributor intent, and documentation integrity.

This standard defines **when**, **where**, and **how** to include the badge cluster in SuiteTools documentation.

---

## 📌 When to Include

Only include the full governance header **and** badge cluster on governance documents.

See [Governance Document Definition](governance-docs.md) for the complete scope rules and examples of what qualifies.

---

## 🧩 Badge Cluster Template

```markdown
<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)
```

## 📋 Placement

Place the badge cluster **immediately after** the last updated date and **before** the horizontal rule.
Do not insert insert any text, images, or other elements between the last updated date and the badge cluster.

This keeps all governance meta‑info together in a predictable block, as defined in [Documentation Header Standard](documentation-header.md).

```markdown
Last updated: Month D, YYYY

<!-- Badge cluster starts -->
(BADGE CLUSTER GOES HERE)
<!-- Badge cluster ends -->
```

---

## 🧭 Stewardship Callout

- Keep badge clusters consistent across suite-wide and workspace-local documentation
- Keep badge URLs and link targets **in sync** with `LICENSE`, `LICENSE-DOCS.md`, and `ATTRIBUTION.md`.
- Use **relative links** so badges work in forks and offline clones.
- Always link to the **canonical copy** of their authoritative source to avoid drift.
- Treat the badge cluster as part of the doc’s **public contract** — changes to it should be reflected in the changelog.
