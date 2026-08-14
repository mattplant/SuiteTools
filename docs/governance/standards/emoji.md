# 🗂️ Emoji Taxonomy Standard

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: September 22, 2025

---

## 🎯 Purpose

Defines the official **SuiteTools Emoji Taxonomy Standard** — the governance rule set for consistent, discoverable emoji usage in documentation.
By assigning each emoji a single, unambiguous meaning, this standard improves scannability, navigation, and long‑term maintainability across the suite.

Standardizing emoji usage:

- **Enhances readability** and **improves scanning** in long or complex documents.
- **Strengthens comprehension** across the suite by reinforcing category meaning.
- **Accelerates onboarding** by giving new maintainers a predictable visual language.

> **Applies to:** All maintainers, authors, and reviewers creating or updating SuiteTools documentation.

---

## 📍 Placement

To keep SuiteTools documentation scannable and predictable, emoji are placed only in defined zones.

| Zone | Purpose | Best Practice |
|------|---------|---------------|
| **Top‑Level&nbsp;Headings** | Immediate visual cue | Always apply taxonomy here. |
| **Section Headings** | Orient readers within long documents | Use only when there’s a distinct match. Avoid over‑tagging sub‑sections. |
| **Callout Blocks** | Draw attention to blocks | Use the relevant icon for the callout type. |
| **Checklists** | Provide quick visual feedback | Use ✅ for required/approved and ❌ for prohibited/rejected. |

 <!-- TODO: create and link Callout Style Guide -->

---

### Placement Rules

- **Positioning:** Place emoji first in the heading, followed by a space, then the title.
- **Quantity:** Use exactly one emoji per heading — no stacking.
- **Meaning:** Follow the **one emoji = one meaning** rule.
- **Exclusions:** Do not use emoji in purely technical references or temporary/WIP notes.
- **Unicode Integrity:** Never alter the emoji’s Unicode form (no skin tone or gender variants).

---

## 🧱 Approved Emojis

The SuiteTools emoji set is organized into scoped clusters for clarity and discoverability.

### Emoji Wall — Scoped Clusters for Suite Clarity

Governance: 🏛️ 🗳️ 📜 🏷️ 🧩 📑 📏 🕵️
Structure: 🌐 📐 🧱 🪆 🤝
Flow: 🛤️ 📅 🔄
Docs & Signal: 📝 📚 🗂️ 📊 📡 🔗
Boundaries: 🟢 🚫 🖼️ 🔒 ⚠️ 🪦
Developer: 🛫 ⚙️ 🛠️ 💻 📦 🧑‍💻 🔍 🔌 🐞 🚀 🧪
Callout: 💡 ⚠️ 📘 📌
Situational: 🎯 💡 ⭐ 📌 📍 🗒️ 🧭 🆕 ⚪ ⏳ ❌ ✅

### Emoji Reference

> **Full Definitions:** See the [Approved Emoji Reference](./emoji-reference.md) for the complete tables, scope, and usage rules for every icon.

---

## Examples

### Script Output

The `/scripts/resetYarn.sh` script output uses taxonomy‑approved icons to signal each step’s purpose.

```sh
#!/usr/bin/env bash
set -euo pipefail

echo "🔄 Enabling Corepack…"
corepack enable

echo "🧹 Removing installed dependencies…"
find . -name node_modules -maxdepth 3 -type d -prune -exec rm -rf {} +

echo "📦 Installing dependencies (with cache check)…"
yarn install --check-cache

echo "🛠 Rebuilding all workspaces…"
yarn workspaces foreach --all run build

echo "✅ Monorepo reset complete — Yarn $(yarn --version)"
```

---

## 🧭 Stewardship Callout

- Keep cross‑links between standards up to date to avoid drift.
