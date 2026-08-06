# SuiteTools — Frontend Workspace

Last updated: 2026-08-05

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://gitlab.com/idev-systems/labs/SuiteTools/)

---

## 🎯 Purpose & Scope

This workspace provides the SuiteTools frontend — the user interface and client‑side logic for interacting with SuiteTools.
It builds on the shared workspace and internal modules to deliver composable, type‑safe views.

**Out of scope:** backend logic, server‑only modules, or shared utilities.

See the parent directory [README](../README.md) for more information about the SuiteTools project.

---

## 🧱 Design Principles

- **Type Safety First** — All modules are written in TypeScript.
- **Frontend-Only Logic** — Avoid importing backend or shared modules that assume Node.js or server context.
- **Composable Views** — Pages should be composed from reusable components and hooks, not monolithic logic.
- **DX Matters** — All code should be easy to read, test, and onboard into.

### Unit tests (Vitest)

- Run: `yarn workspace frontend run test` (builds shared via `pretest`, then Vitest).
- Colocate tests as `src/**/*.test.ts` / `*.test.tsx` (node env by default; hook tests may set `@vitest-environment jsdom`).
- Cover utils/adapters/hooks first — no NetSuite account or Playwright required for a green suite.
- Root `yarn test` includes this workspace.

---

## 📐 Structure

The frontend workspace is organized for clarity, modularity, and long-term maintainability. Each folder has a clear purpose and avoids ambiguous overlap with shared or backend concerns.

```plaintext
frontend/
├── docs/            # Frontend documentation
├── src/             # Frontend source code
│   ├── adapters/       # 🛠 SuiteTools-specific — transforms data between frontend & backend
│   │   ├── api/           # API request/response transformations
│   ├── components/     # 🛠 SuiteTools-specific — hybrid UI structure
│   │   ├── features/      # Feature-specific composites
│   │   ├── layout/        # Top-level layouts (AppLayout, Header, Footer)
│   │   └── shared/        # Shared components
│   │       ├── context/      # React contexts + providers for global/cross-feature state
│   │       ├── errors/       # Error display components
│   │       └── ui/           # Reusable UI primitives
│   ├── hooks/          # 🛠 SuiteTools-specific — feature‑agnostic UI hooks
│   ├── lib/            # 🛠 SuiteTools-specific — frontend utilities
│   │   └── netsuite/      # NetSuite-specific utilities
│   ├── pages/          # Top-level route views
│   ├── routes/         # App routing configuration
│   ├── theme/          # Flowbite theme extensions & custom styles
│   └── utils/          # Frontend-specific utility functions
├── .gitignore          # Git ignore file for frontend
├── index.html          # Main HTML entry point
├── LICENSE             # GPL-3.0-or-later
├── package.json        # Yarn workspace definition & frontend scripts
├── postcss.config.js   # PostCSS configuration
├── README.md           # This README file
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite build configuration
```

### 📁 `adapters/`

Adapters for transforming data between frontend and backend shapes.

Transforms schema‑valid data into shapes that views expect.

One adapter per schema, lives in /adapters.

### 📁 `components/`

For a deep dive into our hybrid component structure, see [COMPONENTS.md](./docs/COMPONENTS.md).

### 📁 `lib/`

Frontend-specific utilities and helpers.

- `lib/netsuite/` — NetSuite specific utilities for data collection and manipulation
  - `lib/netsuite/collectData.ts` — Functions to extract data from NetSuite pages

> 🧼 Keep `lib/` lean and focused. Anything reusable across workspaces should live in `shared/`.

### 📁 `pages/`

Top-level route views, typically matching the app’s routing structure. Each page may compose multiple components and handle its own data fetching and error boundaries.

```plaintext
pages/
├── ConcurrencyDetailPage.tsx   # Concurrency detail page
├── ConcurrencyRequestPage.tsx  # Concurrency request page
├── ConcurrencySummaryPage.tsx  # Concurrency overview page
├── ErrorPage.tsx        # Error page
├── FilePage.tsx         # File page
├── FilesPage.tsx        # Files page
├── HomePage.tsx         # Home page
├── IntegrationPage.tsx  # Integration page
├── JobPage.tsx          # Job page
├── JobRunPage.tsx       # Jobs execution page
├── JobRunsPage.tsx      # Jobs executions page
├── JobsPage.tsx         # Jobs page
├── RolePage.tsx         # Role page
├── RolesPage.tsx        # Roles page
├── ScriptLogPage.tsx    # Script log page
├── ScriptLogsPage.tsx   # Script logs page
├── ScriptPage.tsx       # Script page
├── ScriptsPage.tsx      # Scripts page
├── SoapLogPage.tsx      # SOAP log page
├── SoapLogsPage.tsx     # SOAP logs page
├── TokenPage.tsx        # Token page
├── TokensPage.tsx       # Tokens page
├── UserPage.tsx         # User page
└── UsersPage.tsx        # Users page
```

### 📁 `theme/`

Flowbite theme extensions and custom styles. This folder contains any overrides or additions to the default Flowbite theme.

- `theme/customTheme.ts` — Custom Flowbite theme configuration

### 📁 `utils/`

Utility functions and helpers that are specific to the frontend. These should not contain any backend logic or shared utilities.

- `utils/concurrency.ts` — functionality to support NetSuite concurrency reporting
- `utils/date.ts` — Date formatting and parsing

---

## 📦 Dependencies

This workspace requires the following tools and libraries:

- **Yarn (Berry)** — v4.9.2 (workspace and package manager)

### Runtime Dependencies

Installed via `package.json`:

- **React** — 18.3.x (UI library)
- **React DOM** — 18.3.x (DOM renderer)
- **React Router DOM** — 6.22.x (routing)
- **React Hook Form** — ^7.60.x (form state management)
- **Flowbite** — ^3.1.x (UI components)
- **Flowbite React** — 0.10.x (React bindings for Flowbite)
- **React Data Grid** — 7.0.0‑beta.x (data grid component)
- **D3** — 7.9.x (data visualization)
- **@suiteworks/suitetools-shared** — workspace module (shared logic)

### Development Dependencies

Installed via `package.json`:

- **TypeScript** — 5.7.x (type safety)
- **Vite** — 4.5.x (build tool)
- **@vitejs/plugin-react** — 4.5.x (React plugin for Vite)
- **Tailwind CSS** — 3.3.x (utility‑first styling)
- **PostCSS** — 8.5.x (CSS transformations)
  - `postcss-import`, `postcss-nested`, `postcss-nesting` (CSS preprocessing)
- **Autoprefixer** — 10.4.x (CSS vendor prefixing)
- **ESLint + plugins** — linting rules (`eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-import`, `eslint-plugin-react-refresh`)
- **Prettier** — 3.3.x (code formatting)
- **@typescript-eslint/eslint-plugin / parser** — TypeScript linting support
- **@types/react / @types/react-dom / @types/d3** — type definitions
- **Globals** — ^16.x (ESLint globals config)

---

## React

### React Contexts

This folder contains **React context objects** and their Providers for app‑wide or cross‑feature state.

#### React Context Pattern

- **`XContext.tsx`** → exports the `XContext` object and, optionally, its Provider.
- Provider components manage state with React hooks and supply values to descendants.
- Consumers use a matching `useX` hook in `/hooks`.

#### React Context Examples

- `AppSettingsContext`
  Provider loads suite‑wide settings from the NetSuite API and exposes `{ settings, loading }`.
- `InlineMessageContext`
  Provider holds a short‑lived “inline message” (success/error/info/warning) with auto‑clear timers.

#### React Context Guidelines

1. **Keep context state minimal** — store only what’s needed globally; localise other state.
2. **Pair each context with a custom hook** — e.g., `useAppSettingsContext` in `/hooks`.
3. **Throw on missing provider** in custom hooks — helps contributors catch setup errors early.
4. **Name consistently** — `XContext`, `XProvider`, `useX` triple.

### React Hooks

This folder contains **custom React hooks** (`useX`) used in the SuiteTools UI layer.

#### React Hook Pattern

- **Name starts with `use`**
  Signals it’s a hook and must follow React’s [Rules of Hooks](https://reactjs.org/docs/hooks-rules.html).

- **No JSX returned**
  Hooks return values/functions, not rendered UI. If you return JSX, it belongs in a component.

- **Focused, reusable logic**
  Encapsulate one piece of behaviour (e.g., triggering the AppErrorBoundary, debouncing input, reading context).

#### React Hook Examples

- `useAppSettingsContext` → Reads from `AppSettingsContext` and returns settings + loading state.
- `useInlineMessage` → Reads from `InlineMessageContext` for showing temporary messages.
- `useErrorBoundaryTrigger` → Schedules an error to be thrown in render so `AppErrorBoundary` can show the dev overlay in **development mode**.

#### React Hook Guidelines

1. **One hook per file** — keep names and file contents aligned.
2. **Keep hooks UI‑specific** — avoid importing server‑only modules or schema code.
3. **Prefer composition over config flags** — build small hooks and combine them in components.
4. **Type everything** — especially arguments and return values, for DX consistency.

---

## 🗒️ Stewardship Notes

- Update when React, Vite, or Tailwind versions change
- Review annually for structure drift and component patterns
