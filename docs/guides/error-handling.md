# 🧑‍💻 Error Handling Guide

Last updated: 2026-08-05

---

## 🎯 Purpose & Scope

This guide shows how to apply SuiteTools’ error handling standards in day‑to‑day development. It focuses on practical steps and examples for throwing, catching, displaying, and reporting errors consistently across workspaces.

- **Not governance:** For binding rules and taxonomy, see [📜 Error Handling Standards](../governance/standards/error-handling-standards.md).
- **Big picture:** For concepts and lifecycle, see [📐 Error Handling Architecture](../architecture/error-handling-architecture.md).

---

## 🗂️ Using the Taxonomy

Choose the most specific error type that communicates intent and supports targeted handling.

- **Start from `SuiteError`:** All errors extend `SuiteError` and include code, message, context, and severity.
- **Pick domain‑specific subclasses:** Use types like `NotFoundError`, `InvalidParameterError`, `SchemaValidationError`, `NetSuiteApiError`, `UnexpectedError`.
- **Add structured context:** Include fields that make triage fast (ids, endpoints, field paths, expected vs received).
- **Create a new subclass when needed:** If you need consistent handling, distinct metadata, or repeated occurrence, define it once and reuse.

```ts
throw new SchemaValidationError('user', issues); // schema name + ZodIssue[]
```

---

## ⚙️ Throwing Errors

Throwing errors in a **consistent, predictable way** makes them easier to catch, display, and report.
Every thrown error in SuiteTools should be **typed**, **contextual**, and **routed** so that downstream handlers — whether in a React boundary, async flow, or global listener — can respond appropriately.

### 🔑 Guidelines

- **Validate at boundaries** — Reject bad data before core logic runs.
- **Wrap unknowns predictably** — Convert third‑party or unknown errors into a `SuiteError` subclass with a `cause`.
- **Preserve original context** — Always include the original error object or its key properties so stack traces and metadata aren’t lost.
- **Avoid ambiguous messages** — Prefer “what failed + why + where” over generic messages.

```ts
import { makeSchemaValidationError } from '@suiteworks/suitetools-shared';

const parsed = schema.safeParse(input);
if (!parsed.success) {
  throw makeSchemaValidationError('requestPayload', parsed.error.issues);
}
```

---

## 🔌 RESTlet → SPA transport

Backend GET/POST/PUT handlers serialize failures as a shared **`ErrorResponse`** JSON shape (`status`, `code`, `message`, `severity`, optional `context`) — not the success envelope `{ status, data }`.

### GET response schema validation (#27)

Before a successful GET returns JSON, `SuiteToolsApiGet` validates through `validateGetResponse`:

1. **All GET endpoints** — shared `requestResponse` envelope (`status`, `data`, optional `message`).
2. **Selected endpoints** — see `GET_PAYLOAD_VALIDATED_ENDPOINTS` in `SuiteToolsApiGetValidate.ts` (expanded in #44).

Failures throw `SchemaValidationError` → `ErrorResponse` with `SCHEMA_VALIDATION_ERROR` (HTTP-style status 500), including Zod `issues` in `context`. List getters normalize empty `{}` to `[]`. Legacy empty-object soft-misses still skip entity validation when they appear; singular GET handlers should emit canonical soft NotFound instead (see below).

Frontend `getData` / `postData` / `putData` in `netSuiteClient`:

1. Parse JSON.
2. **Discriminate `ErrorResponse`** via `parseErrorResponse` and **rehydrate** with `errorFromResponse` into the matching `SuiteError` subclass (including `SCHEMA_VALIDATION_ERROR` → `SchemaValidationError`).
3. Only then validate the success / soft‑404 `{ status, data }` envelope with Zod.

Do not treat typed API errors as schema‑validation failures.

**Singular miss contracts**

| Kind | Shape | Used by |
|------|--------|---------|
| Soft NotFound (preferred) | Success envelope `{ status: 404, data: { code: 'NOT_FOUND', message } }` | file, job, user, script, jobRun, token, integration, scriptLog (`ensureEntityOrSoftNotFound` / `softNotFoundResponse`) |
| Hard NotFound | Thrown `NotFoundError` → `ErrorResponse` | Role (today) |
| Legacy empty `{}` | `{ status: 200\|404, data: {} }` | Being removed from singular GETs; FE `adapterUtils` still shims |

Singular adapters turn soft NotFound into `NotFoundError` via `handleNotFound`.

---

## 🛠️ Catching & Handling

Centralize normalization and logging with `handleError()`. It **always rethrows** (`never`) after logging and optional Dev Mode surfacing.

### Soft vs escalate (SPA pages)

| Kind of failure | What to do |
|-----------------|------------|
| **Expected / environmental** (empty filter, partial scrape, APM tools unavailable) | In‑page amber (or equivalent) + `return`. **Do not** call `handleError`. Optional `console.warn`. |
| **Unexpected** | `handleError(err, { reactTrigger })` once. **Do not** wrap it in an inner `try/catch` that swallows the rethrow. **Do not** also set amber from raw `error.message` for the same failure. |

```ts
import { handleError } from '@suiteworks/suitetools-shared';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';

const triggerError = useErrorBoundaryTrigger();

try {
  const data = await getRoles(criteria);
  setResults(toArray(data));
} catch (err) {
  setResults([]);
  handleError(err, { reactTrigger: triggerError }); // logs, optional overlay, then rethrows
}
```

Soft example (classified expected case):

```ts
} catch (err) {
  if (isApmUnavailableError(err)) {
    setStatusMessage(APM_UNAVAILABLE_MESSAGE);
    console.warn(`[SuiteTools] ${err.message}`);
    return; // soft — no handleError
  }
  setStatusMessage(null);
  handleError(err, { reactTrigger: triggerError });
}
```

### Anti‑pattern

```ts
// ❌ Do not swallow handleError's rethrow
try {
  handleError(err, { reactTrigger: triggerError });
} catch {
  /* swallow */
}
```

---

## 📌 Dev Mode & overlay

- Gate surfacing with `setErrorDevMode` / `isErrorDevMode` (wired from `import.meta.env.DEV` and Settings **Dev Mode**).
- In Dev Mode, `handleError(..., { reactTrigger })` opens the floating **`DevSuiteErrorOverlay`** over app chrome (does not require a hard refresh after toggling Dev Mode in Settings).
- Outside Dev Mode, `handleError` still logs with a `[SuiteTools]` prefix and rethrows; production should not dump stack traces into the main UI.

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

Once an error is caught, **how it’s displayed depends on the environment and whether the failure is expected**:

- **Dev Mode** — `DevSuiteErrorOverlay` (via `reactTrigger`) for unexpected failures that go through `handleError`.
- **Expected soft cases** — In‑page status (amber) without overlay; keep app chrome usable.
- **Production / Dev Mode off** — Log via `handleError`; avoid raw stack traces in the main UI. Route loaders may still map `NotFoundError` to an HTTP 404 → `ErrorPage`.

> Telemetry/`reportError` is planned; today logging is console‑centered via `handleError`. See [📡 Telemetry & Integrations](./error-handling-advanced.md#-telemetry--integrations-planned).

---

## 📊 Logging & Reporting

Make logs grep‑friendly locally; keep metadata consistent for future telemetry.

- **Centralize logging:** Call `handleError()` at the outermost unexpected‑failure catch (it logs with `[SuiteTools]`).
- **Use stable codes:** Filter by `code` on `SuiteError` subclasses, not message strings.
- **Avoid duplication:** Log once at the boundary; don’t call `handleError` in nested layers and again at the top for the same failure.

```ts
try {
  await doWork();
} catch (err) {
  handleError(err, { reactTrigger: triggerError }); // normalize → log → optional surface → rethrow
}
```

---

## 🧪 Examples

### Throwing a Schema Validation Error

```ts
import { SchemaValidationError } from '@suiteworks/suitetools-shared';

const parsed = schema.safeParse(data);
if (!parsed.success) {
  throw new SchemaValidationError('userPayload', parsed.error.issues);
}
```

### Escalating an Async List Fetch

```ts
const triggerError = useErrorBoundaryTrigger();

try {
  await fetchData();
} catch (err) {
  handleError(err, { reactTrigger: triggerError });
}
```

**Why this works:**

- Keeps async failures visible in Dev Mode via the floating overlay.
- Avoids silent `console.error`‑only nested fetches.
- Relies on `handleError`’s rethrow — no second manual `throw`.

---

## 📚 Common Patterns

### Validation Failure Handling

- Throw `SchemaValidationError` with schema name + Zod `issues` at transport/domain edges.

### Integration Error Mapping

- Wrap network/library errors into `NetSuiteApiError` with endpoint/status context.

### Soft environmental failures

- Classify with a typed error or discriminant (e.g. `ApmUnavailableError`).
- Show in‑page copy; skip `handleError` for that case only.

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
