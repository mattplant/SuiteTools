# 🧑‍💻 JSDoc Standards

Last updated: 2026-08-22

---

## 🎯 Purpose & Scope

Defines how SuiteTools documents **source files**. Per-symbol JSDoc — what an exported function does, its parameters and return — is covered by the [Style Guide](../governance/STYLE.md#commenting); this document is about the block at the top of a file.

The bar is split in two, by what can actually be enforced.

| Tier | Requirement                                | Applies to                        | Enforced |
| ---- | ------------------------------------------ | --------------------------------- | -------- |
| 1    | literal `// SPDX-License-Identifier:` line | every source file, tests included | script   |
| 2    | full prose header block                    | contracts, entry points, seams    | review   |

Most files are tier 1 only. That is deliberate: a twelve-line header on a thirty-line file trains readers to skip headers everywhere, and prose nobody rereads goes stale. A header describing what a file did two refactors ago is worse than no header.

---

## 🔒 Tier 1 — SPDX line

Every source file starts with this line, before any other comment or code:

```ts
// SPDX-License-Identifier: GPL-3.0-or-later
```

- The **literal comment line** is required. An `@license` tag inside a JSDoc block does not satisfy tier 1 — license scanners read the SPDX line, and [ATTRIBUTION.md](../../ATTRIBUTION.md) already prescribes this form.
- Test files included. Keep the `@vitest-environment` pragma directly below it.
- Checked by [`scripts/check-headers.mjs`](../../scripts/check-headers.mjs) via `yarn lint`.

**Scope: source only** — `.ts`, `.tsx`, `.mts`, and `.cts` in the `frontend`, `shared`, and `backend` workspaces, excluding generated output. Workspace config files (`vite.config.ts`, `vitest.config.mts`) are included; they are source too. Not `*.json` (plain JSON takes no comments), not `*.md` (covered by [LICENSE-DOCS.md](../../LICENSE-DOCS.md) and the README badges), not the SDF XML objects under `backend/src/Objects` (SuiteCloud-managed; an injected comment risks the deploy).

---

## 📐 Tier 2 — full header block

```ts
// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * [One-line summary of what this file is.]
 *
 * @fileoverview
 * [Why this file exists as its own module, and what depends on it.]
 *
 * @remarks
 * [Boundary assumptions — what must not change, and what breaks if it does.]
 *
 * @see [related file or doc] – [why it is worth opening]
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */
```

`frontend/src/components/shared/results/` is the reference implementation — copy the shape from there.

### Which files are tier 2

A file qualifies if **any** of these is true:

1. it is an **entry point something outside this repo calls into** — `shared/`'s published package entries (`index.ts`, `errors-entry.ts`, `contracts-entry.ts` — the three rollup inputs), or a backend SuiteScript that NetSuite invokes directly (any file carrying `@NScriptType`);
2. it is imported by **three or more** files outside its own directory, or by **eight or more** files in total — the second clause catches a hub inside a large directory, whose importers are all siblings;
3. it is mocked by a test.

Re-export barrels are excluded, except the entry points in (1) — those *are* the contract. Small size is not an exemption: `DynamicResultsRenderer.tsx` is one line of logic and qualifies under (3), because it is the seam `Results.test.tsx` mocks.

The rule is the source of truth, not any checked-in list. It currently selects about 51 files. Worked examples of the second criterion: `adapterUtils.ts` has 20 importers and `routes/loaderUtils.ts` has 11, all siblings — a directory-only test would miss both, which is why the total-importer clause exists. If you are unsure whether a file qualifies, it probably does not — tier 1 plus good per-symbol JSDoc is the norm, not a shortfall.

### Tags

| Tag             | Required                                        |
| --------------- | ----------------------------------------------- |
| summary line    | yes — untagged, first line of the block         |
| `@fileoverview` | yes                                             |
| `@remarks`      | yes                                             |
| `@see`          | yes                                             |
| `@copyright`    | yes                                             |
| `@license`      | yes                                             |
| `@attribution`  | only where code is genuinely adapted externally |

Not used: `@module` (nothing consumes it — the repo has no doc generator), `@author` (git blame is authoritative and never stales), and the `* SuiteTools X` product title line (redundant when every file in the repo is SuiteTools).

---

## ⚙️ Lint & Enforcement

- **Tier 1 is machine-checked.** `scripts/check-headers.mjs` runs as part of `yarn lint` and honors the same exclusions as [biome.json](../../biome.json).
- **Tier 2 is upheld in review.** This is not a gap waiting to be closed. A script can prove `@remarks` exists; it cannot prove the text is still true, and presence-only checks are exactly how stale-but-passing headers accumulate.
- Biome has no JSDoc rules, and its GritQL plugins cannot substitute: `comment()` does not compile, and under `file($body)` the matched span begins *after* the leading comment, so a file that carries the SPDX line still reports as missing it. Comments are trivia, not AST. This was verified by probe against Biome 2.5.8 — see [Biome Configuration](../governance/standards/config/biome.md).

---

## 💡 Contributor Tips

- Keep the summary to one sentence.
- Use `@remarks` for boundary assumptions, not implementation detail — the code already says how.
- Point `@see` at things worth opening, and say why in the same line.
- If you change what a file does, change its header in the same commit. A stale tier-2 block is a defect.
- Beware bare utility words in frontend prose. Tailwind scans comment text for class candidates, so a sentence containing a word like `grow` or `block` emits that utility into `output.css`. Writing "If utilities grow beyond…" in `adapterUtils.ts` was generating a phantom `.grow` class no component used. Phrase around it, or quote the word as code.

---

## 🔗 Related Docs

- [📚 Documentation as Architecture](../architecture/docs-architecture.md)
- [📑 Style Guide](../governance/STYLE.md) — per-symbol JSDoc
- [🧹 Linting Standards](../governance/standards/linting-standards.md)
- [ATTRIBUTION.md](../../ATTRIBUTION.md)

---

## 📋 Stewardship Notes

- Substantive changes to the tag set or the tier rule are recorded in the next release changelog, not in the same merge request. See the [Build & Release Checklist](./build-release-checklist.md).
- Keep this standard in sync with [Linting Standards](../governance/standards/linting-standards.md) and [Biome Configuration](../governance/standards/config/biome.md).
- If a doc generator is ever adopted, revisit `@module` and `@internal` together — both were dropped because nothing consumed them.
