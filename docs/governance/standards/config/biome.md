# ⚙️ Biome Config

> **SuiteTools Governance Artifact**
> Authoritative source: [biome.json](../../../../biome.json)

Last updated: August 13, 2026

---

## 🎯 Purpose & Scope

This document annotates [biome.json](../../../../biome.json), the single lint and format configuration for all workspaces. Biome replaced ESLint and Prettier in #70 — one binary and one config in place of two tools, eight plugins and a 285-line flat config.

Biome enforces **opinionated, automated formatting and linting** to ensure:

- Predictable diffs
- Consistent style across code and configuration
- Reduced formatting debate in review

### 🔗 Related

- [Linting with SuiteTools](../../../guides/linting.md) — strategy and workflow
- [Linting Standards](../linting-standards.md) — rule policy
- [TypeScript Config](./typescript.md) — type-checking alignment

---

## ⚙️ Deviations From Biome Defaults

Biome's defaults are taken wherever they are workable. Each override below exists for a measured reason rather than a preference, and should not be changed without one.

<!-- heading-title-case: ignore -->
### `indentStyle: space`, `indentWidth: 2`

Biome defaults to tabs. Spaces match the prevailing convention in the TypeScript and React ecosystem, and were already this project's style, so adopting the default would have reformatted every file for no functional gain.

<!-- heading-title-case: ignore -->
### `lineWidth: 120`

Biome defaults to 80. Measured against this codebase, 80 would rewrap 1,043 of 20,060 lines; 120 rewraps 75, nearly all of them unbreakable strings. 120 also suits JSX with several props and TypeScript generics.

<!-- heading-title-case: ignore -->
### `expand: never`

The default, `auto`, expands an object when its first property has a leading newline — making output a function of existing formatting rather than of content alone. The same object can therefore persist in two different shapes. `never` is deterministic: collapse whatever fits inside `lineWidth`, expand whatever does not.

<!-- heading-title-case: ignore -->
### `assist.actions.source.organizeImports: off`

Import sorting is disabled. It also sorts `export *` statements, which would reorder the curated, commented sections of `shared/src/index.ts`. This matches the intent of the `import/order` rule that the previous ESLint config carried commented out.

<!-- heading-title-case: ignore -->
### `overrides` — `package.json` excluded from the formatter

Yarn rewrites `package.json` in its own expanded style on every dependency change, while `expand: never` wants those objects collapsed. Without this override the two tools overwrite each other and CI fails after every `yarn add`. Yarn owns the file; Biome still lints it.

<!-- heading-title-case: ignore -->
### `files.includes` — `*.css` excluded

Biome's CSS parser cannot parse Tailwind v4 at-rules (`@theme`, `@source inline`) and reports a hard parse error. This affects exactly one file, `frontend/src/index.css`, which is consequently unformatted. Revisit when Biome adds Tailwind v4 support.

Quote style is deliberately **not** overridden — Biome's default of double quotes is used, which also matches JSON and the TypeScript compiler's own source.

---

## 🚦 Rule Severity

The `recommended` preset is enabled and every rule in it is an error, with one group of exceptions. Six rules carry pre-existing backlogs and are set to `warn` so they report without failing CI:

| Rule | Why it is deferred |
|---|---|
| `noExplicitAny` | Eliminating these is type-design work, not linting |
| `useTemplate` | Mechanical, high volume |
| `useLiteralKeys` | Mechanical, high volume |
| `noNonNullAssertion` | Each needs a null-handling decision |
| `useNodejsImportProtocol` | Mechanical; Node contexts only |
| `useExhaustiveDependencies` | Changing hook dependencies can change behaviour |
| `noArrayIndexKey` | Every instance is a positional mark in a d3 chart |

These are tracked for promotion to `error` once the findings are cleared. A warning tier is used rather than disabling the rules so the backlog stays visible on every run instead of living only in an issue.

---

## 🗂️ Why There Are No Per-Workspace Rule Overrides

The previous ESLint config carried a layer of workspace overrides: SuiteScript rules and NetSuite globals plus `ecmaVersion: 2021` for backend, React and Fast Refresh plugins for frontend, and minimal changes for shared. Biome needs none of them, because it scopes by language and file type rather than by configured path:

- **a11y rules** only evaluate JSX, so they affect frontend without being scoped there.
- **`useNodejsImportProtocol`** was the one rule with a plausible need for scoping, since NetSuite's runtime has no `node:` specifier. It reports 15 findings and every one is a genuine Node context — `backend/build`, `build-deployments.mjs`, `jest.config.js`, `vite.config.ts`, `vitest.config.ts`. None are in `backend/TypeScripts`.

The only `overrides` entry is the `package.json` formatter exclusion above, which is a tool-ownership boundary rather than a rule policy.

**Test files are now linted.** ESLint's `globalIgnores` excluded `**/*.test.ts` and `**/*.test.tsx` — 18 files. That exclusion most likely existed because ESLint's typed rules needed project configuration for test files, a constraint Biome does not have, so the exclusion was not carried forward.

---

## 🚧 Capability Not Carried Over From ESLint

Recorded so the loss is deliberate rather than discovered later:

- **JSDoc rules.** `jsdoc/require-jsdoc`, `check-tag-names` and `tag-lines` were enforced and are not replaceable — Biome does not lint JSDoc. See [JSDoc Standards](../../../guides/jsdoc-standards.md), which is now convention rather than an enforced rule.
- **Type-aware rules.** `no-unsafe-return` and `explicit-module-boundary-types` require type information, which Biome does not use.
- **Markdown heading title case.** The custom `heading-title-case` rule and the `lint:docs` script were removed with ESLint; Biome does not lint Markdown.

---

## 🧭 Stewardship Callout

- This configuration applies to **all workspaces**. There are no per-workspace rule overrides; add one only when a rule is genuinely wrong for a workspace, not merely inconvenient.
- Every deviation from a Biome default must carry a recorded reason here.
- Suppressions use `// biome-ignore lint/<rule>: <reason>` and must state a reason. The reason has to sit on the same line as the directive, and the directive must immediately precede the reported node.
- Lint and format scripts are identical in all four manifests and invoke `yarn run -T biome`, so each workspace borrows the root binary rather than redeclaring the dependency.
- Treat formatting changes as **suite-wide** — apply them to all affected files in a single commit to avoid noisy diffs bleeding into unrelated work.
