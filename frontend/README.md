# SuiteTools Frontend

<!-- License badges: keep in sync with LICENSE and LICENSE-DOCS.md -->
[![Source License: GPL-3.0-or-later](https://img.shields.io/badge/License-GPLv3+-blue.svg)](./LICENSE)
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../LICENSE-DOCS.md)
[![Attribution Guide](https://img.shields.io/badge/Attribution%20Formats-docs%2FATTRIBUTION.md-blue)](../docs/ATTRIBUTION.md)

This is the **frontend workspace** for the SuiteTools project.

It provides the user interface and client-side logic for interacting with SuiteTools, built on top of the shared workspace and other internal modules. This workspace is responsible for rendering views, managing client-side state, handling user input, and communicating with backend APIs.

See the parent directory [README](../README.md) for more information about the SuiteTools project.

## Structure

The frontend workspace is organized for clarity, modularity, and long-term maintainability. Each folder has a clear purpose and avoids ambiguous overlap with shared or backend concerns.

```plaintext
frontend/
├── src/          # Frontend source code
│   ├── adapters/    # Adapters for transforming data between frontend and backend shapes
│   │   ├── api/        # API request/response transformations
│   ├── components/  # UI components orgarnized in a hybrid structure
│   │   ├── features/   # Feature-specific composites
│   │   ├── layout/     # Top-level layouts (AppLayout, Header, Footer)
│   │   └── shared/     # Shared components
│   │       ├── context/   # React contexts + providers for global/cross‑feature state
│   │       ├── errors/    # Error display components
│   │       └── ui/        # Reusable UI primitives (buttons, modals, etc.)
│   ├── hooks/       # Feature‑agnostic UI hooks (can consume contexts)
│   ├── lib/         # Frontend-specific utilities and helpers
│   │   └── netsuite/   # NetSuite-specific utilities
│   ├── pages/       # Top-level route views
│   ├── routes/      # App routing configuration
│   ├── theme/       # Flowbite theme extensions and custom styles
│   └── utils/       # Frontend-specific utility functions and helpers
├── .gitignore          # Git ignore file for frontend
├── .prettierignore     # Prettier ignore
├── .prettierrc         # Prettier configuration
├── index.html          # Main HTML entry point
├── LICENSE             # The GPL-3.0-or-later license file
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

For a deep dive into our hybrid component structure, see [COMPONENTS.md](./COMPONENTS.md).

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

## Design Principles

- **Type Safety First** — All modules are written in TypeScript.
- **Frontend-Only Logic** — Avoid importing backend or shared modules that assume Node.js or server context.
- **Composable Views** — Pages should be composed from reusable components and hooks, not monolithic logic.
- **DX Matters** — All code should be easy to read, test, and onboard into.

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

#### React HookGuidelines

1. **One hook per file** — keep names and file contents aligned.
2. **Keep hooks UI‑specific** — avoid importing server‑only modules or schema code.
3. **Prefer composition over config flags** — build small hooks and combine them in components.
4. **Type everything** — especially arguments and return values, for DX consistency.

> 📚 This workspace is part of the SuiteTools monorepo.
> Licensing and contributor guidelines are defined at the [root README](../README.md).
> Documentation is covered by [CC BY 4.0](../LICENSE-DOCS.md); source code by [GPL-3.0-or-later](../LICENSE).

_Last updated: August 30, 2025_
