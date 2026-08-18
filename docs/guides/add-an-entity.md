# Add an Entity

Checklist for introducing a new SuiteTools domain entity end-to-end.

Last updated: 2026-08-17

---

## Purpose & Scope

Use this when adding a **new** RESTlet-backed entity (or promoting a scrape-only surface to SuiteQL). It captures the post–#53–#59 frontend factories and the existing backend validation / soft-NotFound contracts.

- **Not** a wire **rename** checklist — for camelCase migrations see [JSON Wire Contract](../governance/standards/json-wire-contract.md).
- **Not** concurrency/APM or HTML-scrape cutover guidance (those stay special-cased).

Golden references (prefer copying these over inventing a parallel path):

| Layer | Example |
|-------|---------|
| Shared schema | `shared/src/schema/domain/role.ts` / `token.ts` |
| Model SuiteQL | Token / Role getters in `backend/TypeScripts/SuiteTools/api/SuiteToolsApiModel.ts` |
| Soft NotFound | `backend/TypeScripts/SuiteTools/api/SuiteToolsApiGetNotFound.ts` |
| Payload validation | `GET_PAYLOAD_VALIDATED_ENDPOINTS` in `SuiteToolsApiGetValidate.ts` |
| FE list | `frontend/src/adapters/api/users.ts` + `UsersPage` (`useEntityList` + `RecordCriteriaForm`) |
| FE singular | `frontend/src/adapters/api/user.ts` + `userLoader` + `UserPage` |

---

## Checklist

Complete in order. One entity (or tight cluster) per MR when possible.

### 1. Shared schema

- [ ] Add `shared/src/schema/domain/<entity>.ts` with Zod schema + `*Bundle` / `*OrNotFoundSchema` exports.
- [ ] Wire keys follow [JSON Wire Contract](../governance/standards/json-wire-contract.md) (camelCase multi-word; single tokens as-is).
- [ ] Prefer `zNetSuite.stringOrEmpty` for SuiteQL string columns that can be `null`.
- [ ] Export types from shared package index; add fixtures / null-coercion tests in `entitySchemas.test.ts` (or entity tests).

### 2. Backend model (SuiteQL)

- [ ] Add singular + list getters in `SuiteToolsApiModel.ts` (or a focused model module if splitting later).
- [ ] Alias columns clearly in SQL; **do not** assume `AS camelCase` survives `asMappedResults()` — cleaners remap lowercase → wire keys.
- [ ] Empty singular → message string for soft NotFound at the Get layer; empty list → `[]` (not `{}`). Prefer `queryOne` / `queryMany` from `SuiteToolsApiModelQuery.ts` over hand-rolled envelopes.
- [ ] Prefer Token/Integration-style row normalization in the model when the Get cleaner would only remap keys. Token and Integration have **no Get-layer cleaner** by design (`normalizeTokenRow` / `normalizeIntegrationRow`). Do not add one unless that model normalize is removed in the same change.

### 3. Backend Get (RESTlet)

- [ ] Wire `case` in `SuiteToolsApiGet.ts` for singular + plural endpoints.
- [ ] Singular miss → `ensureEntityOrSoftNotFound` / `softNotFoundResponse` (`{ status: 404, data: { code: 'NOT_FOUND', message } }`). Never legacy `{ data: {} }`.
- [ ] Add `cleanX` / `cleanXs` (or model normalize) so the payload matches the shared schema **before** Zod. Get-layer singular cleaners must refuse canonical NotFound (`isCleanableRow` / `isNotFound`) rather than guarding `status === 200` in `process()`.
- [ ] Register both endpoints in `GET_PAYLOAD_VALIDATED_ENDPOINTS` (`SuiteToolsApiGetValidate.ts`) and update its unit test allowlist.
- [ ] Add/extend `endpointMap` in shared if the SPA will call the new names.

### 4. Frontend adapters

- [ ] Singular: `makeSingularAdapter` in `frontend/src/adapters/api/<entity>.ts` (+ optional `adaptItem` for `urlNs` / `urlDetail`).
- [ ] List: `makeListAdapter` with `pickCriteria` keys (+ `mapParams` / `adaptItem` only when needed).
- [ ] Do **not** hand-roll getData → parse → NotFound → `[]` loops.

### 5. Frontend routes & pages

- [ ] Loader: `makeEntityLoader('key', 'Label', getEntity)` — always awaited `{ key: T }` (no deferred / `awaitResult` dual API).
- [ ] Detail page: `useLoaderData()` → result component (no Suspense/`Await` for the entity record).
- [ ] List page: `useEntityList({ defaultCriteria, fetchList })` (+ optional `getStatusMessage` for soft empty/partial UX).
- [ ] Criteria UI: feature `RecordCriteria` built on `RecordCriteriaForm` + shared `SearchCriteria*`.
- [ ] Results: register in `ResultsTypes` / `resultsMap` as needed; modal fetch via singular adapter.

### 6. Errors & soft cases

- [ ] Hard failures → `handleError(..., { reactTrigger })` once (list/nested/modal).
- [ ] Expected empty/partial scrape or environmental miss → in-page status / empty results — **no** escalate.
- [ ] Follow [Error Handling Cheat Sheet](./error-handling-cheatsheet.md).

### 7. Build, deploy, smoke

- [ ] Backend and/or frontend `build-and-deploy` as needed — each builds shared first (no separate shared build required). See [Build & Release Checklist](./build-release-checklist.md).
- [ ] Backend when model/Get/shared schema change; FE-only when SPA-only. Cross-cutting / first install: root `deploy:all`.
- [ ] Smoke list (criteria + empty + rows) and detail (happy + missing id NotFound / overlay per Dev Mode).

---

## Do not

- Invent dual flat + camel keys on the wire for “compatibility.”
- Skip `GET_PAYLOAD_VALIDATED_ENDPOINTS` “temporarily.”
- Hand-roll list fetch effects, loaders, or criteria form chrome when factories/hooks exist.
- Reintroduce deferred Suspense/`Await` entity loaders.
- Return empty `{}` for singular soft misses.
- Assume SQL `AS camelCase` is enough without a cleaner remap.

---

## Scrapes & special surfaces

| Surface | Guidance |
|---------|----------|
| Integrations / SOAP (HTML scrape) | Keep scrape adapters; list pages still use `useEntityList` + `getStatusMessage`. RESTlet cutover is a separate track. |
| Concurrency (APM) | Different criteria/loading/soft-fail shape — do not force `useEntityList` / shared `RecordCriteriaForm`. |
| Settings | Singleton loader — not an entity list/detail pattern. |

---

## Related

- [JSON Wire Contract](../governance/standards/json-wire-contract.md) — field naming + **migration** checklist
- [Validation architecture](../architecture/validation.md) — schema layers
- [Error Handling Cheat Sheet](./error-handling-cheatsheet.md)
- [Build & Release Checklist](./build-release-checklist.md) — deploy commands
- FE factories: `frontend/src/adapters/api/adapterUtils.ts`, `frontend/src/routes/loaderUtils.ts`, `frontend/src/hooks/useEntityList.ts`, `frontend/src/components/shared/criteria/RecordCriteriaForm.tsx`
