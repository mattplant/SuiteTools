# SuiteTools Frontend

This is the **frontend workspace** for the SuiteTools project.

It provides the user interface and client-side logic for interacting with SuiteTools, built on top of the shared workspace and other internal modules. This workspace is responsible for rendering views, managing client-side state, handling user input, and communicating with backend APIs.

See the parent directory [README](../README.md) for more information about the SuiteTools project.

## 🧱 Structure

The frontend workspace is organized for clarity, modularity, and long-term maintainability. Each folder has a clear purpose and avoids ambiguous overlap with shared or backend concerns.

```plaintext
frontend/
├── src/          # Frontend source code
│   ├── api/         # API client modules for communicating with backend endpoints
│   ├── components/  # UI components orgarnized in a hybrid structure
│   │   ├── features/   # Feature-specific composites and data hooks
│   │   ├── layout/     # Top-level layouts (AppLayout, Header)
│   │   └── shared/.    # shared components
│   ├── lib/
│   ├── pages/
│   ├── theme/
│   └── utils/
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

### 📁 `api/`

API client modules for communicating with backend endpoints. These should be thin wrappers around fetch or axios calls, handling request/response transformations.

- `api/api.ts` — Frontend API functionality
- `api/types.ts` — Type definitions for API responses and requests

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

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](LICENSE). By using this project, you agree to comply with the terms of the license.
