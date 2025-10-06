
# SuiteTools Validation & Type Safety

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

This document defines SuiteTools’ suite‑wide approach to **runtime validation** and **type safety**, ensuring consistent, layered enforcement across all workspaces.

It covers:

- Schema design and location
- Type inference strategy
- Assertion helpers
- Layering conventions
- Error handling patterns

It does **not** cover:

- Governance for dependency usage — see [Yarn Dependencies](../governance/standards/yarn-dependencies.md)

---

## 🧱 Suite‑Wide Validation & Schema Architecture

All schemas live in `shared/schema`, providing a **single source of truth** for:

- **Runtime validation** — via [Zod](https://github.com/colinhacks/zod)
- **Compile‑time inference** — TypeScript types inferred directly from schemas

This ensures parity between runtime and compile‑time contracts.

---

## 📐 Schema Design

- **Single source of truth** — define schemas once in `shared/schema`
- **Type inference** — use `z.infer<typeof Schema>` to generate TypeScript types
- **No duplication** — never manually re‑declare types already represented by a schema

### Type & Schema Layering

Schemas are organized into three layers:

| Layer       | Purpose                                                        | Examples |
|-------------|----------------------------------------------------------------|----------|
| **Transport** (external) | Request/response shapes, webhook payloads, NetSuite integration edges | `CustomerTransportSchema` |
| **Domain** (internal)    | Invariant‑preserving models used in service logic | `CustomerDomainSchema` |
| **View** (frontend)      | UI‑ready shapes with render‑friendly nullability/optionality | `CustomerViewSchema` |

**Guidelines:**

- Keep transforms named and local to their layer, e.g., `toDomainCustomer`, `toTransportCustomer`
- Do not let transport‑specific nullability leak into domain models

---

## 🛠️ Assertion & Validation Helpers

Helpers in `shared/assertion` provide ergonomic, consistent validation and narrowing across backend and frontend.

**Goals:**

- Centralize assertion logic
- Enforce consistent error construction and messaging
- Avoid consumer‑side duplication

**APIs:**

```ts
assertValid(schema, value)        // throws ValidationError; returns typed value
isValid(schema, value)            // returns boolean
parseOr(schema, value, fallback)  // returns typed value or fallback
```

**Usage:**

- `assertValid` — use when invalid data should halt execution
- `isValid` — use in guards and conditional logic
- `parseOr` — use when a safe fallback is acceptable

---

## 🐞 Error Handling Strategy

- All validation errors should throw or return a **typed `ValidationError`** with:
  - Error code (from shared taxonomy)
  - Human‑readable message
  - Optional metadata for debugging
- Error codes and taxonomy live in `shared/errors`

---

## 🗒️ Stewardship Notes

- Update this document alongside changes to `shared/schema`
- New helpers or schema patterns require governance review
- Keep examples in sync with actual implementations
