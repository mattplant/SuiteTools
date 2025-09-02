# Attribution Guide

> This document is part of the SuiteTools governance set.
> See `/docs/governance` for related policies and resources.

_Last updated: September 1, 2025_

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

This guide provides Markdown-ready and plaintext attribution formats for reusing SuiteTools materials under two stewardship-aligned licenses:

- **Source code and implementation files** are licensed under [GPLv3-or-later](https://www.gnu.org/licenses/gpl-3.0.html), requiring derivative works to preserve the license, include the original `LICENSE` and `NOTICE` files, and remain freely available.
- **Documentation, diagrams, and onboarding materials** are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), empowering contributors to reuse, remix, and redistribute with proper credit.

Whether you're adapting onboarding guides or forking SuiteTools workspaces, this guide ensures attribution remains clear, discoverable, and reproducible—reinforcing SuiteTools as a reference monorepo for transparent reuse and contributor empowerment.

---

## Source Code Attribution and Licensing Obligations

SuiteTools source code is licensed under [GPLv3-or-later](https://www.gnu.org/licenses/gpl-3.0.html), which ensures strong copyleft protections and long-term reproducibility. If you reuse, remix, or fork SuiteTools code, you must preserve its licensing and attribution signals.

### Attribution Practices for Source Code

- **SPDX Headers**
  Include SPDX license identifiers at the top of source files to signal licensing clearly. Example:

  ```ts
  // SPDX-License-Identifier: GPL-3.0-or-later
  ```

- **NOTICE File**
   Retain or extend the `NOTICE` file in your fork or derivative project to acknowledge SuiteTools as the original source. This file should include:
  - The name and URL of the original project
  - The original author or steward
  - A summary of any modifications you've made
  - References to any third-party components or licenses introduced
  Maintaining a clear and discoverable NOTICE file helps downstream users understand provenance, licensing, and stewardship lineage.
- **LICENSE Preservation**
  Keep the original [LICENSE](../LICENSE) file intact and visible in your fork or derivative project. Do not remove or replace it unless you fully relicense under compatible terms.
- **README Attribution**
  Include a reference to SuiteTools in your project’s README files, especially if significant portions of code or architecture are reused.

### Markdown Attribution Example for Source Code Forks

```markdown
> This project is adapted from [SuiteTools](https://github.com/mattplant/SuiteTools/) by [Matthew Plant](https://idev.systems/), licensed under [GPLv3-or-later](https://www.gnu.org/licenses/gpl-3.0.html).
```

> **Reminder**
>
> - The SuiteTools source code is licensed under [GPLv3-or-later](https://www.gnu.org/licenses/gpl-3.0.html), which requires that derivative works preserve the license, include the original [LICENSE](LICENSE) file, and remain freely available.
> - Documentation and diagrams are licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/), which permits remixing and redistribution with proper attribution.
> - When combining SuiteTools materials with other licensed content, ensure license compatibility and preserve original attribution formats.

For license details, see [LICENSE](LICENSE) and [LICENSE-DOCS.md](LICENSE-DOCS.md).

---

## Documentation Attribution and Licensing Obligations

### Attribution Formats

These formats apply to documentation, diagrams, and onboarding materials licensed under CC BY 4.0. For source code attribution, preserve SPDX headers and the original LICENSE file.

Use one of the following formats when referencing or adapting SuiteTools documentation:

#### Plain Text Attribution

For use in plaintext files, code comments, or documentation systems that don’t support Markdown:

```txt
“Documentation adapted from SuiteTools (https://github.com/mattplant/SuiteTools/) by Matthew Plant (https://idev.systems/), licensed under CC BY 4.0.”
```

💡 **Prefer Markdown?** Use the snippet below. Need plaintext for comments or legacy systems? Use the version above.

#### Markdown Attribution

For use in READMEs, docs, or any Markdown-rendered content:

```txt
> Documentation adapted from [SuiteTools](https://github.com/mattplant/SuiteTools/) by [Matthew Plant](https://idev.systems/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

```

---

### Visuals and Diagrams

For diagrams, charts, or visual storytelling assets, include attribution in the caption or adjacent text. Example:

This ensures that visual materials remain discoverable and properly attributed when reused in downstream projects, presentations, or documentation.

#### Plain Text Attribution

For use in plaintext files, code comments, or documentation systems that don’t support Markdown:

```txt
“Diagram adapted from SuiteTools (https://github.com/mattplant/SuiteTools/) by Matthew Plant (https://idev.systems/), licensed under CC BY 4.0.”
```

💡 **Prefer Markdown?** Use the snippet below. Need plaintext for comments or legacy systems? Use the version above.

#### Markdown Attribution

For use in READMEs, docs, or any Markdown-rendered content:

```txt
> Diagram adapted from [SuiteTools](https://github.com/mattplant/SuiteTools/) by [Matthew Plant](https://idev.systems/), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
```
---

## Badge Usage

SuiteTools uses badge clusters throughout its documentation and workspace READMEs to signal key metadata at a glance. These badges are not decorative—they serve as discoverability tools for licensing, attribution, and governance alignment.

### Common Badge Types

- **License Badges**
  Indicate the applicable license for source code (`GPL-3.0-or-later`) and documentation (`CC BY 4.0`)

- **Attribution Formats**
  Link to reusable attribution templates and visual crediting standards

- **Governance Status** *(optional)*
  Signal whether a workspace adheres to suite-wide linting, error-handling, and reproducibility conventions

### Usage Guidelines

- Keep badge clusters consistent across suite-wide and workspace-local documentation
- Link badges to their authoritative source (e.g., LICENSE files, Attribution Guide)
- Use [shields.io](https://shields.io) or equivalent services to ensure visual clarity and accessibility
- Place badge clusters near the top of each document for discoverability

For examples and badge templates, see the top of this page.
