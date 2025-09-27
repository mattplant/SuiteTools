# 🤝 Contributing to SuiteTools

> Part of the SuiteTools governance set.
> See `/docs/governance` for related policies and resources.

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)
[![Contribution Status: Paused](https://img.shields.io/badge/contributions-paused-red.svg)](#-contribution-status)

---

## 🎯 Purpose & Scope

SuiteTools is actively maintained by its core steward with the goal of keeping every workspace **discoverable, reproducible, and welcoming by default**.

This guide defines how contributions are managed, what workflows maintainers follow, and how future contributors will be onboarded once contributions reopen.

**Out of scope:** Contribution rules for external forks or derivative projects — see [`license-compliance.md`](./docs/governance/license-compliance.md) for obligations around licensing, attribution, and reuse.

---

## 🚫 Contribution Status

**External contributions are paused (for now).**

This pause is intentional — SuiteTools is being actively stewarded to ensure its governance, licensing, and architecture are **predictable, reproducible, and welcoming by default**.
The focus during this phase is on building a strong foundation so that when contributions reopen, onboarding will be clear and friction‑free.

🔍 **What this means for you:**

- You are welcome to **explore the codebase** and study its patterns.
- You can **open issues** for questions, feedback, or suggestions.
- You can **learn from the governance docs** to understand how SuiteTools is structured for future contributors.

💡 **Looking ahead:** Contributions will reopen once the suite’s codebase, documentation and governancereach a stable baseline. At that point, external pull requests will be actively encouraged and supported.

---

## 💻 Local Development (for Maintainers & Future Reference)

For full setup instructions, see:

- [Installation Guide](./docs/guides/installation.md)
- [Customization Guide](./docs/guides/customizing.md)

Quick reference for maintainers:

1. **Clone** the repository
2. **Install** dependencies
3. **Bootstrap** workspaces
4. **Start coding!**

---

## 🔄 Contribution Workflow (for Maintainers & Future Reference)

1. **Open** an issue first for significant changes — this ensures alignment with suite‑wide patterns.
2. **Fork** and branch.
3. **Follow** coding standards:
   - TypeScript: strict mode, no implicit `any`
   - Linting must pass
   - Follow the [Commit Message Format](./commit-draft-TEMPLATE.md) for clarity and traceability
4. **Document** your change:
   - Update relevant documents
   - Add or update changelog entries in `CHANGELOG.md`
   - Maintain attribution if reusing external code or assets
5. **Submit** a pull request:
   - Link to the issue you opened
   - Describe your change and its impact on the suite

### Compliance Best Practices

- Audit new dependencies for GPLv3 compatibility.
- Use `license-checker` or `yarn licenses list` to audit transitive metadata.
- Avoid GPLv3-incompatibile licenses (e.g., SSPL, BUSL, Commons Clause).
- Prefer SPDX-compliant packages (`"GPL-3.0-only"`, `"MIT"`, `"Apache-2.0"`)
- Maintain a `LICENSES.md` file for manual reviews and exceptions.

---

## 🏛️ Governance & Licensing

All contributions are guided by SuiteTools’ governance model and licensing standards.
For details, see the canonical sources:

| Document | Purpose | Audience |
|----------|---------|----------|
| [`docs/governance/README.md`](./docs/governance/README.md) | Index of all governance standards and policies | All contributors |
| [`license-compliance.md`](./docs/governance/license-compliance.md) | Compliance obligations (NOTICE, SPDX, license compatibility, stewardship lineage) | Maintainers & contributors reusing code/docs |
| [`LICENSE`](LICENSE) | Legal terms for source code (GPLv3‑or‑later) | All users & contributors |
| [`LICENSE-DOCS.md`](LICENSE-DOCS.md) | Legal terms for documentation (CC BY 4.0) | All users & contributors |
| [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) | Expected behavior and enforcement process | All community members |
| [`SECURITY.md`](SECURITY.md) | Security reporting and vulnerability disclosure process | Contributors & security researchers |

---

## 🛫 First‑Time Contributor Tips

- Start small — typo fixes, doc clarifications, or adding examples are great first PRs.
- Use our **badge clusters** and **visual discoverability cues** when adding new docs.
- Review the [Installation Guide](./docs/installation.md) and [Customization Guide](./docs/customizing.md) to understand how SuiteTools is set up and extended.
- Ask questions early in the issue thread — we value clarity over assumptions.

---

## 🧭 Stewardship Callout

- Update this guide whenever **contribution status** changes (e.g., paused → open).
- Keep **workflow steps** aligned with current coding standards, governance policies, and onboarding practices.
- Ensure **links to governance anchors** (e.g., license compliance, code of conduct) remain valid and point to canonical sources.
- Reflect all substantive changes in the **changelog** for transparency and reproducibility.
