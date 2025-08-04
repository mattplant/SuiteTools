# SuiteTools Frontend

This is the **frontend workspace** for the SuiteTools project.

It provides the user interface and client-side logic for interacting with SuiteTools, built on top of the shared workspace and other internal modules. This workspace is responsible for rendering views, managing client-side state, handling user input, and communicating with backend APIs.

See the parent directory [README](../README.md) for more information about the SuiteTools project and how to install and use it.

## 🧱 Structure

The frontend workspace is organized for clarity, modularity, and long-term maintainability. Each folder has a clear purpose and avoids ambiguous overlap with shared or backend concerns.

```plaintext
frontend/
├── src/
│   ├── api/
│   ├── components/
│   │   ├── features/
│   │   │   ├── concurrency/
│   │   │   └── script-log/
│   │   ├── layout/
│   │   └── shared/
│   ├── lib/
│   ├── pages/
│   ├── theme/
│   └── utils/
├── LICENSE
└── README.md
```

Currently only listing the src folder, as this is the main development area. The structure is designed to separate concerns and promote reusability.

**TODO:** Expand out document to include other folders besides `/src`
**TODO:** Break out the `/src/components/` section into it own page

### 📁 `api/`

API client modules for communicating with backend endpoints. These should be thin wrappers around fetch or axios calls, handling request/response transformations.

- `api/api.ts` — Frontend API functionality
- `api/types.ts` — Type definitions for API responses and requests

### 📁 `components/`

Reusable React components, organized by domain or type. These are UI-only and should not contain business logic or validation schemas.

SuiteTools uses a hybrid structure for components, separating shared UI elements from feature-specific composites. This allows for better reuse and clearer organization.

#### 📁 `features/`

Feature-specific components that combine multiple atomic elements into cohesive UI blocks.

- `components/features/concurrency/` — Components related to concurrency features
- `components/features/file/` — Components related to file features
- `components/features/integration/` — Components related to integration features
- `components/features/job/` — Components related to job features
- `components/features/login/` — Components related to login features
- `components/features/role/` — Components related to role features
- `components/features/script/` — Components related to script features
- `components/features/scriptLog/` — Components related to script log features
- `components/features/settings/` — Components related to settings features
- `components/features/soapLog/` — Components related to SOAP log features
- `components/features/token/` — Components related to token features
- `components/features/user/` — Components related to user features

#### 📁 `layout/`

Layout components that define the overall structure of pages, such as headers, footers, and sidebars. These should be composable and reusable across different views.

- `layout/AppLayout.tsx` — Main application layout
- `layout/Header.tsx` — Top navigation bar

#### 📁 `shared/`

UI components that can be reused across different features. These should be self-contained and not depend on any specific feature logic.

- `components/shared/context/` — React context providers for managing global state, such as authentication, theme, or user preferences
- `components/shared/criteria` — Reusable criteria components for filtering and searching
- `components/shared/messages` — Components for displaying inline messages and notifications
- `components/shared/results` — Components for displaying results, including tables and export functionality
- `components/shared/ui/` — Custom UI components that are not included in `flowbite-react` or other imported libraries like `react-data-grid`

### 📁 `lib/`

Frontend-specific utilities and helpers.

- `lib/netsuite/` — NetSuite specific utilities for data collection and manipulation
  - `lib/netsuite/collectData.ts` — Functions to extract data from NetSuite pages

> 🧼 Keep `lib/` lean and focused. Anything reusable across workspaces should live in `shared/`.

### 📁 `pages/`

Top-level route views, typically matching the app’s routing structure. Each page may compose multiple components and handle its own data fetching and error boundaries.

See code for pages.

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
