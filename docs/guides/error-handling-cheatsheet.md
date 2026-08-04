# 📘 Error Handling Cheat Sheet

Last updated: 2026-08-04

---

## 🎯 Purpose & Scope

This cheat sheet is a **quick reference** for contributors working with SuiteTools error handling.
It summarizes the taxonomy, common patterns, pitfalls, and commands for fast lookup.

- **Not governance:** For binding rules, see [📜 Error Handling Standards](../governance/standards/error-handling-standards.md).
- **For depth:** See [📐 Error Handling Architecture](../architecture/error-handling-architecture.md), [🧑‍💻 Error Handling Guide](../guides/error-handling.md), and [🧑‍💻 Error Handling Advanced Guide](../guides/error-handling-advanced.md).

---

## 🗂️ Taxonomy Matrix

| Error Type              | When to Use                                         | Example |
|-------------------------|-----------------------------------------------------|---------|
| `NotFoundError`         | Singular resource missing                           | `new NotFoundError('Role', id)` |
| `InvalidParameterError` | Bad/reserved query or request params                | `new InvalidParameterError('endpoint', value, reason)` |
| `SchemaValidationError` | Zod/schema validation failed                        | `new SchemaValidationError('user', issues)` |
| `NetSuiteApiError`      | NetSuite HTTP/API failure                           | `makeNetSuiteApiError(endpoint, message, { status })` |
| `UnexpectedError`       | Catch‑all for unclassified failures                 | `new UnexpectedError('initiateJob()', cause)` |

## Soft vs escalate

| Failure kind | Pattern | UI |
|--------------|---------|----|
| Expected / environmental (empty list, APM unavailable, intentional scrape fallback) | In‑page message + `return` — **no** `handleError` | Amber / quiet empty |
| Unexpected (API/throw/bug) | `handleError(err, { reactTrigger })` once — **no swallow** | Dev overlay when Dev Mode on |

## Escalation Matrix

| Context                   | Use This Pattern                          | Escalates To                         | Display Surface              |
|---------------------------|-------------------------------------------|--------------------------------------|------------------------------|
| List / nested / modal async | `handleError` + `reactTrigger`          | `useErrorBoundaryTrigger`            | `DevSuiteErrorOverlay` (Dev Mode) |
| Soft expected case        | Classify → status message → `return`      | Nowhere                              | In‑page amber                |
| Route loader              | `mapLoaderError` / throw `Response`       | React Router                         | `ErrorPage` (e.g. 404)       |
| RESTlet handler           | Map `SuiteError` → `ErrorResponse` JSON   | SPA `getData`/`postData`/`putData`   | Rehydrated `SuiteError`      |

> Background tasks that are intentionally non‑blocking may `console.warn` and continue (e.g. Last Logins entity scrape with backend fallback). Do not call `handleError` if the user flow continues successfully.

---

## ⚠️ Common Pitfalls

- **Error creation**
  - ❌ Throwing raw `Error` at API boundaries → ✅ Prefer a `SuiteError` subclass.
  - ❌ Missing structured context → ✅ Include ids, endpoints, reasons.

- **Transport**
  - ❌ Parsing all RESTlet JSON only as `{ status, data }` → ✅ Discriminate `ErrorResponse` first, then the success envelope.
  - ❌ Treating typed API errors as Zod `SchemaValidationError` → ✅ Use `parseErrorResponse` / `errorFromResponse`.

- **Catching & logging**
  - ❌ Bare `console.error` on nested/modal fetches → ✅ `handleError` + `reactTrigger` for unexpected failures.
  - ❌ Calling `handleError` then swallowing the rethrow → ✅ Let it rethrow (or soft‑return *before* calling it).
  - ❌ Amber banner from `error.message` **and** Dev overlay for the same failure → ✅ Soft **or** escalate, not both.

- **Dev Mode**
  - ❌ Expecting a hard refresh after toggling Settings Dev Mode → ✅ Same‑tab sync via `setErrorDevMode`.

---

## ✅ Contributor Checklist

- Selected the correct `SuiteError` subclass (or a small frontend discriminant for soft cases).
- Unexpected failures call `handleError()` once at the outermost catch.
- Soft expected cases never call `handleError`.
- Passed `reactTrigger` from `useErrorBoundaryTrigger` for user‑facing async SPA work.
- RESTlet errors use `ErrorResponse`; client rehydrates before Zod success parsing.

---

## 💡 Contributor Tips

- **Normalize via `handleError`** — logging + optional Dev overlay + rethrow.
- **Classify soft cases** — typed error / discriminant beats string matching alone.
- **Keep UI separate** — overlay and amber copy live outside business/adapters where possible.

---

## 🛠️ Quick Commands

```bash
# Frontend typecheck
yarn workspace frontend tsc --noEmit
```

```ts
// Simulate unexpected failure in Dev Mode
import { UnexpectedError, handleError } from '@suiteworks/suitetools-shared';
handleError(new UnexpectedError('demo()', 'simulated'), { reactTrigger: triggerError });
```

---

## 🔗 Related Docs

- [📐 Error Handling Architecture](../architecture/error-handling-architecture.md)
- [📜 Error Handling Standards](../governance/standards/error-handling-standards.md)
- [🧑‍💻 Error Handling](./error-handling.md)
- [🧑‍💻 Error Handling Advanced](./error-handling-advanced.md)

---

## 🗒️ Stewardship Notes

- Keep this cheat sheet aligned with the guide and standards.
- Prefer short, copy‑pasteable snippets over narrative.
- Update the soft‑vs‑escalate table when new environmental cases ship.
