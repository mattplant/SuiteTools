# 🗂 Callout Block Standard

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: September 22, 2025

---

## 🎯 Purpose

This standard defines the **approved callout block types, emoji, tone, and formatting** for SuiteTools documentation.
It ensures callouts are **predictable, scannable, and consistent** across all docs, reinforcing suite‑wide clarity.

---

## 📐 General Rules

- **Placement** — Callouts appear **immediately after** the paragraph or heading they relate to.
- **Length** — Keep to **1–3 short sentences**. Avoid long paragraphs.
- **Tone** — Neutral, professional, and concise — no filler, no “just” or “simply.”
- **Emoji** — Always at the start of the first line, followed by a single space.
- **Formatting** — Use `>` blockquote syntax in Markdown.
- **Punctuation** — End with a period unless the callout is a list.
- **Links** — Inline links are allowed, but keep them minimal and relevant.

---

## ✅ Quick Reference Table

| Emoji | Label     | Purpose                                         | Tone                    | Format Keyword   |
|-------|-----------|-------------------------------------------------|-------------------------|------------------|
| 💡    | Tip       | Best practices, shortcuts, adoption guidance    | Encouraging, actionable | `**Tip:**`       |
| ⚠️    | Warning   | Risks, breaking changes, irreversible actions   | Direct, urgent          | `**Warning:**`   |
| 📘    | Reference | Related docs, standards, authoritative sources  | Informative, neutral    | `**Reference:**` |
| 📌    | Reminder  | Recurring rules, governance conventions         | Firm, friendly          | `**Reminder:**`  |

---

## 🧩 Approved Callout Types

### 💡 Tip

**Purpose** — Share best practices, shortcuts, or adoption guidance.
**Tone** — Encouraging, actionable, and benefit‑oriented.

**Format**:

```markdown
> 💡 **Tip:** Phrase in active voice, focusing on the benefit to the reader.
```

**Example**:

```markdown
> 💡 **Tip:** Use relative links for internal references to ensure they work in forks.
```

### ⚠️ Warning

**Purpose** — Flag potential risks, breaking changes, or irreversible actions.
**Tone** — Direct, unambiguous, and urgent without being alarmist.

**Format**:

```markdown
> ⚠️ **Warning:** State the risk first, then the mitigation.
```

### 📘 Reference

**Purpose** — Point to related documentation, standards, or authoritative sources. Tone — Informative and neutral.
**Tone** — Informative and neutral.

**Format**:

```markdown
> 📘 **Reference:** Link to the related resource with a short description.
```

**Example**:

```markdown
> 📘 **Reference:** See [Documentation Header Standard](documentation-header.md) for required header structure.
  ```

### 📌 Reminder

**Purpose** — Reinforce important recurring rules, governance requirements, or suite‑wide conventions.
**Tone** — Firm but friendly; assumes the reader is already aware but benefits from reinforcement.

**Format**:

```markdown
> 📌 **Reminder:** State the rule or convention clearly.
```

**Example**:

```markdown
> 📌 **Reminder:** Always update the “Last updated” date in the header when making substantive changes.
```

<!-- TODO: Do we need to document other blocks like Usage Notes? -->
<!-- > **Usage Notes:**
>
> - Always include all header elements in the order shown in the template.
> - The “Last updated” date must reflect the most recent substantive change to the document.
> - The horizontal rule (`---`) is required to visually separate the header from the body. -->

---

## 🧭 Stewardship Callout

- Callouts are **structural primitives** in SuiteTools docs — treat them as part of the suite’s visual language.
- Do not invent new emoji types without governance approval.
- When in doubt, choose the **most restrictive** callout type that fits — e.g., use ⚠️ over 💡 if there’s any risk involved.
