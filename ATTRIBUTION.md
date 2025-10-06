# Attribution Guide

> Part of the SuiteTools governance set.
> See `/docs/governance` for related policies and resources.

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

---

## 🎯 Purpose & Scope

SuiteTools materials are dual‑licensed:

- **Source code** — [GPLv3‑or‑later](https://www.gnu.org/licenses/gpl-3.0.html)
- **Documentation and diagrams** — [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

This guide provides ready‑to‑use attribution formats (Markdown and plaintext) for both cases, ensuring reuse remains clear, discoverable, and reproducible.

---

## 🧑‍💻 Source Code Attribution

SuiteTools source code is licensed under [GPLv3-or-later](https://www.gnu.org/licenses/gpl-3.0.html), which ensures strong copyleft protections and long-term reproducibility. If you reuse, remix, or fork SuiteTools code, you must preserve its licensing and attribution signals.

When reusing or forking SuiteTools code:

- **SPDX Header** — add to each source file

  ```ts
  // SPDX-License-Identifier: GPL-3.0-or-later
  ```

- **LICENSE File** — keep the original [LICENSE](./LICENSE) file intact and visible in your fork or derivative project

- **NOTICE File** — Retain or extend to acknowledge SuiteTools as the original source.
  Must include:
  - Project name + URL
  - Original author/steward
  - Summary of modifications
  - References to third‑party components/licenses
  → Ensures provenance, licensing, and stewardship lineage remain clear.

- **README Attribution** — Add a reference to SuiteTools in your project’s README, especially if significant portions of code or architecture are reused.

**`Markdown` Example:**

```markdown
This project is adapted from [SuiteTools](https://github.com/mattplant/SuiteTools/) by [Matthew Plant](https://idev.systems/), licensed under [GPLv3-or-later](https://www.gnu.org/licenses/gpl-3.0.html).
```

**`Plain Text` Example**

```txt
“This project is adapted from SuiteTools (https://github.com/mattplant/SuiteTools/) by Matthew Plant (https://idev.systems/), licensed under GPLv3-or-later."
```

---

## 📚 Documentation Attribution

For documentation, diagrams, and onboarding materials under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), use one of the following formats:

Use one of the following formats when referencing or adapting SuiteTools documentation:

**`Markdown` Example:**

```markdown
> Documentation adapted from [SuiteTools](https://github.com/mattplant/SuiteTools/) by [Matthew Plant](https://idev.systems/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
```

**`Plain Text` Example**

For use in plaintext files, code comments, or documentation systems that don’t support Markdown:

```txt
“Documentation adapted from SuiteTools (https://github.com/mattplant/SuiteTools/) by Matthew Plant (https://idev.systems/), licensed under CC BY 4.0.”
```

### 🖼️ Visuals & Diagrams Attributio

For diagrams or visual assets, include attribution in the caption or adjacent text to ensure it remains visible when reused in downstream projects, presentations, or documentation.

**`Markdown` Example:**

```markdown
> Diagram adapted from [SuiteTools](https://github.com/mattplant/SuiteTools/) by [Matthew Plant](https://idev.systems/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
```

**`Plain Text` Example**

```txt
“Diagram adapted from SuiteTools (https://github.com/mattplant/SuiteTools/) by Matthew Plant (https://idev.systems/), licensed under CC BY 4.0.”
```

---

## 🏷️ Badge Cluster Usage

Badge clusters provide an at‑a‑glance signal of licensing, attribution, and source details in documentation and workspace READMEs. They are functional governance signals, not decoration — linking directly to authoritative sources such as `LICENSE`, `LICENSE-DOCS.md`, and `ATTRIBUTION.md`.

> **Note:** Full guidance is maintained in the [Badge Cluster Usage Standard](./docs/governance/standards/badge-clusters.md), including:
>
> - When to include or omit badge clusters
> - Approved badge types and templates
> - Placement rules and stewardship notes

---

## 📜 License Compliance

SuiteTools materials are dual‑licensed:

- **Source code** is licensed under [GPLv3‑or‑later](https://www.gnu.org/licenses/gpl-3.0.html).
- **Documentation and diagrams** are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Attribution formats in this guide ensure reuse remains clear and discoverable.
For detailed compliance obligations — including license compatibility, NOTICE file requirements, and stewardship lineage — see the [License Compliance & Attribution](./docs/governance/license-compliance.md).

For license texts, see [LICENSE](LICENSE) and [LICENSE-DOCS.md](LICENSE-DOCS.md).

---

## 🧭 Stewardship Callout

- Changes to this file must be reflected in the changelog.
- Keep cross‑links between standards up to date to avoid drift.
