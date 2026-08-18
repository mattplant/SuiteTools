
# 🔒 Security Policy

> Part of the SuiteTools governance set.
> See `/docs/governance` for related policies and resources.

Last updated: 2026-08-17

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://gitlab.com/idev-systems/labs/SuiteTools/)

---

## 🎯 Purpose & Scope

SuiteTools takes security seriously. This policy defines how SuiteTools handles security vulnerabilities and how contributors and external parties should report them.

**Scope:** Applies to the `main` branch and the latest published release. Forks, custom modifications, and unsupported versions are out of scope.

If you discover a vulnerability, please help us protect the community by reporting it responsibly.

---

## 📝 Reporting a Vulnerability

Open a **confidential issue** on this GitLab project.

- Use [New issue](https://gitlab.com/idev-systems/labs/SuiteTools/-/issues/new?issue[confidential]=true) and turn **confidentiality** on before you submit.
- Include steps to reproduce, potential impact, and any suggested fixes or mitigations.

> ⚠️ **Warning:** Do not open a public issue, merge request, or discussion for a vulnerability. There is no security mailbox and no GitHub advisory path for this project.

A confidential issue is visible only to project members with sufficient permissions, and to you as the reporter.

---

## 📦 Supported Versions

We actively maintain:

- The `main` branch
- The latest published release — the most recent annotated git tag `v<version>` that has a [GitLab Release](https://gitlab.com/idev-systems/labs/SuiteTools/-/releases)

These versions will receive security updates and coordinated fixes. A version number in `package.json` is not a published release until it is tagged and released on GitLab.

### ❌ Out of Scope

The following are **not** covered by this security policy:

- Older releases (beyond the latest published release)
- Forks or derivative projects not maintained by the SuiteTools steward
- Custom modifications made outside the official repository
- Archived or deprecated branches

---

## 🔄 Response Process

1. **Acknowledge** your report within a reasonable timeframe.
2. **Investigate** the issue and, if confirmed, **prepare** a fix.
3. **Coordinate** a release and **credit** you (if desired) in the changelog.

---

## 🤝 Responsible Disclosure

Please allow maintainers a reasonable window to investigate, prepare a fix, and publish a release **before public disclosure**.
This ensures the community remains protected while the issue is being resolved.

---

## 🧭 Stewardship Callout

- Substantive changes are recorded in the next release changelog, not in the same merge request. See the [Build & Release Checklist](docs/guides/build-release-checklist.md).
- Keep cross‑links between standards up to date to avoid drift.
