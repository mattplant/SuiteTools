# 📜 Third-Party Notices Guide

Last updated: August 14, 2026

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://gitlab.com/idev-systems/labs/SuiteTools/)

---

## Overview

[`THIRD_PARTY_NOTICES.md`](../../THIRD_PARTY_NOTICES.md) is a **compliance artifact**. It states which third-party packages ship in SuiteTools distributions and under what terms, satisfying the notice-retention obligations of the MIT, BSD and ISC licences those packages carry.

It is **generated, never hand-edited**. Editing it directly is lost on the next regeneration and, worse, produces a document whose contents nobody can reproduce or verify.

```sh
yarn generate-third-party-notices
```

### 🔗 Related Governance

- [License Compliance & Attribution](../governance/license-compliance.md) — licensing model and contributor responsibilities
- [Yarn Config](../governance/standards/config/yarn.md) — the `@yarnpkg/plugin-licenses` pin and checksum policy
- [Attribution Guide](../../ATTRIBUTION.md) — attribution formats for documentation and visuals

---

## 🛠️ How It Works

The generator lives in [`scripts/third-party-notices/`](../../scripts/third-party-notices/) and wraps `yarn licenses generate-disclaimer` from `@yarnpkg/plugin-licenses`:

| Flag | Effect |
|------|--------|
| `--recursive` | Transitive dependencies, not only direct ones |
| `--production` | Runtime dependencies only, excluding `devDependencies` |
| `--focus frontend --focus backend` | The workspaces whose code ships |

Hand-written entries in `scripts/third-party-notices/overrides/` are appended to the output. The script does **not** modify `node_modules`.

Two guards fail the run if a SuiteTools workspace, or SuiteTools' own GPL text, reaches the output — the document must never claim the project is third-party to itself.

---

## 📐 Why Transitive Dependencies Are Included

`yarn licenses generate-disclaimer` reports **direct dependencies only** by default. That is the wrong scope here, and the omission is invisible: everything listed is real, so nothing looks wrong.

Transitive code is genuinely distributed. The shipped `app-bundle.js` contains `@floating-ui` identifiers and `d3-dispatch`'s `"unknown type: "` throw string — neither package is a direct dependency. Listing only top-level packages would assert those are not distributed while their code sits in the artifact uploaded to NetSuite.

`--recursive` over-reports slightly, because tree-shaken packages are still listed. That is the safe direction: over-reporting attributes software that did not ship, while under-reporting omits a notice the licence requires be carried.

> **Do not narrow this to direct dependencies** without first establishing that no transitive code reaches the bundle.

---

## 📦 Packages Without Upstream Licence Files

The plugin emits an entry only for packages shipping licence text it can locate. A package that declares a licence in `package.json` but ships no `LICENSE` file is **omitted silently** — no warning.

Such packages get a hand-written entry under `scripts/third-party-notices/overrides/`, one file each.

### Rules for override entries

**Record only what is verifiable. Do not reconstruct a licence.**

Do not infer a copyright holder, do not copy a copyright line from a sibling package by the same publisher, and do not paste canonical licence text upstream did not ship. Each asserts terms nobody has verified, in the one document whose purpose is to state terms accurately.

State instead:

- the package name and the version examined,
- the licence identifier the package declares,
- its repository and homepage,
- that upstream ships no licence file, and
- where the project publishes its terms, if anywhere.

An entry that records an unresolved gap is worth more than one that papers over it.

### Retiring an override

Each override exists because of an upstream packaging defect and should be temporary. When a package starts shipping a licence file, the generator picks it up automatically — delete the override and regenerate. Check with:

```sh
ls node_modules/<package>/ | grep -i licen
```

---

## 🔄 When to Regenerate

Regenerate whenever the **runtime** dependency set changes — a package added, removed, or upgraded in `dependencies` of `frontend`, `backend` or `shared`.

`devDependency` changes do not affect this file. Tooling upgrades — linters, compilers, test runners, build plugins — never require a regeneration.

---

## ✅ Verifying a Regeneration

Review the diff rather than accepting it blindly, then:

```sh
yarn generate-third-party-notices   # run twice; output must be identical
yarn install --immutable
yarn build:all
```

Confirm the packages gained and lost match the dependency change that prompted the run.

Some upstream licences (`tslib`) ship CRLF line endings. Git normalises them to LF, so a regeneration leaves the working tree clean.

---

## 📋 Stewardship Notes

- Treat `THIRD_PARTY_NOTICES.md` as a **legal artifact**, not a generated convenience — it is the record that notice obligations were met.
- Never hand-edit it. Corrections belong in the generator or in an override.
- Regenerate as part of the change that alters runtime dependencies, not as a periodic cleanup — the file drifted across three releases when this was left implicit.
- Keep this guide in sync with [`scripts/third-party-notices/`](../../scripts/third-party-notices/) and [License Compliance](../governance/license-compliance.md).
