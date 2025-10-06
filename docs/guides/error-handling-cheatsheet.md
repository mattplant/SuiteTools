# 📘 Error Handling Cheat Sheet

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

This cheat sheet is a **quick reference** for contributors working with SuiteTools error handling.
It summarizes the taxonomy, common patterns, pitfalls, and commands for fast lookup.

- **Not governance:** For binding rules, see [📜 Error Handling Standards](../governance/standards/error-handling-standards.md).
- **For depth:** See [📐 Error Handling Architecture](../architecture/error-handling-architecture.md), [🧑‍💻 Error Handling Guide](../guides/error-handling.md), and [🧑‍💻 Error Handling Advanced Guide](../guides/error-handling-advanced.md).

---

## 🗂️ Taxonomy Matrix

| Error Type            | When to Use                                    | Example Snippet |
|-----------------------|-----------------------------------------------|-----------------|
| `SchemaValidationError` | Input fails schema or type validation          | `throw new SchemaValidationError('Invalid payload', { code: 'VAL_USER' })` |
| `NetSuiteApiError`      | NetSuite API call fails or returns non‑OK      | `throw new NetSuiteApiError('API call failed', { code: 'NS_API_FAIL' })` |
<!-- | `ConfigError`           | Misconfigured environment or missing setting   | `throw new ConfigError('Missing API key', { code: 'CFG_API_KEY' })` | -->
<!-- | `UnexpectedError`       | Catch‑all for unclassified or unknown failures | `throw new UnexpectedError('Unexpected failure', { code: 'UNEXPECTED' })` | -->

## Escalation Matrix

| Context                   | Use This Pattern                          | Typical Error Types                  | Escalates To               | Display Surface       |
|---------------------------|-------------------------------------------|--------------------------------------|----------------------------|-----------------------|
| Component async logic     | `handleError` + optional `reactTrigger`   | `SchemaValidationError`, `NetSuiteApiError` | Nearest error boundary     | Inline or fallback UI |
| Hook logic                | `handleError` + `useErrorBoundaryTrigger` | `SchemaValidationError`, `UnexpectedError`  | React error boundary       | Boundary fallback     |
| Route loader/action       | Throw error → handled by router           | `SchemaValidationError`, `ConfigError`      | React Router boundary      | `ErrorPage`           |
| Background task / utility | `handleError` only                        | `NetSuiteApiError`, `UnexpectedError`       | Logging + optional rethrow | No direct display     |

> ℹ️ Background tasks (analytics, cache refresh, silent sync) should log via `handleError()` but usually don’t escalate to UI. Rethrow only if failure affects user flow.

---

## ⚠️ Common Pitfalls

Avoid these anti‑patterns to keep error handling predictable and contributor‑friendly:

- **Error creation**
  - ❌ Throwing raw `Error` objects → ✅ Always wrap in a `SuiteError` subclass.
  - ❌ Missing metadata (`code`, `context`) → ✅ Include stable codes and structured context.

- **Catching & logging**
  - ❌ Swallowing errors silently (`catch` without `handleError`) → ✅ Always log or report before suppressing.
  - ❌ Using `console.error` instead of centralized logging → ✅ Route through `handleError()` and `reportError()`.

- **Escalation**
  - ❌ Forgetting to pass `reactTrigger` for async escalation → ✅ Escalate async errors into the nearest boundary.
  - ❌ Escalating background task errors unnecessarily → ✅ Log background tasks, rethrow only if user‑blocking.

- **Architecture**
  - ❌ Mixing display logic with error‑catching logic → ✅ Keep UI fallback components separate.
  - ❌ Cross‑workspace leakage → ✅ Normalize before crossing boundaries.

---

## ✅ Contributor Checklist

- Selected the correct `SuiteError` subclass.
- Included stable `code`, meaningful `message`, `severity`, and structured `context`.
- Wrapped unknowns and preserved `cause`.
- Called `handleError()` at the outermost catch.
- Kept UI rendering separate from error creation.
- Used `reportError()` where appropriate.
- Normalized before crossing workspace boundaries.

---

## 💡 Contributor Tips

- **Normalize early** — Use `handleError` to apply consistent formatting, metadata, and logging.
- **Escalate intentionally** — Async errors should behave like render‑time failures when user‑facing.
- **Display separately** — Keep UI fallback logic out of error‑catching layers for clarity and reuse.
- **Use boundaries wisely** — Don’t over‑escalate; only escalate when the error affects user experience.
- **Document edge cases** — If your logic handles unusual failure modes, leave a comment or link to the lifecycle guide.

---

- ## 🛠️ Quick Commands

- **Run constraints check** (validate repo rules)

  ```bash
  yarn constraints
  ```

- **Check for duplicate versions** (ensure dependency hygiene)

  ```bash
  yarn dedupe --check
  ```

- **Simulate error in dev overlay** (test error boundaries)

  ```ts
  throw new UnexpectedError('Simulated failure', { code: 'SIM_TEST' });
  ```

- **Report error manually** (send normalized error to telemetry)

  ```ts
  import { reportError } from '@suitetools';
  reportError(new ConfigError('Missing config', { code: 'CFG_MISSING' }));
  ```

---

## 🔗 Related Docs

- [📐 Error Handling Architecture](../architecture/error-handling-architecture.md)
- [📜 Error Handling Standards](../governance/standards/error-handling-standards.md)
- [🧑‍💻 Error Handling](./error-handling.md)
- [🧑‍💻 Error Handling Advanced](./error-handling-advanced.md)

---

## Next Steps

- Use this cheat sheet as a **day‑to‑day quick reference**.
- For binding rules, always check the [📜 Error Handling Standards](../governance/standards/error-handling-standards.md).
- For deeper context and advanced strategies, see the [📐 Architecture Guide](../architecture/error-handling-architecture.md) and [🧑‍💻 Advanced Guide](../guides/error-handling-advanced.md).
- When in doubt, normalize with `handleError()` and escalate intentionally.

By following these patterns, contributors keep error handling **predictable, consistent, and discoverable** across SuiteTools.
