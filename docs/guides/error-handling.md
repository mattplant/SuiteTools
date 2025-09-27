# 🧑‍💻 Error Handling Guide

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

This guide shows how to apply SuiteTools’ error handling standards in day‑to‑day development. It focuses on practical steps and examples for throwing, catching, displaying, and reporting errors consistently across workspaces.

- **Not governance:** For binding rules and taxonomy, see [📜 Error Handling Standards](../governance/standards/error-handling-standards.md).
- **Big picture:** For concepts and lifecycle, see [📐 Error Handling Architecture](../architecture/error-handling-architecture.md).

---

## 🗂️ Using the Taxonomy

Choose the most specific error type that communicates intent and supports targeted handling.

- **Start from `SuiteError`:** All errors extend `SuiteError` and include code, message, context, and severity.
- **Pick domain‑specific subclasses:** Use types like `SchemaValidationError`, `NetSuiteApiError`, `ConfigError`, `UnexpectedError`.
- **Add structured context:** Include fields that make triage fast (ids, endpoints, field paths, expected vs received).
- **Create a new subclass when needed:** If you need consistent handling, distinct metadata, or repeated occurrence, define it once and reuse.

```ts
throw new SchemaValidationError('Invalid user payload', {
  code: 'VAL_USER_PAYLOAD',
  severity: 'error',
  context: { issues, source: 'UserForm', operation: 'create' }
});
```

---

## ⚙️ Throwing Errors

Throwing errors in a **consistent, predictable way** makes them easier to catch, display, and report.
Every thrown error in SuiteTools should be **typed**, **contextual**, and **routed** so that downstream handlers — whether in a React boundary, async flow, or global listener — can respond appropriately.

SuiteTools uses a hierarchy of `SuiteError` subclasses to ensure that every thrown error:

- **Carries clear intent** — The class name signals the domain and failure type.
- **Preserves context** — Original stack traces and metadata are never lost.
- **Supports targeted handling** — Downstream code can branch on error type without brittle string matching.

By following these practices, we:

- Keep error types explicit and discoverable.
- Preserve valuable debugging context.
- Prevent silent failures and hard‑to‑trace bugs.
- Stop invalid data early before it causes cascading issues.

### 🔑 Guidelines

- **Validate at boundaries** — Reject bad data before core logic runs.
- **Wrap unknowns predictably** — Convert third‑party or unknown errors into a `SuiteError` subclass with a `cause`.
- **Preserve original context** — Always include the original error object or its key properties so stack traces and metadata aren’t lost.
- **Avoid ambiguous messages** — Prefer “what failed + why + where” over generic messages.

```ts
// Validation boundary (Zod → SuiteError)
const parsed = schema.safeParse(input);
if (!parsed.success) {
  throw new SchemaValidationError('Invalid request payload', {
    code: 'VAL_REQUEST',
    severity: 'error',
    context: { issues: parsed.error.issues }
  });
}
```

---

## 🛠️ Catching & Handling

Centralize normalization and logging with `handleError()`. Escalate intentionally.

- **Use the outermost catch:** Call `handleError(err)` at flow boundaries (route handlers, job runners, top‑level async ops).
- **Let it bubble after handling:** Avoid double‑handling; rethrow or return a clear failure signal.
- **Differentiate recoverable vs blocking:** Recover locally when safe; otherwise escalate to a boundary.

```ts
// Async flow with handleError
import { handleError } from '@suitetools/errors';

export async function saveUser(input: unknown) {
  try {
    const user = validateUser(input); // may throw SchemaValidationError
    return await api.createUser(user); // may throw NetSuiteApiError
  } catch (err) {
    handleError(err); // normalize + log (+ dev overlay)
    throw err;        // propagate for caller or boundary
  }
}

// Escalating to a React error boundary
const trigger = useErrorBoundaryTrigger();

async function onSubmit(form: FormData) {
  try {
    await saveUser(form);
  } catch (err) {
    trigger(err); // escalate to nearest boundary for a safe fallback UI
  }
}
```

---

## 📌 Guidelines

- **Dev vs. prod behavior** – In development, expect overlays; in production, prefer logging and rethrow without UI noise.

> For global hooks and advanced interception strategies, see [🖼️ Error Boundaries & Catching](./error-handling-advanced.md#️-error-boundaries--catching).

---

## 🔌 Error Entry Points

These are the first places an error becomes catchable.
Wire them directly to `handleError()` to ensure normalization, consistent logging, and predictable behavior.

```text
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                                     SPA (Browser)                                     │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Async/await in app code       ──► try/catch → handleError()                        │
│ 2. Promise rejections            ──► .catch(handleError)                              │
│ 3. React error boundaries        ──► componentDidCatch → handleError()                │
│ 4. Event listener bodies         ──► try/catch inside listener → handleError()        │
└───────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────────────────────────────────┐
│                                     Backend (API)                                     │
├───────────────────────────────────────────────────────────────────────────────────────┤
│ 5. Route handlers / controllers  ──► try/catch → handleError()                        │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

> For global hook wiring and middleware interception strategies, see [🖼️ Error Boundaries & Catching](./error-handling-advanced.md#️-error-boundaries--catching).

## 💻 Displaying Errors

Once an error is caught, **how it’s displayed depends on the environment**:

- **Development** — Expose as much context as possible to speed up debugging.
- **Production** — Protect users from technical details while still providing a clear, trustworthy experience.

> For planned display utilities and advanced fallback strategies, see [📡 Telemetry & Integrations](./error-handling-advanced.md#-telemetry--integrations-planned).

---

## 📊 Logging & Reporting

Make logs grep‑friendly locally; keep metadata consistent for telemetry.

- **Centralize reporting:** Route through `reportError()` with normalized shape.
- **Use stable codes:** Filter and dashboard by `code`, not message strings.
- **Avoid duplication:** Log once at the boundary; don’t spam nested layers.

```ts
try {
  await doWork();
} catch (err) {
  const normalized = handleError(err); // normalize + enrich with metadata
  await reportError(normalized);       // local console in dev; telemetry in prod
  throw normalized;                     // propagate for caller or boundary
}
```

---

## 🧪 Examples

These examples show how to apply SuiteTools’ error‑handling patterns in real code.
They’re intentionally minimal so developers can see the **core usage** without unrelated boilerplate.

### Throwing a Schema Validation Error

Use a domain‑specific error class to make the failure type explicit and ensure it’s caught and reported with the right metadata.

```ts
if (!schema.safeParse(data).success) {
  throw new SchemaValidationError('Invalid user payload', { data });
}
```

**Why this works:**

- Fails fast during validation.
- Uses a typeded error (`SchemaValidationError`) for targeted handling
- Preserves the invalid payload for debugging and reporting.

### Escalating an Async Error to a Boundary

When an async operation fails inside a component or hook, escalate it to the nearest React error boundary so it’s handled consistently with render‑time errors.

```ts
const triggerErrorBoundary = useErrorBoundaryTrigger();

try {
  await fetchData();
} catch (err) {
  triggerErrorBoundary(err);
}
```

**Why this works:**

- Keeps async and render‑time error handling consistent.
- Avoids "invisible" async failures that never surface in the UI.
- Ensures the error flows through `handleError()` --> display --> report.

---

## 📚 Common Patterns

### Validation Failure Handling

- Throw `SchemaValidationError` with an `issues` array at transport/domain edges.
- Map field paths to UI hints for inline error states.

### Integration Error Mapping

- Wrap network/library errors into `NetSuiteApiError` with `cause`.
- Include endpoint, method, and correlation id in context.

### Graceful Degradation

- Catch non‑critical failures (e.g., analytics, logging) with `handleError()` and continue.
- Reserve escalation for user‑blocking failures.

---

## 🔗 Related Docs

- [📐 Error Handling Architecture](../architecture/error-handling-architecture.md)
- [📜 Error Handling Standards](../governance/standards/error-handling-standards.md)
- [🧑‍💻 Error Handling Advanced](./error-handling-advanced.md)
- [📘 Error Handling Cheat Sheet](./error-handling-cheatsheet.md)

---

## Next Steps

- Use this guide as your **day‑to‑day reference** for throwing, catching, displaying, and reporting errors.
- For binding rules and taxonomy, always check the [📜 Error Handling Standards](../governance/standards/error-handling-standards.md).
- For deeper patterns and integration strategies, see the [🧑‍💻 Error Handling Advanced Guide](./error-handling-advanced.md).
- When in doubt, normalize with `handleError()` and escalate intentionally.

By following these practices, contributors keep error handling **predictable, consistent, and discoverable** across SuiteTools.
