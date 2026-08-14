# SuiteTools — Shared Workspace

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://gitlab.com/idev-systems/labs/SuiteTools/)

---

## 🎯 Purpose & Scope

This workspace centralizes reusable logic — validation schemas, utility functions, and shared types — to promote consistency, reduce duplication, and improve maintainability across SuiteTools workspaces.

**Out of scope:** any code that is backend‑only, frontend‑only, or tied to a specific deployment target.

See the parent directory [README](../README.md) for more information about the SuiteTools project and how to install and use it.

---

## 🧱 Design Principles

<!-- TODO: check with core and determine if having focused ones here adds value, or if these should be removed. -->

- **Type Safety First** — All modules are written in TypeScript and validated with Zod.
- **Self‑Contained Modules** — Each utility or schema is independently usable and testable.
- **Minimal Dependencies** — Avoid introducing external dependencies unless absolutely necessary.
- **Clear API Surface** — Exports should be intentional and documented; use barrel files to simplify imports.
- **DX Matters** — Code should be easy to read, test, and onboard into.

---

## 📐 Structure

```plaintext
shared/
├── dist/          # Compiled output
├── src/           # Shared source code
│   ├── api/          # API request/response types and utilities
│   ├── errors/       # Shared error types and helpers
│   ├── schema/       # Zod schemas and validation helpers
│   └── typeGuards/   # TypeScript type guard functions
├── .gitignore     # Git ignore file for frontend
├── LICENSE        # GPL-3.0-or-later
├── package.json   # Yarn workspace definition & scripts
└── README.md      # This README file
```

---

## 📂 Naming & Folder Conventions

All modules here are designed to be **type‑safe**, **self‑contained**, and **easy to consume** from other workspaces.

> - **api/** — Public‑facing API utilities, error constructors, and code mappings.
> - **errors/** — Shared error types, codes, and lifecycle helpers for consistent handling.
> - **schema/** — Zod schemas organized by domain; define and validate data structures. <!-- TODO: change to schemas -->
> - **typeGuards/** — TypeScript type guard functions for runtime type narrowing. <!-- TODO: change to type-guards -->

---

## 📦 Usage

Import shared modules via barrel files to simplify imports:

```ts
import { assertValidScriptLog, parseScriptLog } from 'shared'
```

---

## ✅ Validation Helpers

- **assert functions** — Throw a `ZodError` if the input is invalid; return `void` on success.
- **parse functions** — Return typed, validated data if successful, or throw an error if validation fails.
- **safeParse helpers** — Return `{ success, data?, error? }` without throwing, for safer, error‑tolerant flows.

---

## 📦 Dependencies

This workspace requires the following tools and libraries:

- **Yarn (Berry)** — v4.9.2 (workspace and package manager)

### Runtime Dependencies

Installed via `package.json`:

- **Zod** — ^4.0.14 (schema validation and type‑safe parsing)

### Development Dependencies

Installed via `package.json`:

- **TypeScript** — provided at the monorepo root (used for builds and type checking)

---

## 🗒️ Stewardship Notes

- Update when Zod or TypeScript versions change
- Review annually for schema and utility coverage
