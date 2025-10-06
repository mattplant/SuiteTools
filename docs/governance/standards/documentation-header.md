# 📄 Documentation Header Standard

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: September 22, 2025

---

## 🎯 Purpose

This standard defines the required header structure for all SuiteTools documentation files.
It ensures every document — whether a major public entry point or a small internal guide — begins with clear context, scope, and traceability.

> **Usage Notes:**
>
> - Always include all header elements in the order shown in the template.
> - The “Last updated” date must reflect the most recent substantive change to the document.
> - The horizontal rule (`---`) is required to visually separate the header from the body.

---

## 🧩 Core Header Template

```markdown
# [Document Title]

[Optional single-line subtitle]

Last updated: Month D, YYYY
```

> **NOTE:** Need to make sure the link to `/docs/governance` is verified and corrected if necessary once copied to its destination.

---

## Additional Header Elements for Governance Documents

If the document qualifies as a governance document, **also** include the badge cluster immediately **after** the “Last updated” line and **before** the horizontal rule.

### Governance Preamble

If a governance document, add the governance preamble as shown after the title and optional subtitle:

```markdown
> Part of the SuiteTools [workspace or governance set].
> See [/docs/governance](../README.md) for related policies and resources.
```

> 📌 Reminder
>
> Verify the `/docs/governance` link path when copying this template to a new location.

### 🏷️ Badge Cluster

For **major documentation touchpoints**, SuiteTools uses badge clusters to surface licensing, attribution, and source details at a glance.

See [Badge Cluster Usage Standard](badge-clusters.md) for full guidance.

## 📐 Header Layout Rules

- **H1 first** — The first line must be a top‑level heading (`#`) to satisfy markdownlint MD041.
- **Last updated** — Use `Month D, YYYY` format.
- **Separator** — Insert a horizontal rule (`---`) after “Last updated.”
- **Consistency** — Keep wording, order, and formatting consistent across docs, including capitalization, punctuation, and spacing.

### Subtitle Guidance

A subtitle is an optional, single‑line tagline that appears directly under the document’s title.
It can be used to convey the document’s scope, theme, or role in the suite in a concise, memorable way.

---

## 🧭 Stewardship Callout

- Treat the header as part of the document’s **public contract** — changes to it should be reflected in the changelog.
- Keep header wording, order, and formatting in sync across all docs, and keep templates aligned with `documentation-header.md`, `badge-cluster.md`, and `STYLE.md`.

Also see [STYLE.md](../STYLE.md#stewardship-notes) for stewardship guidance.
