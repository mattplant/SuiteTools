# SuiteTools Architecture: A Documentation-Led Guide to Clarity

_The Structural Blueprint for Predictable, Discoverable, and Sustainable Development_

_Last updated: September 1, 2025_

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

This guide defines the architecture of SuiteTools — its structure, rationale, and the suite‑wide principles and conventions that ensure long‑term maintainability.

Originally drafted as a personal reference during SuiteTools’ evolution, it now serves as a living resource enabling end‑users to confidently understand, extend, and customize the suite.

## License

SuiteTools is released under a dual‑license model to ensure both clarity and flexibility in use:

- **Source code** — Licensed under [GPL‑3.0‑or‑later](../../LICENSE).
- **Documentation** — Licensed under [CC BY 4.0](../../LICENSE-DOCS.md), unless otherwise noted.

By using, modifying, or redistributing this project, you agree to comply with the applicable license terms.
For full details, see the [LICENSE](../../LICENSE) and [LICENSE‑DOCS.md](../../LICENSE-DOCS.md) files.

---

## Architecture Design Principles

SuiteTools is built on seven architectural principles that guide every workspace, module, and contributor experience. From layered boundaries to reproducible governance, these foundations ensure clarity, trust, and long-term maintainability.

### Architecture & Structure

SuiteTools is organized into clearly defined layers, each with scoped responsibilities and shared patterns. These principles ensure modularity, discoverability, and architectural clarity.

- **Layered workspace boundaries:** Each workspace belongs to a clear architectural layer, enforces scoped contracts, and avoids cross-contamination—centralizing shared logic where appropriate.
- **Suite-wide consistency and composability:** Small, reusable utilities, shared schemas, and unified tooling ensure modularity, clarity, and a uniform developer experience across workspaces.
- **Documentation-led clarity over cleverness:** SuiteTools favors simple, well-documented helpers over fragile “magic,” using docs to shape architecture and ensure discoverability.

### Experience & Performance

SuiteTools is designed with both developers and end-users in mind—balancing intuitive interfaces with scalable, NetSuite-aware performance.

- **User-centric:** Prioritizes user experience with intuitive interfaces and responsive design.
- **Scalable and performance‑conscious:** SuiteTools is designed to grow with complexity while remaining efficient within NetSuite’s constraints.

### Quality & Maintainability

SuiteTools enforces trust and long-term maintainability through typed models, schema-driven validation, and transparent governance.

- **Typed, schema‑driven, and validation‑first:** Enforces clarity through reusable models, schema-led flows, and strict boundary validation—ensuring trusted data.
- **Governance by design:** Licensing, attribution, and compliance are modeled clearly and reproducibly.

---

## Technology stack

- Suite-wide
  - **TypeScript** as the language of record.
  - **Yarn** for monorepo management, dependency resolution, and workspace orchestration.
  - **ESLint** for linting with flat config for suite-wide and workspace-specific rules.
  - **Prettier** for consistent code formatting.
  - **Git** version control, with a focus on clear commit messages onto issue/feature branches.
  - **Github** for code hosting, issue tracking
  - **VS Code** as the primary development environment with recommended extensions and settings.
- Frontend
  - **React** for building the user interface.
  - **Flowbite-React** for UI components and consistent styling.
  - **Vite** for fast development and optimized builds.
- Backend
  - **SDF** (NetSuite's SuiteCloud Development Framework) for NetSuite deployments.
  - **SuiteScript 2.1** for backend services.
- Shared
  - **Zod** for runtime validation and type inference.

---

## Suite-Wide Enforcement Patterns

Certain patterns and enforcement strategies apply across all workspaces to preserve architectural consistency, contributor clarity, and long-term maintainability.

- **Validation and types:** Centralized schema strategy with layered transforms and runtime alignment.
- **Error modeling:** Shared taxonomy, error codes, and mapping utilities for consistent reporting.
- **Linting and conventions:** Enforced boundaries, type safety expectations, and formatting standards.
- TODO: **Dependency rules:** Workspace-level import constraints enforced via tooling (e.g. custom lint rules).

---

## Monorepo architecture

SuiteTools is organized as a monorepo—housing multiple related workspaces within a single repository. This architecture supports clear boundaries, shared utilities, and consistent tooling across frontend, backend, and cross-cutting logic. It also enables suite-wide patterns to be defined once, then reused and enforced across projects.

### Workspaces

- **frontend/**
  - React single-page application (SPA) built with TypeScript and Flowbite-React components.
- **backend/**
  - Owns backend integration with NetSuite via API and HTTP handlers.
- **shared/**
  - Cross-cutting types, Zod schemas, assertion helpers and utility functions.

#### Benefits of Workspaces

- **Shared dependencies** reduce duplication and improve install performance
- **Consistent tooling** across packages (e.g. linting, formatting, testing)
- **Unified workflows** enable commands like `yarn workspaces foreach` or `yarn workspaces focus`
- **Explicit boundaries** prevent accidental coupling and improve contributor clarity

#### Workspace Boundary Enforcement

SuiteTools enforces strict workspace boundaries to preserve modularity, reproducibility, and long-term maintainability. This prevents:

- ❌ Accidental hoisting of undeclared dependencies
- ❌ Cross-workspace leakage of dev-only tools
- ❌ Hidden coupling between unrelated packages

##### Why It Matters

| ✅ Benefit                            | 📘 Description                                                                 |
|--------------------------------------|--------------------------------------------------------------------------------|
| Declared Dependency Usage            | Each workspace must explicitly declare its runtime and peer dependencies       |
| Isolation of Dev Tools               | Dev-only tools (e.g. test runners, linters) must not leak into runtime paths   |
| Clear Contributor Expectations       | Onboarding is easier when dependency intent is explicit                        |
| Reproducible Builds                  | CI failures are easier to trace when boundaries are enforced                   |

### Enforcement Mechanisms

These mechanisms are implemented and must be followed for every contribution:

| Mechanism                  | Description                                                                 |
|---------------------------|-----------------------------------------------------------------------------|
| Plug’n’Play (`.pnp.cjs`)  | Enforces resolution only through declared dependencies                      |
| `dependencies:` hygiene   | Contributors must declare all runtime deps in their own `package.json`      |
| `peerDependencies:` rules | Used for shared interfaces or plugin-style relationships                    |
| `devDependencies:` scope  | Dev-only tools must not leak into runtime or other workspaces               |
| `yarn constraints.pro`    | Custom rules defining allowed workspace access                              |

#### Workspace Boundaries

Maintaining these boundaries protects layering, reduces cognitive load for contributors, and ensures that architectural concerns stay localized and predictable.

- **No direct `frontend/` ↔ `backend/` imports.**
  These workspaces must remain decoupled—UI and service layers communicate exclusively via `shared/`. This separation protects layering, prevents cross-contamination, and enables predictable ownership.
- **`shared/` is upstream-only and self-contained.**
  As the coordination surface for types, schemas, utilities, and primitives, `shared/` must not import from `frontend/` or `backend/`. This ensures it remains portable, stable, and free of runtime or platform assumptions.

| Workspace   | Can Import From     | Cannot Import From           |
|-------------|---------------------|-------------------------------|
| `frontend/` | `shared/`            | `backend/`                    |
| `backend/`  | `shared/`            | `frontend/`                   |
| `shared/`   | (none internally)    | `frontend/`, `backend/`       |

> TODO: To preserve suite-wide clarity and layered modularity, strict import boundaries I plan to enforce via TypeScript path aliases and ESLint rules that will surface violations during development.

#### Workspace Management Details

SuiteTools uses **Yarn Berry** (v3+) with **Plug’n’Play** and **workspaces** to manage its modular monorepo and streamline development workflows.

For detailed yarn usage and configuration, see [Yarn Configuration and Usage](../guides/yarn.md).

---

## Linting

Linting is wired into our suite-wide tooling strategy:

- **Flat ESLint configs** support layered rule composition and override ergonomics.
- **Workspace-specific extensions** allow domain-aware enforcement where needed.
- **Custom rules** codify architecture: blocking cross-layer imports, ensuring validation symmetry, and guiding type usage.

For detailed rule breakdowns and config practices, see [docs/linting.md](../guides/linting.md).

---

## Application Data & Control Flow

1. **Inbound:** Requests enter backend, validated at the transport layer, converted to domain models.
2. **Core logic:** Services operate on domain-safe types; no IO or validation here.
3. **Outbound:** Responses mapped from domain → transport; validation ensures shape guarantees.
4. **Frontend:** Adapters map transport → view models; components consume view-safe types.

Prefer pure functions for transforms. Keep IO (HTTP, NetSuite API) at the edges.

---

## Validation and Type Strategy

SuiteTools enforces consistent, layered validation and type safety across packages. This section documents schemas, assertion helpers, and error handling conventions.

> TODO: Create [validation.md](./validation.md) to document including:
>
>- **Schemas:** Use Zod for runtime validation; schemas live in shared/validation.
>   - **Single source of truth:** Schemas live in shared/, with typed inference for compile-time parity.
>- **Types:** Infer TypeScript types from schemas to ensure compile-time safety.
>- **Assertions:** Use shared assertion helpers to narrow types without manual duplication.
>   - Shared assertion helpers narrow types without consumer annotations.
>- **Layering:** Transport schemas (external), Domain schemas (internal), View schemas (UI).
>
> This should include:
>
> - conventions and helper APIs
> - examples of usage
> - error handling strategy
>   - including error codes and messages
>
>And ideas from below.

### Suite-wide validation and schema architecture

Schemas live in `shared/validation`, providing a single source of truth for both runtime validation and compile-time inference via Zod.

### Schema Design

Schemas live in `shared/validation`, providing a single source of truth for both runtime validation and compile-time inference via Zod.

### Type and schema layering

- **Transport (external):** Request/response shapes, webhook payloads, NetSuite integration edges.
- **Domain (internal):** Invariant-preserving models used in service logic.
- **View (frontend):** UI-ready shapes with render-friendly nullability/optionality.

### Guidelines

- Infer types from schemas to avoid duplication.
- Keep transforms named and local to their layer, e.g., toDomainCustomer, toTransportCustomer.
- Do not let transport-specific nullability leak into domain models.

### Assertion and validation helpers

Goals:

- Provide a single place to assert and narrow types ergonomically.
- Encode consistent error construction and messaging.

Typical helpers (document exact signatures in validation.md):

- assertValid(schema, value): throws ValidationError on failure; narrows on success.
- isValid(schema, value): boolean predicate for guards.
- parseOr(schema, value, fallback): returns typed value or a fallback.

Keep these helpers in shared so both backend and frontend rely on the same behavior.

Shared helpers ensure ergonomic validation and narrowing while enforcing consistent error behavior. These live in `shared/assertion`.

### Typical APIs

```ts
assertValid(schema, value)     // throws ValidationError on failure; returns typed value
isValid(schema, value)         // returns boolean
parseOr(schema, value, fallback) // returns typed value or fallback
```

---

## Error Handling

SuiteTools applies a centralized error strategy for predictable behavior and safe recovery across all workspaces.

- Errors flow through handleError() from top-level try/catch blocks and global hooks.
- Development surfaces overlays; production prefers silent logging and rethrowing.
- Recovery is intentional—no double-handling.

See the [Error Handling Guide](./error-handling.md) for patterns and utilities.

---

## Build and Release

> TODO: Create [build.md](./build.md) to document the build and release strategy, including the following initial ideas.

This section documents the build and release.

### Principles

- **Build:** Per-workspace builds; shared is consumed by frontend/backend.
- **CI gates:** Typecheck, lint, test, build; optionally boundary checks.
- **Release:** Consistent versioning; document breaking changes and migration notes.

### Configuration and environment

- Read environment variables only at boundaries (backend startup or handler level).
  - These are NetSuite specific, not standard Node.js environment variables.
- Centralize configuration parsing in backend/config (validated with schemas).
- Pass typed config explicitly.

### Build Process

- Each workspace builds independently via configured package scripts.
- `shared/` outputs are consumed by both frontend and backend layers—ensure schema and helper compatibility.
- Use TypeScript path maps to enforce workspace boundaries and avoid accidental cross-references.
- Downstream consumers (e.g. frontend) should never mutate `shared/` types or helpers.

### Release Process

SuiteTools uses consistent versioning and changelog documentation:

- Versioning follows [SemVer](https://semver.org/) per suite-wide tagging.
- Breaking changes must document impact and migration path in `CHANGELOG.md`.
- Consumers are notified through release notes and update summaries.
