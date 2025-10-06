# 📜 Governance Document Definition

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: September 22, 2025

---

## 🎯 Purpose

Defines **what is** and **what is not** a governance document in SuiteTools.
Governance documents carry suite‑wide authority, are subject to stricter review and versioning requirements, and are the **only** documents that should display the [Governance Preamble](./documentation-header.md#governance-preamble) and [Cluster Badges](./badge-clusters.md).

---

## 🏛️ Governance Documents

A file is considered a governance document **only if all of the following apply**:

- **Public‑facing** — intended for contributors, users, or downstream consumers outside the immediate team.
- **Authoritative** — defines binding rules, architecture, or patterns for the suite.
- **Complete in isolation** — can be read without prior context and still convey its full intent and authority.

### 📂 Examples

**Root‑level docs** — suite‑wide entry points and legal/process anchors:
`CHANGELOG.md`, `CONTRIBUTING.md`, `LICENSE`, `LICENSE-DOCS.md`, `NOTICE`, `README.md`

**Workspace‑level docs**
workspace `README.md` files that are **public‑facing and authoritative**

**Governance docs** — rules, standards, and expectations (canonical copies at root):
`ATTRIBUTION.md`, `CODE_OF_CONDUCT.md`, `GOVERNANCE.md`, `SECURITY.md`, `STYLE.md`

**Major topic guides** — authoritative guides likely to be read in isolation:
`docs-architecture.md`, `frontend/docs/components.md`, `backend/docs/api-overview.md`

---

## 🚫 Not Governance Documents

The following do **not** qualify as governance documents and must **not** display the Governance Preamble or cluster badges:

- **Internal‑only or placeholder workspace `README.md` files** — not public‑facing or authoritative
- **Supporting material** — only makes sense when read via a parent doc
- **Narrow in scope** — API references, single‑component READMEs, or small how‑tos
- **Generated output** — typedoc, schema dumps, or build artifacts
- **Temporary/WIP notes** — drafts, scratchpads, or internal planning docs

---

## 🕵️ Edge Cases

Some documents may blur the line between governance and supporting material.
When in doubt:

1. Apply the three criteria above.
2. Consider whether the document is the **canonical source** for its content.

---

## 🧭 Stewardship Callout

- Changes to this file must be reflected in the `CHANGELOG.md`.
- Keep cross‑links between standards up to date to avoid drift.
- Tag governance document changes in release notes for traceability.
