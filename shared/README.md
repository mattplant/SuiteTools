# SuiteTools Shared

This is the **shared workspace** for the SuiteTools project.

This workspace centralizes reusable logic—such as validation schemas, utility functions, and shared types—to promote consistency, reduce duplication, and improve maintainability across SuiteTools projects. All modules here are designed to be type-safe, self-contained, and easy to consume from other workspaces.

See the parent directory [README](../README.md) for more information about the SuiteTools project and how to install and use it.

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

## Usage

Import the shared modules as needed. We use barrel files to simplify imports, so you can import directly from the `shared` package without needing to specify subfolders.

For example, the script log assert and parse functions:

```ts
import { assertValidScriptLog, parseScriptLog } from 'shared'
```

## Validation

Helper functions for schema validation.

- **assert functions**: These throw a `ZodError` if the input is invalid, but return `void` on success. Use these when you want to enforce validation and handle errors via exceptions.
- **parse functions**: These return the typed, validated data if successful, or throw an error if validation fails. Use these when you need the parsed result and are comfortable with exceptions.
- **safeParse–based helpers**: These provide non-throwing, diagnostic results. Instead of throwing, they return an object indicating success or failure, along with error details if applicable. Use these for safer, error-tolerant validation flows.

## Design Principles

- **Type Safety First** — All modules are written in TypeScript and validated with Zod.
- **Self-Contained Modules** — Each utility or schema should be independently usable and testable.
- **Minimal Dependencies** — Avoid introducing external dependencies unless absolutely necessary.
- **Clear API Surface** — Exports should be intentional and documented; use barrel files to simplify imports.
- **DX Matters** — All code should be easy to read, test, and onboard into.

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](LICENSE). By using this project, you agree to comply with the terms of the license.
