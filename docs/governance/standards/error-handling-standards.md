# 📜 Error Handling Standards

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: 2026-08-17

---

## 🎯 Purpose & Scope

Defines the **binding rules and taxonomy** for error handling in SuiteTools.
This document is authoritative and enforceable — all contributors must follow these standards.

It covers:

- Canonical error lifecycle
- SuiteTools error taxonomy
- Rules for throwing, catching, and propagating errors
- Required metadata and enforcement boundaries

These standards are designed to be enforceable by automated tooling such as lint rules and test harnesses, ensuring compliance can be validated automatically.

> 📐 **Looking for the big picture?**
> This document defines binding rules.
> For narrative context and design philosophy, see [📐 Error Handling Architecture](../../architecture/error-handling-architecture.md).

---

## 🔄 Error Lifecycle (Canonical)

All errors in SuiteTools must follow this lifecycle:

1. **Origin** — error occurs at a boundary (app code, dependency, or global hook such as `window.onerror`).
2. **Intercept** — outermost `catch` or global handler captures it.
3. **Normalize** — convert any thrown value into a `SuiteError` (code, context, severity).
4. **Log** — emit with a `[SuiteTools]` prefix (grep-friendly); telemetry sink is deferred.
5. **Surface** — Dev Mode may open `DevSuiteErrorOverlay`; production uses safe fallback UI only.
6. **Propagate** — rethrow / escalate unless a classified soft path applies.

```mermaid
sequenceDiagram
    participant Origin
    participant Intercept
    participant Normalize
    participant Log
    participant Surface as Surface (Dev only)
    participant Propagate

    Origin->>Intercept: Error thrown / rejection
    Intercept->>Normalize: Pass raw error
    Normalize->>Log: Log with [SuiteTools] prefix
    alt Development
        Log->>Surface: Trigger overlay / UI surface
        Surface->>Propagate: Rethrow normalized error
    else Production
        Log->>Propagate: Rethrow normalized error
    end
```

---

## 🌐 Development vs Production Behavior (Governance)

Error handling behavior differs by environment. These rules are **binding** and must be followed in all SuiteTools workspaces.

| Environment     | Required Behavior |
|-----------------|-------------------|
| **Development** | **Origin → Intercept → Normalize → Log → Surface (Dev) → Propagate** – Errors **must** surface visibly (e.g., overlays, console) for fast debugging. |
| **Production**  | **Origin → Intercept → Normalize → Log → Propagate** – Errors **must not** surface raw details to end‑users. They **must** be logged and rethrown silently, with only safe fallback UI shown. |

### 📏 Enforcement Rules

- Unexpected errors **must** pass through `handleError()` at the highest catch point.
- When error‑dev mode is on (`setErrorDevMode` / Settings Dev Mode and/or local Vite DEV), `handleError()` **must** be able to surface via `reactTrigger` (floating `DevSuiteErrorOverlay`).
- When error‑dev mode is off, `handleError()` **must** log and rethrow without dumping raw stack traces into the main product UI.
- Fallback UIs in production **must** be neutral and user‑safe.
- **Soft expected failures** (empty filter results, classified environmental gaps such as unavailable APM tools) **may** be handled in‑page without calling `handleError()`, but **must not** be silent: show a clear status message and/or `console.warn`.
- Callers **must not** swallow `handleError()`’s rethrow (no inner `try/catch` that discards it).

### 📏 Core Principle (Enforceable)

- Unexpected errors **must** pass through `handleError()` at the highest catch point.
- This ensures normalization, consistent logging, and predictable dev/prod behavior.
- `handleError()` is the authoritative gateway for **unexpected** error handling in SuiteTools.
- RESTlet failures that are typed API errors **must** use the shared `ErrorResponse` contract so the SPA can rehydrate `SuiteError` subclasses (not collapse them into schema‑validation failures).

---

## 📑 Required Metadata

Every `SuiteError` **must** include:

- `code` — unique, stable identifier (used in logs, dashboards, future telemetry)
- `message` — developer‑facing, actionable description
- `context` — structured metadata (object with reproducible details)
- `severity` — SuiteTools taxonomy: `info` | `warning` | `error` | `fatal`

> **Severity vs NetSuite:** This is the SuiteTools/`SuiteError` contract, not NetSuite’s native log levels (`DEBUG` / `AUDIT` / `ERROR` / `EMERGENCY`). Do not expect a 1:1 mapping when writing `N/log` calls.

## 🗂️ Error Taxonomy

A unified lifecycle works best when every error has a clear, consistent type. In SuiteTools, errors are **first‑class citizens** of the architecture.

A clear taxonomy makes failures **predictable**, **consistent**, and **safe** to handle across all layers.

We define errors explicitly so they are:

- **Predictable** — categories are known at each boundary.
- **Consistent** — stable codes/namespaces enable automated logging, telemetry, and UI handling.
- **Safe** — no sensitive data leaks into logs or client‑facing messages.
- **Discoverable** — developers can quickly locate or extend the right type.
- **Actionable** — structured metadata supports debugging, reproduction, and resolution.

By treating errors as part of the system’s **contract** — not just exceptions — we make SuiteTools more robust, maintainable, and developer‑friendly.

### Base Class

All thrown errors **must** extend from **`SuiteError`** to ensure a consistent shape and predictable handling.

- **Base class:** `SuiteError`

### Canonical Subclasses (implemented)

- **`SchemaValidationError`** — Data shape or type is invalid at transport/domain boundaries.
- **`NetSuiteApiError`** — Communication with the NetSuite API failed (request or response side).
- **`NotFoundError`** — Singular resource missing (adapters / loaders; severity `warning`).
- **`InvalidParameterError`** — Bad or missing request parameter (severity `warning`).
- **`UnexpectedError`** — Catch‑all for unclassified failures after normalization; use sparingly when no better subclass fits.

### Proposed / Planned Subclasses

Not yet implemented; subject to governance review before adding.

- **`ConfigError`** — Required configuration missing or invalid (startup / env).
- **`UIRenderError`** — Unexpected rendering failure in the frontend.

### When to Create a New Subclass

Create a new subclass when:

- The error needs **special handling or display**.
- It is **domain‑specific and likely to recur**.
- You want to **group related failures under a clear namespace** for easier filtering in logs/telemetry.
- It benefits from **structured metadata** that should always be present for that category.

- **Rules for new types:**
  - Must extend `SuiteError`
  - Must define a unique `code`
  - Must be documented in taxonomy reference

---

## 📏 Governance Rules

- Errors **MUST NOT** be thrown from deep inside core logic — only at boundaries.
- Errors **MUST** be normalized into a `SuiteError` before crossing workspace boundaries.
- Errors **MUST** include required metadata.
- Errors **MUST NOT** be silently swallowed — they must be logged, soft‑surfaced in‑page, or escalated via `handleError()`.
- Unexpected errors **MUST** propagate predictably via `handleError()`’s rethrow unless a classified soft path applies.
- SPA callers **MUST NOT** combine an amber `error.message` banner with `handleError()` for the same unexpected failure.

---

## 🧭 Stewardship Callout

- This document is a governance artifact — changes require review. Substantive changes are recorded in the next release changelog, not in the same merge request. See the [Build & Release Checklist](../../guides/build-release-checklist.md).
- Keep taxonomy definitions in sync with implementation.
- Cross‑link this doc from onboarding and contributor guides.
