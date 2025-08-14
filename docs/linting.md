# Linting with SuiteTools

This document outlines the linting stack, practices, and rule structure used across SuiteTools to ensure consistency, architectural integrity, and scalable ergonomics.

Linting is central to our development workflow. It prevents errors early, enforces boundaries, and improves developer experience (DX) while reducing total cost of ownership (TCO) across the suite.

---

## Overview: Suite-Wide Linting Strategy

SuiteTools enforces linting via:

- **ESLint** + workspace-scoped rules for correctness and hygiene
- **Flat ESLint Configs** for global rule segmentation and local override clarity
- **Custom ESLint rules** to reinforce domain boundaries and suite ergonomics
- **TypeScript path maps** and resolvers to preserve import integrity
- **Prettier** for formatting standardization beyond ESLint’s reach

This setup is modular and extensible: suite-wide rules provide global consistency, while workspace-specific overrides allow for domain-specific flexibility.

---

## Linting Tool Matrix

A breakdown of each tool and its implementation role within SuiteTools:

- **ESLint**
  - Linting engine for TypeScript workflows
  - Supports type-aware rules via `@typescript-eslint`
  - Detects errors, enforces structure, and blocks unsafe patterns
- **Flat Config (ESLint v9+)**
  - Core configuration strategy across the suite
  - Modularizes setup for shared and workspace-specific rules
  - Enables ergonomic override composition
- **Prettier**
  - Enforces consistent formatting (quotes, spacing, semicolons, commas)
  - Complements ESLint by standardizing stylistic surface area

### New ESLint Plugin Installation Guidelines

To ensure consistent tooling across the SuiteTools monorepo, **all ESLint plugins must be installed from the monorepo root**, even if they’re primarily used in a single workspace (e.g. `backend` or `frontend`).

This guarantees:

- 🔧 Centralized dependency management via root `package.json`
- 🧵 Proper plugin resolution by shared ESLint configs
- 🚀 Cleaner CI/CD environments and reproducible installs

### 🛠 How to install

If your are not in the project root use the `-W` flag to target the **workspace root**:

```bash
yarn add -W -D eslint-plugin-jsdoc
yarn add -W -D eslint-plugin-suitescript
```

### Why this matters

Local installs inside workspaces (without the `-W` flag) can lead to:

- Redundant dependency trees
- ESLint failing to resolve plugins correctly
- Confusion during onboarding or CI setup

---

## Configuration Strategy

Shared and workspace-specific rule composition ensures scalable enforcement:

- Shared rules promote suite-wide consistency
- Workspace overrides allow domain-specific flexibility
- Custom rules encode architectural boundaries
- TypeScript integration enables ergonomic enforcement

---

## Enforcement Practices

Core practices maintain architectural clarity and code hygiene across the suite.

### Rule Tiers

- **Enforced Rules**
  Wired into ESLint and CI pipelines. Blocking violations must be resolved before commits and PRs proceed.

- **Advisory Conventions**
  Guide preferred patterns and best practices. May surface warnings but don't block progress.

---

## Rule Categories

Organized into thematic groups for clarity and actionability.

> ⚠️ **Work in Progress**
> This is a first draft and it is currently aspirational.

### Code Correctness

Catch runtime risks and enforce safer authoring:

- `no-undef` – Catch undeclared variables
- `no-unused-vars` – Eliminate dead bindings
- `no-explicit-any` – Prevent structural holes in type safety
- `prefer-const`, `no-var` – Ensure predictable scoping

> TODO: Review `no-unsafe-assignment`, `consistent-type-exports`, `prefer-readonly`

### TypeScript Consistency

Modeling and mutation rules for predictability:

- `consistent-type-exports` – Enforce explicit and stable type exports
- `prefer-readonly` – Guide safe object mutation policies
- `no-unsafe-assignment` – Avoid widening from untyped inputs

### Type Safety Ergonomics

Tighten type constraints without sacrificing clarity:

- Use branded types for opaque identifiers
- Ban unsafe casts (`as unknown as`) unless justified
- Avoid ambiguous unions in helpers; document overloads explicitly

### Workspace Boundaries

Preserve modular clarity and enforce layering:

- `no-restricted-imports` – Block cross-workspace imports (except `shared/`)
- `import/no-internal-modules` – Enforce public API usage
- TypeScript alias hygiene with ESLint resolver

### Assertion and Schema Usage

Promote validation symmetry and error modeling:

- Shared assertion helpers preferred over ad hoc usage
- Error codes must come from the registry (`ValidationError`)
- Avoid Zod leakage to user-facing surfaces
- Preserve transform symmetry across transport/domain/view

### Documentation and Exports

Public-facing surfaces must be clear and discoverable:

- Require JSDoc for exports and helpers
- Ban unused exports; enforce explicit boundaries
- Require descriptions for error codes and assertions
- Use code comments for non-obvious logic
- Avoid anonymous default exports unless conceptually singular

### Formatting and Style

Reduce review friction and cognitive load:

- Prettier or ESLint-equivalent rules: quotes, spacing, semicolons
- `import/order` – Grouped imports
- File naming conventions: kebab-case, domain-oriented folders

---

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](../LICENSE). By using this project, you agree to comply with the terms of the license.
