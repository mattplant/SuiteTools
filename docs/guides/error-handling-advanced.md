
# 🧑‍💻 Error Handling Advanced Guide

Last updated: 2026-08-04

---

## 🎯 Purpose & Scope

This guide explores **advanced error handling patterns** in SuiteTools.
It builds on the [Error Handling Standards](../governance/standards/error-handling-standards.md) and [Error Handling Guide](../architecture/error-handling-architecture.md), extending them with cross‑cutting techniques for complex scenarios.

This is **not** a governance document.
It provides practical strategies for **senior contributors and maintainers** who need to extend, scale, or evolve SuiteTools’ error handling.

---

## 🧭 Advanced Patterns

For complex scenarios, SuiteTools provides patterns that go beyond the basics.
These are designed for developers working on **cross‑workspace features**, **schema‑driven UIs**, or **shared infrastructure** where error handling must remain predictable and maintainable at scale.

By applying these advanced patterns, we:

- Keep error handling consistent across workspaces and packages
- Avoid duplication of mapping, formatting, and escalation logic
- Ensure developers can extend error handling without breaking existing flows

### 1. Cross‑Workspace Error Propagation

When an error originates in one workspace but must be handled in another:

- **Normalize before crossing boundaries** — Never pass raw `Error` objects across workspace boundaries. Always convert to a `SuiteError` (or subclass) with consistent shape and metadata.
- **Use shared error factories** — Define reusable creators in a shared `errors/` package so all workspaces throw the same class for the same failure type.
- **Preserve key fields** — Ensure `code`, `context`, and `cause` are carried forward so downstream consumers can analyze and act on the error.
- **Propagation rules** — Apply consistent normalization when moving between `frontend/`, `backend/`, and `shared/` layers to prevent drift in error shape or metadata.
- **Example** — A backend `IntegrationError` mapped into a frontend‑safe `UserFacingError` ensures the UI never sees raw backend details.

### 2. Schema‑Driven Error Mapping

For validation‑heavy flows (e.g., form builders, API adapters):

- **Map schema failures to typed errors** — Convert Zod or other schema validation results into `SchemaValidationError` with a structured `issues` array.
- **Preserve field‑level context** — Include the path, expected type, and received value in the error metadata so UI components can highlight the exact field in error states.
- **Simplify for end‑users** — Developer‑rich metadata is preserved internally, but user‑facing messages are scrubbed and simplified.
- **Taxonomy alignment** — Ensure schema‑driven errors map cleanly into the SuiteTools taxonomy (`ValidationError`, `SchemaValidationError`) for consistency across workspaces.

### 3. Error Adapters

When integrating with third‑party APIs or libraries:

- **Wrap external errors** — Use an adapter function to translate unknown error shapes into a `SuiteError` subclass with normalized metadata.
- **Preserve original error** — Store the raw error object in a `cause` property for debugging, but never expose it directly in production UIs.
- **Ensure consistent codes** — Assign stable `code` values so monitoring and dashboards can group errors reliably.
- **Normalize library errors** — For example, wrap `fetch` errors into an `IntegrationError` with consistent codes and metadata.

### 4. Escalation Strategies

For complex async flows:

- **Escalate intentionally** — Decide whether to:
  - Handle locally with `handleError()` (recoverable)
  - Escalate to a React boundary via `reactTrigger()` (UI‑blocking)
  - Surface at route level via `ErrorPage` (navigation/data‑loading)
- **Avoid over‑escalation** — Escalate only when user experience is affected.
- **Decide when to bubble vs fail fast.**
- Escalation levels: local → workspace → suite‑wide.
- Guidelines for logging vs surfacing vs rethrowing.

> **Throwing Notes:**
>
> - Prefer `SuiteError` subclasses
> - Throw early in validation
> - Preserve original context with `cause`
> - Never swallow errors silently

### Advanced Pattern Map

```text
[ Workspace A ]
   throw SuiteError / ErrorResponse
        │
        ▼
rehydrate / normalize ──→ cross boundary ──→ [ Workspace B ]
                                             │
                                             ▼
                                      handleError()
                                             │
                                             ├─ log ([SuiteTools])
                                             ├─ Dev Mode → DevSuiteErrorOverlay
                                             └─ rethrow
                                             (reportError planned — see Telemetry)
```

---

## 🪆 Integration Patterns

Error handling in SuiteTools isn’t an afterthought — it’s **baked into component, hook, and routing patterns** so developers don’t have to reinvent the wheel.

Following these integration patterns ensures that errors are:

- Caught at the right layer
- Escalated when needed
- Displayed in a consistent, predictable way

By applying these patterns, we:

- Keep error handling logic discoverable and reusable
- Ensure async failures surface in the same way as render‑time errors
- Maintain a clear separation between catching, displaying, and reporting

### Components & Hooks

- **Use `handleError`**
  Wrap async logic in a consistent `try/catch` pattern that applies centralized logging, normalization, and escalation.
  This ensures all errors — whether from network calls, schema validation, or internal logic — follow the same reporting and display rules.

### Async Escalation

- **Pass `reactTrigger`** from `useErrorBoundaryTrigger`
  Escalate async errors into the nearest React error boundary so they’re handled exactly like render‑time failures.
  This keeps UI error states consistent and avoids “invisible” async failures.

### Routing

- **Route loader/action errors → `ErrorPage`** — Surface navigation and data‑loading failures with a safe, user‑friendly fallback UI.
- **AppErrorBoundary** — Top‑level React boundary for render‑time errors.
- **ErrorPage** — Route‑level fallback UI for navigation/data‑loading failures.

### Pattern Map

```text
Component / Hook
   │
   ├─ expected soft case → in-page message → return
   │
   └─ unexpected → handleError(err, { reactTrigger })
           │
           ├─ log ([SuiteTools])
           ├─ Dev Mode → DevSuiteErrorOverlay (via reactTrigger)
           └─ rethrow (never returns)
```

> 💡 **Developer Tip:**
> When adding new components or hooks that perform async work, decide:
>
> 1. **Soft** — classified expected/environmental failure → in‑page message, no `handleError`.
> 2. **Escalate** — unexpected → `handleError(err, { reactTrigger })` once (do not swallow the rethrow).
>
> Pass `reactTrigger` from `useErrorBoundaryTrigger` into `handleError`; do not call the trigger as a substitute for `handleError`.

---

## 🖼️ Error Boundaries & Catching

Catching errors at the **right layer** is as important as throwing them consistently.
Every boundary or listener described here should route captured errors into `handleError()` to ensure **normalization**, **consistent logging**, and **predictable dev/prod behavior**.

By standardizing where and how errors are caught, we:

- **Prevent silent failures** — no error disappears without being logged or surfaced.
- **Keep error handling logic discoverable and reusable** — developers know exactly where to look and how to extend.
- **Maintain separation from business logic** — keeping feature code focused and testable.
- **Ensure environment‑appropriate detail** — verbose overlays in development, safe messages in production.

### Backend & Global Catching

- **Route handlers / controllers** — Wrap top‑level handlers in try/catch and call `handleError()` once before bubbling.
- **Middleware** — Use a central error middleware to normalize and report errors consistently.
- **Workers** — Wrap worker functions in try/catch and route through `handleError()`.
- **Browser globals** — Wire `window.onerror` and `window.onunhandledrejection` to `handleError()`.
- **Avoid double‑handling** — After an error goes through `handleError()`, let it bubble unless you have a specific recovery path.

---

## 💻 UI Display Utilities

### Development

- **DevSuiteErrorOverlay** — Floating overlay over app chrome with stack traces and metadata (gated by error‑dev mode / Settings Dev Mode).

### Production

- **DefaultFallback** — Safe, user‑friendly fallback UI.
- **No sensitive data** — Production messages scrubbed of stack traces and internals.

---

## 📡 Telemetry & Integrations (Planned)

Catching an error is only half the job — **reporting it ensures we can diagnose, track, and improve over time**.

SuiteTools will use a **single, centralized reporting utility** to keep error data consistent across environments and make future integrations with monitoring services (e.g., Sentry, Datadog, custom dashboards) straightforward.

By standardizing reporting, we:

- **Avoid fragmented or duplicate logging logic** — one path for all error reporting.
- **Ensure consistent metadata** — every error carries the same core fields for debugging and analysis.
- **Keep development feedback loops fast** — rich local reporting now, production‑grade monitoring later.
- **Prepare for seamless integrations** — external services can be added without changing developer workflows.

### Planned Utility & Flow

- **`reportError`** — A single entry point for normalized error data (from `handleError()`) that routes to:
  - Dev: console + overlay
  - Prod: monitoring service

```text
Throw → Catch → handleError() → reportError()
```

---

## 🗒️ Stewardship Notes

- Keep this guide aligned with the [📜 Error Handling Standards](../governance/standards/error-handling-standards.md).
- Promote recurring patterns into shared utilities and documented practices.
- Update examples and integration notes as new patterns emerge.
- Treat this as a **living resource** for advanced contributors and maintainers — not a static manual.
