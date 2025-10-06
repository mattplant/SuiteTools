# 📄 Documentation Footer Standard

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: September 22, 2025

---

## 🎯 Purpose

This standard defines the required footer structure for all SuiteTools documentation files.
It ensures every document — whether a major public entry point or a small internal guide — concludes with clear stewardship, related resources, and traceability.

---

## 📋 Footer Elements

### 🔗 Related

Links to related documents, resources, or external references that provide additional context.
Use the 🔗 Link emoji to signal related resources.

### 🗒️ Stewardship Section

A Stewardship Section captures maintenance guidelines, update frequency, and ownership details.
It helps future maintainers understand the document’s lifecycle and responsibilities.

- For **general docs**, this section is optional. If included, title it `## 🗒️ Stewardship Notes`.
- For **governance docs**, this section is required. Always title it `## 🧭 Stewardship Callout`.

## 📋 Copy‑Paste Footer Template (For Real Docs)

When adding a footer to an actual documentation file, use this template. Each section is a **top‑level `##` heading** at the bottom of the document.

📌 **Rule:** Include exactly one stewardship section per document.

- For **general docs**, the stewardship section is optional.
  - If you omit it, remove both the Notes and Callout placeholders from the template.
- If you include stewardship guidance in a general doc, title it `## 🗒️ Stewardship Notes`.
- For **governance docs**, the stewardship section is required. Always title it `## 🧭 Stewardship Callout`.

```md
## 🔗 Related
[List related documents, resources, or external references here.]

## 🗒️ Stewardship Notes
<!-- Use this section for general docs if applicable. Delete if not needed. -->

## 🧭 Stewardship Callout
<!-- Use this section for governance docs. Delete if not applicable. -->

> 💡 **Principle:** [State the stewardship principle relevant to this doc.]
> 🔗 **Practice:** [Define how and when this doc must be updated, and where to cross‑link changes.]

```

---

Because this document is itself a governance standard, it concludes with a required Stewardship Callout.

## 🧭 Stewardship Callout

> 📘 **Reference:** For documentation style, see [Style Guide](../STYLE.md).
> 🧭 **Reference:** For stewardship practices and governance scope, see the [Governance Index](../README.md).
