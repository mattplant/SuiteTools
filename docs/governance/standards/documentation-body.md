# 📄 Documentation Body Standard

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: September 22, 2025

---

## 🎯 Purpose

This standard defines the required body structure for all SuiteTools documentation files.
It ensures every document — whether a major public entry point or a small internal guide — begins with clear context, scope, and traceability.

---

## 📝 Style

- **Horizontal rules before H2s** create predictable scanning points.
- **Emoji usage** follows taxonomy — icons are functional, not decorative.
- **Callout blocks** are short, purposeful, and governance‑aligned.
- **Code snippets** are language‑tagged for clarity and reproducibility.
- **Progressive disclosure** allows adding contribution‑specific sections later without restructuring.

---

## Document Elements

### Emoji

Use emoji to enhance scannability and convey meaning at a glance.

See [Emoji Usage Standard](./emoji.md) and [Emoji Reference](./emoji-reference.md) for approved emoji and usage rules.

### Headings

Use clear, descriptive headings to organize content logically.

- Keep headings **concise but descriptive** enough to convey the section's content.
- Use H2 for main sections and then additional levels (H3, H4) as needed for subsections.
- Use **horizontal rules** (`---`) before every new H2 to visually separate the new section from the last.
- Use **emoji in headings** where appropriate to enhance meaning and scannability.
- Use **consistent terminology** for similar sections across documents.
- Use **Title Case** for all headings.

#### Heading Capitalization Enforcement

SuiteTools enforces **Title Case** in all Markdown headings via a custom ESLint rule. This ensures consistent structure, developer clarity, and suite-wide discoverability.

- Headings must follow Title Case (e.g. `### Architecture Overview`)
- Acronyms and inline code (e.g. `NetSuite`, `tailwindcss`) preserve original casing
- Hyphenated modifiers are capitalized (e.g. `Language-Specific Rules`)

To skip enforcement for a specific heading, add this comment (`<!-- heading-title-case: ignore -->`) directly above it:

```md
<!-- heading-title-case: ignore -->
### `flowbite` → `tailwindcss` Patch
```

This checks all `.md` files across the suite for heading capitalization violations.

---

## Document Blocks

### Callout Blocks

Use callout blocks to highlight important tip, warning, reference, or reminder.

> 📘 **Reference:** See [Callout Blocks Standard](./callout-blocks.md) for details.

### Code Snippets

Use fenced code blocks with language tags for all code snippets to ensure proper syntax highlighting and readability.

---

## Document Sections

A well-structured document body improves readability, scannability, and maintainability.

See [Documentation Sections Standard](documentation-sections.md) for full guidance.

---

## 🧭 Stewardship Callout

See [STYLE.md](../STYLE.md#stewardship-notes) for stewardship guidance.
