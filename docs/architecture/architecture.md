# 📐 SuiteTools Architecture: A Documentation-Led Guide to Clarity

The Structural Blueprint for Predictable, Discoverable, and Sustainable Development

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://gitlab.com/idev-systems/labs/SuiteTools/)

---

## 🎯 Purpose & Scope

This **Architecture Guide** defines the structural blueprint of SuiteTools to ensure long‑term maintainability:

- Suite‑wide architectural principles and rationale
- Layered workspace boundaries and conventions
- Technology stack and shared tooling
- How documentation shapes and enforces architecture

It does **not** cover:

- Detailed governance rules — see [`/docs/governance`](../governance/README.md)
- Implementation‑level API documentation — see the relevant workspace README or module docs

Originally drafted as a steward’s reference during SuiteTools’ evolution, it now serves as a living resource enabling contributors and end‑users to confidently understand, extend, and customize the suite.

> **How to use this guide:** Pair it with governance and workflow docs. For deep‑dives, follow the linked standards and guides in each section.

---

## 🧱 Architecture Design Principles

### Architecture & Structure

SuiteTools is organized into clearly defined layers, each with scoped responsibilities and shared patterns. These principles ensure modularity, discoverability, and architectural clarity.

- **Layered workspace boundaries** — each workspace belongs to a defined layer, enforces scoped contracts, and avoids cross‑contamination.
- **Suite‑wide consistency and composability** — shared utilities, schemas, and tooling ensure a uniform developer experience.
- **Documentation‑led clarity** — favor simple, well‑documented helpers over fragile “magic,” using docs to shape architecture and ensure discoverability.

### Experience & Performance

SuiteTools is designed with both developers and end-users in mind—balancing intuitive interfaces with scalable, NetSuite-aware performance.

- **User‑centric** — prioritize intuitive interfaces and responsive design.
- **Scalable and performance‑conscious** — grow with complexity while remaining efficient within NetSuite’s constraints.

### Quality & Maintainability

SuiteTools enforces trust and long-term maintainability through typed models, schema-driven validation, and transparent governance.

- **Typed, schema‑driven, and validation‑first:** Enforces clarity through reusable models, schema-led flows, and strict boundary validation—ensuring trusted data.
- **Governance by design:** Licensing, attribution, and compliance are modeled clearly and reproducibly.

---

## 🛠️ Technology Stack

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

## 📐 Monorepo Architecture & Workspace Boundaries

SuiteTools is structured as a **modular monorepo** with clearly defined workspaces for frontend, backend, and shared logic.
This structure enables:

- **Shared utilities and tooling** across the suite
- **Explicit boundaries** to prevent accidental coupling
- **Enforcement mechanisms** to preserve modularity and reproducibility

For full workspace layout, benefits, enforcement rules, and allowed import relationships, see the
[Monorepo Architecture & Workspace Boundaries](./monorepo-and-workspace-boundaries.md) document.

---

## 📏 Suite‑Wide Enforcement Patterns

These patterns and enforcement strategies apply across all workspaces to preserve architectural consistency, contributor clarity, and long‑term maintainability.

- **[Validation & types](./validation.md)** — centralized schema strategy with layered transforms and runtime alignment.
- **[Error Handling and Taxonomy](./error-handling.md)** — shared taxonomy, error codes, and mapping utilities for consistent reporting.
- **[Linting](../governance/standards/linting-standards.md)** — enforced boundaries, type‑safety expectations, and formatting standards.
- **[Dependency rules](./monorepo-and-workspace-boundaries.md)** — workspace‑level import constraints enforced via tooling (e.g., custom lint rules).

### Linting

Linting is wired into our suite-wide tooling strategy:

- **Flat ESLint configs** support layered rule composition and override ergonomics.
- **Workspace-specific extensions** allow domain-aware enforcement where needed.
- **Custom rules** codify architecture: blocking cross-layer imports, ensuring validation symmetry, and guiding type usage.

For detailed rule breakdowns and config practices, see [docs/linting.md](../guides/linting.md).

---

## 📊 Application Data & Control Flow

SuiteTools follows a **layered data flow** pattern to ensure clear separation of concerns, predictable transformations, and trusted data at every stage.

1. **Inbound:** Requests enter backend, validated at the transport layer, converted to domain models.
2. **Core logic:** Services operate on domain-safe types; no IO or validation here.
3. **Outbound:** Responses mapped from domain → transport; validation ensures shape guarantees.
4. **Frontend:** Adapters map transport → view models; components consume view-safe types.

Prefer pure functions for transforms. Keep IO (HTTP, NetSuite API) at the edges.
<!-- TODO: When this section grows, put it in own data-flow.md and be linked here like the other deep‑dives. -->

---

## 🧪 Validation & Type Safety

SuiteTools applies a **suite‑wide validation and type strategy** to ensure consistent, layered enforcement across all workspaces.

- **Schemas** — defined once in `shared/schema` using Zod for both runtime validation and compile‑time inference.
- **Layering** — transport, domain, and view schemas keep concerns isolated and transformations explicit.
- **Assertion helpers** — centralized in `shared/schema` to provide ergonomic narrowing and consistent error handling.

For full conventions, helper APIs, examples, and error taxonomy, see the
[SuiteTools Validation & Type Safety Guide](./validation.md).

---

## 🐞 Error Handling

SuiteTools applies a **centralized error strategy** for predictable behavior and safe recovery across all workspaces.

- Errors flow through `handleError()` from top‑level try/catch blocks and global hooks.
- Development surfaces overlays; production prefers silent logging and rethrowing.
- Recovery is intentional — no double‑handling.

For full patterns, utilities, and error taxonomy, see the [Error Handling and Taxonomy](../architecture/error-handling-architecture.md).

---

## 🛠️ Build & Release

SuiteTools follows a **suite‑wide build and release strategy** to ensure reproducible outputs, predictable delivery, and clear communication of changes.

- **Build** — per‑workspace builds, with `shared/` consumed by both frontend and backend.
- **CI gates** — GitLab CI runs typecheck, lint, and test (merge-blocking); optional boundary checks later. See the build & release guide.
- **Release** — consistent versioning, changelogs, and migration notes for breaking changes.

For full principles, environment handling, build steps, and release process, see the
[SuiteTools Build & Release Guide](../guides/build-release.md).

---

## 🗒️ Stewardship Notes

- This guide is a living reference — update it as the architecture evolves.
- Keep examples and diagrams in sync with the actual codebase to maintain trust.
- Use this guide alongside governance and workflow docs to ensure changes remain predictable, discoverable, and sustainable.
