# ⚙️ TypeScript Config

> **SuiteTools Governance Artifact**

Last updated: September 22, 2025

---

## 🎯 Purpose & Scope

This document annotates the current multiple TypeScript config files.

---

## 🔗 Related Governance

- [Linting with SuiteTools](/docs/guides/linting) — strategy and philosophy
- [ESLint Config](./eslint.md) — linting alignment
- [Prettier Config](./prettier.md) — formatting alignment

---

## 🗂️ Planned Improvements

- Consolidate to a single root-level config with workspace overrides.

---

## ⚙️ Workspace Configs

### Backend

- [backend/tsconfig.json](../../../../backend/tsconfig.json) — TypeScript config file for the backend workspace.

**Core Rules:**

| Category | Setting | Value | Purpose |
|----------|---------|-------|---------|
| **Extends** | `extends` | `"../tsconfig.json"` | Inherits base SuiteTools TypeScript settings; allows workspace‑specific overrides. |
| **Language & Syntax** | `target` | `"ESNext"` | Enables latest ECMAScript features for modern syntax. |
|  | `lib` | `["ESNext", "dom"]` | Includes ESNext APIs and DOM types for NetSuite scripting and browser‑adjacent utilities. |
|  | `experimentalDecorators` | `true` | Allows use of decorator syntax in TypeScript. |
|  | `esModuleInterop` | `true` | Enables default import compatibility for CommonJS modules. |
| **Module System** | `module` | `"amd"` | Required for NetSuite SuiteScript 2.x AMD module format. |
|  | `moduleResolution` | `"node"` | Resolves modules using Node.js resolution algorithm. |
|  | `baseUrl` | `"."` | Sets the base directory for non‑relative module imports. |
|  | `paths` | `N`, `N/*` → `@hitc/netsuite-types` | Maps NetSuite `N` modules to local type definitions from `@hitc/netsuite-types`. |
| **Output Settings** | `outDir` | `"./src/FileCabinet/SuiteScripts/SuiteTools"` | Compiled SuiteScript output directory. |
|  | `sourceMap` | `false` | Disables source map generation to reduce deployment size. |
|  | `newLine` | `"LF"` | Enforces LF line endings for cross‑platform consistency. |
| **Linting & Safety** | `noUnusedLocals` | `true` | Flags unused local variables to maintain clean code. |
| **Inclusions** | `include` | `"."` | Includes all files in the workspace root. |
| **Exclusions** | `exclude` | `"node_modules"` | Skips dependencies from compilation. |

---

#### 📝 Backend Config Notes

- **AMD module target** is required for SuiteScript 2.x compatibility.
- **`paths` mapping** ensures type safety for NetSuite `N` modules without global ambient declarations.
- **`experimentalDecorators`** is enabled for potential future use.
- **`sourceMap: false`** avoids deploying `.map` files to NetSuite’s File Cabinet.

---

### Frontend

- [frontend/tsconfig.json](../../../../frontend/tsconfig.json) — TypeScript config file for the frontend workspace.

**Core Rules:**

| Category | Setting | Value | Purpose |
|----------|---------|-------|---------|
| **Extends** | `extends` | `"../tsconfig.base.json"` | Inherits base SuiteTools TypeScript settings; keeps frontend config minimal and focused on React/Vite specifics. |
| **Language & Syntax Support** | `target` | `"ES2020"` | Enables modern JavaScript features while maintaining compatibility with current browser targets. |
|  | `lib` | `["ES2020", "DOM", "DOM.Iterable"]` | Includes ES2020 APIs plus DOM and iterable DOM collections for browser development. |
|  | `useDefineForClassFields` | `true` | Uses `define` semantics for class fields per latest ECMAScript spec. |
|  | `jsx` | `"react-jsx"` | Enables the new JSX transform for React 17+ without needing `import React` in every file. |
|  | `module` | `"ESNext"` | Uses modern ES module syntax for bundler optimization. |
|  | `moduleResolution` | `"bundler"` | Resolves modules in a way optimized for bundlers like Vite. |
| **File Handling & Modules** | `resolveJsonModule` | `true` | Allows importing `.json` files as modules. |
|  | `allowImportingTsExtensions` | `true` | Permits explicit `.ts`/`.tsx` extensions in imports. |
|  | `isolatedModules` | `true` | Ensures each file can be transpiled in isolation — required for Vite and other fast build tools. |
|  | `noEmit` | `true` | Disables output — build is handled entirely by the bundler. |
| **Type System Behavior** | `strict` | `true` | Enables all strict type‑checking options for maximum safety. |
|  | `skipLibCheck` | `true` | Skips type checking of declaration files to speed up builds. |
|  | `exactOptionalPropertyTypes` | `true` | Treats optional property types as written, without adding `undefined` automatically. |
|  | `noUncheckedIndexedAccess` | `false` | Currently disabled; will be enabled after updating types with Zod schemas. |
|  | `types` | `["vite/client"]` | Includes Vite’s client‑side type declarations. |
|  | `typeRoots` | `["./node_modules", "./node_modules/@types"]` | Explicitly sets type root directories for resolution. |
| **Linting** | `noUnusedLocals` | `true` | Flags unused local variables. |
|  | `noUnusedParameters` | `true` | Flags unused function parameters. |
|  | `noFallthroughCasesInSwitch` | `true` | Prevents unintentional fall‑through in `switch` statements. |
| **Monorepo Support** | `composite` | `true` | Enables project references for incremental builds in a monorepo. |
| **Inclusions** | `include` | `["src", "src/vite-env.d.ts"]` | Restricts compilation to source files and Vite environment types. |
| **References** | `references` | `[{ "path": "./tsconfig.node.json" }, { "path": "../shared" }]` | Links to related TS projects for incremental builds. |

---

#### 📝 Frontend Config Notes

- **Bundler‑optimized module resolution** (`moduleResolution: "bundler"`) is key for Vite’s fast dev server and optimized builds.
- **`noEmit: true`** ensures TypeScript doesn’t output compiled JS — Vite handles transpilation.
- **`noUncheckedIndexedAccess`** is intentionally off until Zod‑based type refinements are complete.
- **`composite: true`** is required for project references to work in the monorepo build graph.

---

### Shared

- [shared/tsconfig.json](../../../../shared/tsconfig.json) — TypeScript config file for the shared workspace.

**Core Rules:**

| Category | Setting | Value | Purpose |
|----------|---------|-------|---------|
| **Extends** | `extends` | `"../tsconfig.base.json"` | Inherits base SuiteTools TypeScript settings; keeps shared config minimal and focused on library output. |
| **Module Resolution** | `moduleResolution` | `"node"` | Overrides base config to use Node.js module resolution, ensuring compatibility for shared packages consumed by multiple environments. |
| **Monorepo Support** | `composite` | `true` | Enables project references for incremental builds in the monorepo. |
| **Declaration Output** | `declaration` | `true` | Generates `.d.ts` type declaration files for consumers of the shared package. |
|  | `declarationMap` | `true` | Generates `.d.ts.map` files to improve type navigation in editors. |
|  | `emitDeclarationOnly` | `false` | Emits both declarations and compiled output (not declarations only). |
| **Output Structure** | `outDir` | `"dist"` | Compiled output directory for the shared package. |
|  | `rootDir` | `"src"` | Sets the root source directory for module resolution and output structure. |
| **Inclusions** | `include` | `["src"]` | Restricts compilation to the `src` directory. |
| **Exclusions** | `exclude` | `["dist", "node_modules"]` | Skips build output and dependencies from compilation. |
| **References** | `references` | `[]` | No direct project references; shared code is consumed by other workspaces instead. |

---

#### 📝 Shared Config Notes

- **`moduleResolution: "node"`** is explicitly set here to ensure predictable resolution for shared code, even if the base config changes.
- **Declaration files** (`.d.ts`) are critical for type safety when shared modules are imported into backend or frontend workspaces.
- **`composite: true`** allows the shared workspace to participate in TypeScript’s project reference graph, enabling faster incremental builds.
- **`emitDeclarationOnly: false`** ensures compiled JavaScript is also emitted, making the shared package usable in environments without TypeScript.
- Output is cleanly separated into `dist/` to avoid polluting the source tree.

---

## 🧭 Stewardship Callout

- Keep Prettier, ESLint, and STYLE.md aligned to avoid conflicting rules.
- Treat formatting changes as **suite‑wide** — update all affected files in a single commit to avoid noisy diffs.
