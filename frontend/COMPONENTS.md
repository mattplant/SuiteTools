# SuiteTools Components

Reusable React components using a hybrid structure for better reuse and clearer organization.

These are UI-only and should not contain business logic or validation schemas.

## 📁 `features/`

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

## 📁 `layout/`

Layout components that define the overall structure of pages, such as headers, footers, and sidebars. These should be composable and reusable across different views.

- `layout/AppLayout.tsx` — Main application layout
- `layout/Header.tsx` — Top navigation bar

## 📁 `shared/`

UI components that can be reused across different features. These should be self-contained and not depend on any specific feature logic.

- `components/shared/context/` — React context providers for managing global state, such as authentication, theme, or user preferences
- `components/shared/criteria` — Reusable criteria components for filtering and searching
- `components/shared/errors` — Error display components (TODO: should I use feedback instead? What about messages?)
- `components/shared/results` — Components for displaying results, including tables and export functionality
- `components/shared/ui/` — Custom UI components that are not included in `flowbite-react` or other imported libraries like `react-data-grid`

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](LICENSE). By using this project, you agree to comply with the terms of the license.
