# JSON Wire Contract

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: 2026-08-06

---

## Purpose

Define the **shared JSON field-naming contract** for API payloads (RESTlet responses and SPA adapters) so SuiteQL/NetSuite column names do not silently become the public shape.

Normative naming summary also lives in [STYLE.md — JSON / API Wire Fields](../STYLE.md).

---

## Rules

1. **Multi-word keys → camelCase** — `centerType`, `isInactive`, `scriptType`, `dateCreated`.
2. **Single-token keys unchanged** — `id`, `name`, `email`, `status`, `type`.
3. **Normalize at the API edge** — SuiteQL may return NetSuite column names; cleaners must emit the shared contract **before** `validateGetResponse` / Zod parse ([#27](https://gitlab.com/idev-systems/labs/SuiteTools/-/work_items/27)).
4. **SuiteQL lowercases aliases** — `N/query` `asMappedResults()` does **not** preserve `AS dateCreated` casing; the key arrives as `datecreated`. Cleaners must remap lowercase SuiteQL keys → camelCase wire keys (see Integration `datecreated` handling and File `cleanFileData`). SQL `AS camelCase` alone is not enough.
5. **One contract per entity** — do not keep dual flat + camel keys on the wire; migrate schema, cleaner, and SPA in the same change set.
6. **Schema artifact names are separate** — TypeScript exports stay `userSchema` / `UserBundle` (see STYLE Schema Artifacts).
7. **SuiteQL nullables** — multi-word (and most other) string columns from SuiteQL may be `null`. Prefer `zNetSuite.stringOrEmpty` over bare `z.string()` for those wire fields so list endpoints do not fail validation. Add a null-coercion test when migrating an entity.

### Examples

| Prefer | Avoid |
|--------|-------|
| `isInactive` | `isinactive` |
| `centerType` | `centertype` |
| `scriptType` | `scripttype` |
| `dateCreated` | `createddate` / `date_created` |
| `urlDetail` | `urldetail` |

---

## Domain schema inventory (2026-08-06)

Classification of keys under `shared/src/schema/domain/` (excluding tests/helpers). **Flat-lowercase** = glued multi-word keys that should migrate. Optional SPA-only URL fields (`urlNs`, `urlDetail`, …) are camelCase already.

| Entity | Style | Flat-lowercase / non-camel multi-word keys (migrate later) | Notes |
|--------|-------|------------------------------------------------------------|-------|
| Role | **camelCase** (template) | — | Migrated in #34 |
| Script | **camelCase** | — | Migrated in #37 |
| ScriptLog | **camelCase** | — | Migrated in #37 |
| File | **camelCase** | — | Migrated in #38 |
| User | **camelCase** | — | Migrated in #38 |
| Settings | camelCase | — | Reference |
| Token | camelCase | — | Reference |
| Integration | camelCase | — | Reference |
| SoapLog | mostly camelCase | — | Reference; single-token keys OK |
| Job | **camelCase** | — | Migrated in #40 |
| Login | **camelCase** | — | Migrated in #39 |
| JobRun | **camelCase** | — | Migrated in #39 |
| OptionValues | simple tokens | — | `value` / `text` only |

---

## Migration checklist (per entity)

Use Role as the template. One entity (or small cluster) per MR:

1. **Shared schema** — rename keys in `shared/src/schema/domain/<entity>.ts`; update JSDoc; use `stringOrEmpty` for SuiteQL string columns that can be null.
2. **Shared tests** — fixtures/assertions in `entitySchemas.test.ts` (or entity tests), including a **null-field** case for each coerced string column.
3. **Backend cleaner** — remap SuiteQL lowercase keys → camelCase wire keys; boolean/T-F cleanup on the new names. Do not assume `AS camelCase` survives `asMappedResults()`.
4. **SQL** — still alias for clarity in SQL source; the cleaner is what makes the wire camelCase.
5. **Frontend** — update DataGrid `key:` / `RecordResult` property access in the same MR.
6. **Validation** — if the entity is in `GET_PAYLOAD_VALIDATED_ENDPOINTS`, confirm soft NotFound / empty list still skip or pass; happy path still validates.
7. **Rebuild** — `yarn workspace backend run build` (bundles schemas into the RESTlet) and frontend `build-and-deploy` as needed; do not smoke until both sides that validate the entity are redeployed.
8. **Smoke** — list + detail happy path for that entity (including filters that return sparse/null columns).

### Completed slices

- **Role** (#34) — `isinactive` → `isInactive`, `centertype` → `centerType`, `issalesrole` → `isSalesRole`, `issupportrole` → `isSupportRole`, `iswebserviceonlyrole` → `isWebServiceOnlyRole`
- **Script** (#37) — `apiversion` → `apiVersion`, `isinactive` → `isInactive`, `scripttype` → `scriptType`, `scriptid` → `scriptId`, `scriptfile` → `scriptFile`, `notifyemails` → `notifyEmails`
- **ScriptLog** (#37 schema, #41 cleaner) — `scripttype` → `scriptType`, `scriptname` → `scriptName` (SuiteQL lowercase remap in `cleanScriptLogData`)
- **File** (#38) — `createddate` → `dateCreated`, `lastmodifieddate` → `lastModifiedDate`, `filetypename` → `fileTypeName`, `filesize` → `fileSize`
- **User** (#38) — `isinactive` → `isInactive`, `role_names` → `roleNames`
- **Login** (#39) — `oauthappname` → `oauthAppName`, `oauthaccesstokenname` → `oauthAccessTokenName`, `username` → `userName`, `rolename` → `roleName`, `emailaddress` → `emailAddress`, `ipaddress` → `ipAddress`, `requesturi` → `requestUri`, `secchallenge` → `secChallenge`, `useragent` → `userAgent`
- **JobRun** (#39 schema + cleaner, #43 drop dual preprocess) — `jobid` → `jobId`, `jobname` → `jobName`
- **Job** (#40) — `isinactive` → `isInactive`
- **Request criteria** (#42) — list-filter query params + `optionValues` type tokens (see below)

### Request criteria (query / form params)

List-filter keys sent SPA → RESTlet use the same camelCase rule (migrated in #42):

| Prefer | Avoid |
|--------|-------|
| `dateCreated` | `createddate` |
| `lastModifiedDate` | `lastmodifieddate` |
| `fileTypes` | `filetypes` |
| `scriptTypes` | `scripttypes` |
| `scriptNames` | `scriptnames` |
| `timeMode` | `timemode` |
| `customDateTime` | `customdatetime` |
| `customDuration` | `customduration` |

`optionValues` `type` values: `fileType`, `scriptType` (was `filetype`, `scripttype`). SuiteQL WHERE column names stay NetSuite flat.

### GET payload validation allowlist

`GET_PAYLOAD_VALIDATED_ENDPOINTS` (RESTlet domain Zod, in addition to the envelope) currently includes: `settings`, `user`/`users`, `role`/`roles`, `job`/`jobs`, `file`/`files`, `script`/`scripts`, `scriptLog`/`scriptLogs`, `jobRun`/`jobRuns`, `logins`, `token`/`tokens` (#44).

### Soft NotFound (singular GET)

Prefer `{ status: 404, data: { code: 'NOT_FOUND', message } }` over legacy `{ data: {} }`. Helper: `SuiteToolsApiGetNotFound.ts` (#45). Role still throws hard `NotFoundError`. Empty-`{}` validation skip and FE pre-Zod shim removed in #46 — regressing empty misses fail loudly.

### Suggested follow-on order

1. Add `optionValues` to `GET_PAYLOAD_VALIDATED_ENDPOINTS` (align empty `{}` vs array if needed)
2. Add `integration` / `integrations` once scrape vs RESTlet paths share one contract

---

## Related

- [STYLE.md](../STYLE.md) — micro-level naming (includes wire-field summary)
- [Validation architecture](../../architecture/validation.md) — transport / domain / view layering
- [#27](https://gitlab.com/idev-systems/labs/SuiteTools/-/work_items/27) — RESTlet response schema validation (done)
- [#34](https://gitlab.com/idev-systems/labs/SuiteTools/-/work_items/34) — camelCase contract + incremental migration

## Stewardship Callout

- Keep the inventory table updated when an entity slice lands.
- Do not greenwash by disabling payload validation; fix cleaners and schemas together.
