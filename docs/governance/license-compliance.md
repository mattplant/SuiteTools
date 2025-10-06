# 📜 License Compliance & Attribution

> Part of the SuiteTools governance set.
> See [/docs/governance](./README.md) for related policies and standards.

Last updated: September 22, 2025

---

## 🎯 Purpose

This document defines SuiteTools’ licensing model, attribution expectations, and contributor responsibilities for license compliance.

It complements:

- [ATTRIBUTION.md](../../ATTRIBUTION.md) — badge formats and reuse guidance
- [LICENSE](../../LICENSE) — GPL-3.0-or-later source code license
- [LICENSE-DOCS.md](../../LICENSE-DOCS.md) — CC BY 4.0 documentation license
- [NOTICE](../../NOTICE) — required third‑party attributions

---

## 🏷️ Licensing & Attribution

In general, **attribution** means acknowledging the original creator or source of a work. In open source, it specifically refers to:

> Clearly identifying the original authors or projects when you reuse, modify, or distribute their code or documentation.

Attribution is foundational to SuiteTools’ governance model. It ensures traceability, honors stewardship, and supports reproducible architecture across forks, remixes, and derivative guides.

SuiteTools applies a dual-license model to balance strong copyleft protections with open documentation reuse:

| Component      | License                            |
|----------------|------------------------------------|
| Source Code    | [GPL-3.0-or-later](../../LICENSE)  |
| Documentation  | [CC BY 4.0](../../LICENSE-DOCS.md) |

- Mixed files (e.g. Markdown with embedded code) are governed by the dominant content type
  - Split into separate files when possible to preserve license clarity
- Third-party assets retain their original license and require attribution
- SPDX headers must be preserved in all source files
- NOTICE blocks must be maintained and updated when adding third-party code

If you reuse, remix, or reference SuiteTools—whether in code, documentation, onboarding flows, or architectural patterns-please follow the attribution guidelines in [ATTRIBUTION.md](../../ATTRIBUTION.md) and preserve all required license markers.

> 📘 Attribution is not just legal—it’s architectural. It preserves traceability, honors stewardship, and supports reproducible governance.

---

### ⭐ Why It Matters

- **Preserve** the integrity of SuiteTools’ licensing model
- **Avoid** legal or distribution issues for downstream projects
- **Promote** trust and transparency with the community
- **Enable** reproducible governance across forks, remixes, and derivative documentation

---

## ⚠️ If You Find a License Violation

If you discover a dependency that is **GPLv3‑incompatible**, raise it immediately via:

- Open a GitHub issue
- Submit a pull request
- Email the project maintainers

Your vigilance protects SuiteTools’ legal clarity and community trust.

---

## 🧑‍💻 Contributor Responsibilities

All contributors share responsibility for maintaining SuiteTools’ licensing integrity. This includes:

- **Ensure** all direct and transitive dependencies are license‑compatible
- **Preserve** SPDX headers and NOTICE blocks in source files
- **Follow** attribution formats when referencing SuiteTools externally
- **Flag** any license ambiguity or potential incompatibility during reviews
- **Seek** guidance when unsure — license questions are welcome and encouraged

> 📘 See [ATTRIBUTION.md](../../ATTRIBUTION.md) for badge clusters and reuse syntax.
> 📘 See [NOTICE](../../NOTICE) for required third‑party attributions.

---

## 🧭 Stewardship Callout

This document is part of SuiteTools’ **living governance system**.
It must evolve alongside licensing, attribution, and dependency practices.

> 💡 **Principle:** License compliance is not just legal — it’s architectural.
> Preserving SPDX headers, NOTICE blocks, and attribution formats ensures SuiteTools remains reproducible and trustworthy.

> 🔗 **Practice:** Update this file in the same pull request as any license, attribution, or dependency change.
> Cross‑link to updated standards (e.g. [ATTRIBUTION.md](../../ATTRIBUTION.md), [NOTICE](../../NOTICE)) so this document remains a reliable source of truth.
