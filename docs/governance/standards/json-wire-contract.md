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
4. **One contract per entity** — do not keep dual flat + camel keys on the wire; migrate schema, cleaner, and SPA in the same change set.
5. **Schema artifact names are separate** — TypeScript exports stay `userSchema` / `UserBundle` (see STYLE Schema Artifacts).

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
| Settings | camelCase | — | Reference |
| Token | camelCase | — | Reference |
| Integration | camelCase | — | Reference |
| SoapLog | mostly camelCase | — | Reference; single-token keys OK |
| Job | mixed | `isinactive` | Has `lastRun` already |
| User | mixed | `isinactive`, `role_names` | `role_names` is snake_case |
| File | mixed | `createddate`, `lastmodifieddate`, `filetypename`, `filesize` | |
| Login | flat-heavy | `oauthappname`, `oauthaccesstokenname`, `username`, `rolename`, `emailaddress`, `ipaddress`, `requesturi`, `secchallenge`, `useragent` | |
| JobRun | mixed | `jobid`, `jobname` | Cleaner currently maps camel → flat |
| OptionValues | simple tokens | — | `value` / `text` only |

---

## Migration checklist (per entity)

Use Role as the template. One entity (or small cluster) per MR:

1. **Shared schema** — rename keys in `shared/src/schema/domain/<entity>.ts`; update JSDoc.
2. **Shared tests** — fixtures/assertions in `entitySchemas.test.ts` (or entity tests).
3. **Backend cleaner** — remove remaps that force flat keys; keep SuiteQL camelCase (or map *up* to camelCase); boolean/T-F cleanup on the new names.
4. **SQL** — aliases already camelCase need no change; if SELECT uses flat names, alias to camelCase at the query edge.
5. **Frontend** — update DataGrid `key:` / `RecordResult` property access in the same MR.
6. **Validation** — if the entity is in `GET_PAYLOAD_VALIDATED_ENDPOINTS`, confirm soft NotFound / empty list still skip or pass; happy path still validates.
7. **Rebuild shared** — `yarn workspace @suiteworks/suitetools-shared run build:types` (or `yarn typecheck` / `yarn lint`) so consumers see new `.d.ts`.
8. **Smoke** — list + detail happy path for that entity.

### Completed slices

- **Role** (#34) — `isinactive` → `isInactive`, `centertype` → `centerType`, `issalesrole` → `isSalesRole`, `issupportrole` → `isSupportRole`, `iswebserviceonlyrole` → `isWebServiceOnlyRole`
- **Script** (#37) — `apiversion` → `apiVersion`, `isinactive` → `isInactive`, `scripttype` → `scriptType`, `scriptid` → `scriptId`, `scriptfile` → `scriptFile`, `notifyemails` → `notifyEmails`
- **ScriptLog** (#37) — `scripttype` → `scriptType`, `scriptname` → `scriptName`

### Suggested follow-on order

1. File / User leftovers
2. Login / JobRun as needed

---

## Related

- [STYLE.md](../STYLE.md) — micro-level naming (includes wire-field summary)
- [Validation architecture](../../architecture/validation.md) — transport / domain / view layering
- [#27](https://gitlab.com/idev-systems/labs/SuiteTools/-/work_items/27) — RESTlet response schema validation (done)
- [#34](https://gitlab.com/idev-systems/labs/SuiteTools/-/work_items/34) — camelCase contract + incremental migration

## Stewardship Callout

- Keep the inventory table updated when an entity slice lands.
- Do not greenwash by disabling payload validation; fix cleaners and schemas together.
