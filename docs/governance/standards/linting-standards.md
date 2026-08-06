# 🧑‍💻 Linting Standards

> Part of the SuiteTools governance set.
> See [/docs/governance](../README.md) for related policies and resources.

Last updated: 2026-08-05

---

## 🎯 Purpose

Linting is not just about enforcing style — it’s about **maintainable, predictable, and readable code** across the suite.
Rules are chosen to:

- Reduce cognitive load for reviewers.
- Prevent common bugs.
- Keep diffs minimal and meaningful.
- Support suite‑wide discoverability and onboarding clarity.

---

### 🔗 Related Governance {#related-governance}

- [ESLint Config](config/eslint.md) — composition and application of the `eslint.config.cjs` file.
- [Prettier Config](./config/prettier.md) — formatting alignment.
- [TypeScript Config](./config/typescript.md) — type‑checking alignment.

---

## 🗂️ Rule Categories

Organized into thematic groups for clarity and actionability.

### Code Style

Readability, consistency, and review ergonomics.

- Always use Prettier formatting so diffs are clean and predictable.
- Keep imports grouped (external → internal → relative) for easy scanning.

### Error Prevention

Avoid bugs and runtime surprises.

- Use const instead of let when variables don’t change.
- Replace “magic numbers” with named constants for clarity.

### Type Safety

Correctness via TypeScript constraints.

- No implicit any — every type should be explicit.
- Add return types to exported functions so APIs are self‑documenting.

### Maintainability

Long‑term clarity and complexity limits.

- Keep functions small enough to be easily tested.
- Use JSDoc on exported APIs to help future maintainers.

### Workspace Boundaries

Layering, modularity, and import hygiene.

- Don’t import directly from another workspace’s internals.
- Use only the public API of a package, not deep file paths.

### Documentation & Exports

Discoverability and public API clarity.

- Every export should have JSDoc so it’s clear in IDEs.
- Avoid anonymous default exports so code is traceable.

### Rule Tiers

We group rules into **tiers** for clarity:

- **Core Enforcement**
  Non-negotiable rules that block commits and PRs if violated.

- **Advisory Conventions**
  Guide preferred patterns and best practices. May surface warnings but don't block progress.

---

## 📚 Rule Reference

Live ESLint config ([`eslint.config.cjs`](../../../eslint.config.cjs)) enforces **exports-only** return types (`explicit-module-boundary-types`) and JSDoc (`jsdoc/require-jsdoc` with `publicOnly`). Frontend overrides the stricter `jsdoc/recommended-typescript-error` preset accordingly. Root `yarn lint` uses `--max-warnings 0`.

Functions as the implementation spec. Some rows below remain aspirational (not yet wired).

| Category | Rule | ESLint / TS Rule Name | Severity | Source | Rationale |
|----------|------|-----------------------|----------|--------|-----------|
| **Code Style** | Formatting | `prettier/prettier` | error | Prettier | Enforces consistent quotes, semicolons, spacing for minimal diffs. |
|  | Naming | `@typescript-eslint/naming-convention` | error | @typescript-eslint | Standardizes camelCase for vars/functions, PascalCase for types/components. |
|  | Import ordering | `import/order` | error | eslint-plugin-import | Groups and sorts imports (external → internal → relative) for readability. |
| **Error Prevention** | Prefer `const` over `let` | `prefer-const` | error | ESLint core | Ensures predictable scoping and immutability where possible. |
|  | Disallow `var` | `no-var` | error | ESLint core | Prevents function‑scoped variables and promotes block scoping. |
|  | No undeclared variables | `no-undef` | error | ESLint core | Catches runtime reference errors from undeclared variables. |
|  | No shadowed variables | `no-shadow` | error | ESLint core | Prevents accidental variable overrides. |
|  | No magic numbers | `no-magic-numbers` | warn | ESLint core | Encourages named constants for clarity. |
|  | Consistent null checks | `eqeqeq` (`always`) | error | ESLint core | Avoids loose equality pitfalls. |
|  | No unused variables | `@typescript-eslint/no-unused-vars` | error | @typescript-eslint | Keeps code clean and avoids confusion. |
| **Type Safety** | No explicit `any` | `@typescript-eslint/no-explicit-any` | error | @typescript-eslint | Prevents structural holes in type safety. |
|  | Explicit return types | `@typescript-eslint/explicit-module-boundary-types` | warn | @typescript-eslint | Improves API clarity for exported functions. |
|  | No unsafe assignments | `@typescript-eslint/no-unsafe-assignment` | error | @typescript-eslint | Prevents structural type holes. |
|  | No unsafe return | `@typescript-eslint/no-unsafe-return` | error | @typescript-eslint | Ensures predictable output types. |
|  | Prefer readonly types | `@typescript-eslint/prefer-readonly` | warn | @typescript-eslint | Encourages immutability. |
|  | Consistent type exports | `@typescript-eslint/consistent-type-exports` | warn | @typescript-eslint | Enforces explicit and stable type exports. |
| **Maintainability** | Max line length | `max-len` | warn | ESLint core | Improves readability in diffs and side‑by‑side review. |
|  | Cyclomatic complexity limits | `complexity` | warn | ESLint core | Encourages smaller, testable functions. |
|  | Comment style | `valid-jsdoc` or `@typescript-eslint/jsdoc` | warn | ESLint core / plugin-jsdoc | Standardizes JSDoc for exported APIs. |
| **Workspace Boundaries** | No cross‑workspace imports | `no-restricted-imports` | error | ESLint core | Preserves domain boundaries (except from `shared/`). |
|  | Restrict deep imports | `import/no-internal-modules` | error | eslint-plugin-import | Enforces public API usage, prevents bypassing encapsulation. |
| **Code Exports** | JSDoc required for all exports | `jsdoc/require-jsdoc`, `@typescript-eslint/explicit-module-boundary-types` | warn | plugin-jsdoc / @typescript-eslint | Improves IDE support and onboarding. |
|  | No unused exports | `unused-imports/no-unused-vars` | error | eslint-plugin-unused-imports | Keeps public surfaces clean. |
|  | No anonymous default exports | `import/no-anonymous-default-export` | error | eslint-plugin-import | Improves traceability in codebase. |
| **Documentation Standards** | Title Case headings | `heading-title-case/heading-title-case` | error | custom rule | Ensures consistent capitalization in Markdown headings |

---

## 🧩 SuiteTools ESLint Rules

These rules enforce suite-wide governance standards across documentation, configuration, and code. They are wired into the root `eslint.config.cjs` file and apply to all workspaces.

### Custom ESLint Rules

Custom rules are implemented in the `/scripts/eslint-rules/` directory and include:

- [heading-title-case.js](../../../scripts/eslint-rules/heading-title-case.js) — Enforces Title Case in Markdown headings

### `heading-title-case.js`: Markdown Heading Capitalization

This rule enforces **Title Case** in all Markdown headings across the suite. It supports developer clarity, onboarding consistency, and structural discoverability.

- **Location:** `/scripts/eslint-rules/heading-title-case.js`
- **Scope:** All `.md` files in all workspaces
- **Severity:** `error` (Core Enforcement)
- **Usage:** Run with `yarn lint:docs` or just view in VSCode with ESLint extension installed.

#### ✅ What’s Enforced

- Headings must follow Title Case (e.g. `### Architecture Overview`)
- Acronyms and inline code (e.g. `NetSuite`, `tailwindcss`) preserve original casing
- Hyphenated modifiers are capitalized (e.g. `Language-Specific Rules`)

See the [Documentation Body Standard](./documentation-body.md#heading-capitalization-enforcement) for the details and rationale including opting out.

#### 🛠️ Technical Notes

This rule is implemented via a custom ESLint plugin located at [/scripts/eslint-rules/heading-title-case.js](../../../scripts/eslint-rules/heading-title-case.js).

It uses `remark().parse()` inside a `Program()` visitor to extract Markdown heading nodes from the raw source text. ESLint’s native parser does not support `.md` files, so the rule relies on a no-op parser defined at [/scripts/eslint-rules/noop-parser.js](../../../scripts/eslint-rules/noop-parser.js) to satisfy ESLint’s parser requirement.

The rule inspects each heading and compares its raw text (excluding inline code and formatting) against the expected Title Case version using `title-case`. If the heading differs, it reports a lint error with the original text.

---

## 🚫 Exceptions & Overrides

- Temporary overrides must be justified in a comment above the rule disable line.
- Use `// eslint-disable-next-line rule-name -- reason` format.
- Overrides are reviewed during PRs and should be removed as soon as possible.

---

## 🧭 Stewardship Callout

- This table is the **single source of truth**.
- Update this table **in the same commit** as any `.eslintrc` or `tsconfig.json` changes.
- Include rule names in commit messages when adding/removing rules.
