# SuiteTools Architecture: A Documentation-Led Guide to Clarity

This document outlines SuiteTools’ architecture—its structure, rationale, and the principles and conventions that keep it maintainable.

Originally drafted as my personal reference for building and evolving SuiteTools, it now also serves as a resource for other end-users to confidently understand and customize SuiteTools.

SuiteTools is licensed GPL-3.0-or-later. See [LICENSE file](../LICENSE) for terms on use, modification, and redistribution.

---

## Core design principles

- **Types-first architecture:** Models defined once, reused everywhere. Runtime validation matches types.
- **Scalable:** Designed to handle growing complexity as new features and integrations are added.
- **User-centric:** Prioritizes user experience with intuitive interfaces and responsive design.
- **Layered modularity:** Each workspace fits into a clear architectural layer, with shared logic centralized and responsibilities scoped.
- **Composable building blocks:** Small, reusable utilities over one-off implementations.
- **Performance-conscious:** Optimized for NetSuite’s constraints, with efficient data handling and minimal API calls.
- **Validate aggressively:** Validate at boundaries; keep core logic on trusted data.
- **Cross-workspace consistency:** Shared types, validation schemas, and utility functions to avoid duplication and ensure uniformity.
- **Consistent tooling:** Shared linting, formatting, and build tools across workspaces.
- **Developer clarity over cleverness:** Prefer simple, documented helpers to fragile “magic.”
- **Documentation-led clarity:** Written documentation shapes architectural decisions, enforces clarity across workspaces, and supports core design principles.

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

## Suite-wide concerns

Certain patterns and practices are applied across all workspaces to preserve consistency and maintainability:

- **Validation and types:** Centralized schema strategy with layered transforms
- **Error modeling:** Shared taxonomy, codes, and mapping strategy
- **Linting and conventions:** Enforced boundaries and type safety expectations
- TODO: **Dependency rules:** Workspace-level import constraints with tooling enforcement

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

> TODO: To preserve suite-wide clarity and layered modularity, strict import boundaries I plan to enforce via  TypeScript path aliases and ESLint rules that will surface violations during development.

#### Workspace Management Details

SuiteTools uses **Yarn Berry** (v3+) with **Plug’n’Play** and **workspaces** to manage its modular monorepo and streamline development workflows.

For detailed yarn usage and configuration, see [docs/yarn.md](./yarn.md).

---

## Linting

Linting is wired into our suite-wide tooling strategy:

- **Flat ESLint configs** support layered rule composition and override ergonomics.
- **Workspace-specific extensions** allow domain-aware enforcement where needed.
- **Custom rules** codify architecture: blocking cross-layer imports, ensuring validation symmetry, and guiding type usage.

For detailed rule breakdowns and config practices, see [docs/linting.md](./linting.md).

---

## Data and control flow

1. **Inbound:** Requests enter backend, validated at the transport layer, converted to domain models.
2. **Core logic:** Services operate on domain-safe types; no IO or validation here.
3. **Outbound:** Responses mapped from domain → transport; validation ensures shape guarantees.
4. **Frontend:** Adapters map transport → view models; components consume view-safe types.

Prefer pure functions for transforms. Keep IO (HTTP, NetSuite API) at the edges.

---

## Validation and Type Strategy

SuiteTools enforces consistent, layered validation and type safety across packages. This section documents schemas, assertion helpers, and error handling conventions.

> TODO: Create [validation.md](./valiation.md) to document including:
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

## Error modeling and handling

> TODO: Establish a small, namespaced error code taxonomy and expand intentionally.
> Below are some initial ideas.

SuiteTools adopts a layered, code-driven error strategy that balances developer ergonomics, UX clarity, and backend stability.

This section outlines the error taxonomy, mapping conventions, and preferred patterns for core logic and frontend messaging.

### Error Design Principles

- **Error taxonomy:** DomainError, ValidationError, IntegrationError with stable codes.
  - Use ZodError for validation failures; map to ValidationError with stable codes.
- **Mapping:** Backend maps errors → HTTP shape; frontend maps codes → UX messages.
  - Backend maps internal errors to HTTP responses with stable codes and a safe message.
- **Non-throwing paths:** Prefer Result-like returns in core logic; throw only at boundaries.
  - Frontend converts codes to user-facing messages (do not display raw internal details).

### Error Taxonomy

Errors are modeled explicitly by category and namespaced with stable codes for predictability:

| Type               | Namespace | Sample Codes                             |
|--------------------|-----------|------------------------------------------|
| ValidationError    | `VAL.`    | `VAL.MISSING_FIELD`, `VAL.INVALID_DATE`, `VAL.INVALID_SHAPE` |
| DomainError        | `DOM.`    | `DOM.UNEXPECTED_STATE`, `DOM.BIZ_RULE_VIOLATION` |
| IntegrationError   | `INT.`    | `INT.NETSUITE_TIMEOUT`, `INT.BAD_PAYLOAD` |

Error codes should be safe to log and serialize.

>TODO: Expand error code registry intentionally over time—maintain discoverability and semantic clarity.

### Validation Mapping

Validation errors are backed by Zod and mapped from `ZodError` to stable, structured formats.
This ensures consistent error handling across the stack while preserving the original validation context.

```ts
function mapZodError(error: ZodError): ValidationError {
  return {
    code: 'VAL.INVALID_SHAPE',
    message: 'Payload does not match expected format',
    details: error.issues, // logged only; not shown to users
  };
}
```

### Error Shape

All errors map to a consistent internal format:

```ts
interface SuiteError {
  code: string;        // stable namespaced identifier
  message: string;     // safe, consumable message
  details?: unknown;   // optional debug payload (never sent to users)
}
```

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

---

## Related documents

- [docs/installation.md](./installation.md) — setup and deployment
- [docs/customizing.md](./customizing.md) — extension points and patterns
- [docs/linting.md](./linting.md) - tooling overview, config composition, and enforcement strategy
- [docs/vscode.md](./vscode.md) — editor setup and recommended tasks
- > TODO: [CHANGELOG.md](../CHANGELOG.md) — suite-wide changelog
- > TODO: docs/validation.md — schemas, assertions, and error handling strategy

---

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](../LICENSE). By using this project, you agree to comply with the terms of the license.
