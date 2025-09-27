# 📄 Documentation Standard

> Part of the SuiteTools governance set.
> See [/docs/governance](./README.md) for related policies and resources.

Last updated: September 22, 2025

---

## 🎯 Purpose

This standard with its supporting documents defines the required document structure for all SuiteTools documentation files.
It ensures every document — whether a major public entry point or a small internal guide — begins with clear context, scope, and traceability.

---

## 📝 Documentation Style

### Documentation Quick‑Scan Reference

| Aspect     | Rule                                |
|------------|-------------------------------------|
| Tone       | Empathetic, direct, active voice    |
| Tense      | Present                             |
| Headings   | ATX (`#`, `##`, `###`), single `#` for title |
| Paragraphs | One concept per paragraph           |
| Line length| 80–100 chars                        |
| Links      | Canonical sources only              |

### Voice & Tone

- **Empathetic and direct** — write for the next developer.
- Prefer **active voice** and **present tense** for clarity.
- **Clear, concise language** — avoid jargon and unnecessary complexity.

### Structure

- Progressive disclosure — start with the big picture, then drill down
- Keep sections **scannable**: short paragraphs, bullet lists, and code examples.
- One concept per paragraph; one action per sentence where possible.

### Markdown Conventions

- Use **ATX headings** (`#`, `##`, `###`) with a single `#` for the document title.
- List style:
  - Use `-` for unordered lists.
  - Use numbers (`1.`, `2.`, etc.) for ordered lists.
  - Indent nested lists by two spaces.
- Tables:
  - Use pipes (`|`) and dashes (`-`) to create tables.
  - Align columns with spaces for readability in raw Markdown.
- Code blocks:
  - Use triple backticks (```) for fenced code blocks.
  - Specify the language for syntax highlighting (e.g., ```ts for TypeScript).
- Use **semantic Markdown** — bold for emphasis, italics for nuance, code spans for identifiers.

### Link & Reference

- Link to **canonical sources** only:
  - Official standards bodies (e.g., W3C, ECMA)
  - Upstream project documentation
  - Internal governance artifacts in `docs/governance`
- Use relative links for internal references within the monorepo.

---

## Document Sections

### Header

See [Documentation Header Standard](documentation-header.md) for the required header structure and templates.

## Body

See [Documentation Body Standard](documentation-body.md) for required body structure and style guidelines.

## Footer

See [Documentation Footer Standard](documentation-footer.md) for required footer structure and style guidelines.

---

## 🧭 Stewardship Callout

See [STYLE.md](../STYLE.md#-stewardship-notes) for stewardship guidance.
