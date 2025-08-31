# SuiteTools Shared

<!-- License badges: keep in sync with LICENSE and LICENSE-DOCS.md -->
[![Source License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPLv3+-blue.svg)](./LICENSE)
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md)
[![Attribution Guide](https://img.shields.io/badge/Attribution%20Formats-docs%2FATTRIBUTION.md-blue)](../docs/ATTRIBUTION.md)

This is the **shared workspace** for the SuiteTools project.

This workspace centralizes reusable logic—such as validation schemas, utility functions, and shared types—to promote consistency, reduce duplication, and improve maintainability across SuiteTools projects. All modules here are designed to be type-safe, self-contained, and easy to consume from other workspaces.

See the parent directory [README](../README.md) for more information about the SuiteTools project and how to install and use it.

---

## Structure

```plaintext
shared/
├── src/           # Shared source code
│   ├── validation/    # Zod schemas and validation helpers
│   └── utils/         # General-purpose utility functions
├── dist/          # Compiled output
├── LICENSE        # The GPL-3.0-or-later license file
├── package.json   # Yarn workspace definition & frontend scripts
└── README.md      # This README file
```

---

## Naming and folder conventions

> TODO: Thinking of moving to this structure:

- **Schemas:** shared/schemas/<domain>.ts — zod schemas by domain.
- **Types:** shared/types/<domain>.ts — inferred from schemas; avoid manual duplication.
- **Errors:** shared/errors/<domain>Errors.ts — error constructors and codes.
- **Helpers:** shared/utils/<category>/ — assertion, result, and small helpers.

---

## Usage

Import the shared modules as needed. We use barrel files to simplify imports, so you can import directly from the `shared` package without needing to specify subfolders.

For example, the script log assert and parse functions:

```ts
import { assertValidScriptLog, parseScriptLog } from 'shared'
```

---

## Validation

Helper functions for schema validation.

- **assert functions**: These throw a `ZodError` if the input is invalid, but return `void` on success. Use these when you want to enforce validation and handle errors via exceptions.
- **parse functions**: These return the typed, validated data if successful, or throw an error if validation fails. Use these when you need the parsed result and are comfortable with exceptions.
- **safeParse–based helpers**: These provide non-throwing, diagnostic results. Instead of throwing, they return an object indicating success or failure, along with error details if applicable. Use these for safer, error-tolerant validation flows.

---

## Design Principles

- **Type Safety First** — All modules are written in TypeScript and validated with Zod.
- **Self-Contained Modules** — Each utility or schema should be independently usable and testable.
- **Minimal Dependencies** — Avoid introducing external dependencies unless absolutely necessary.
- **Clear API Surface** — Exports should be intentional and documented; use barrel files to simplify imports.
- **DX Matters** — All code should be easy to read, test, and onboard into.

> 📚 This workspace is part of the SuiteTools monorepo.
> Licensing and contributor guidelines are defined at the [root README](../README.md).
> Documentation is covered by [CC BY 4.0](../LICENSE-DOCS.md); source code by [GPL-3.0-or-later](../LICENSE).

_Last updated: August 30, 2025_
