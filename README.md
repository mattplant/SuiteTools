# SuiteTools README

Welcome to the **SuiteTools** — *the missing NetSuite tools* — monorepo! This repository contains a cohesive suite of tools designed to enhance the NetSuite admin experience, bridging gaps in the native UI and delivering faster workflows, richer insights, and an intuitive experience.

## Summary

SuiteTools is a cohesive suite of NetSuite admin tools that bridge gaps in the native NetSuite UI, delivering faster workflows, richer insights, and an intuitive experience.

SuiteTools fills in the blind spots with high-value tools that minimize friction including:

- Script Logs - Scroll through complete execution logs in one view, with advanced filtering
- Concurrency Dashboard - See precise* concurrency metrics instead of coarse 25% buckets along with full details without paging
- Integration Manager - Configure and monitor external integrations with an organized, user-friendly interface

## Design

Under the hood, SuiteTools is a modular monorepo:

- React + TypeScript **frontend** powered by Vite and Flowbite-React for rapid iteration and consistent styling
- SuiteCloud Development Framework (SDF) **backend** for seamless NetSuite deployments
- Centralized **shared** workspace with TypeScript types, Zod validation schemas, and utility functions

This design delivers:

- A unified developer environment with consistent linting, formatting, and build tooling
- One source of truth for data shapes and validation
- Modular, composable feature development for rapid scaling

For detailed design information, see the [Architecture Overview](docs/architecture.md).

## Structure

```plaintext
SuiteTools monorepo
├── .vscode/       # VS Code workspace settings
│   ├── extensions.json   # recommended extensions
│   ├── settings.json     # workspace settings
│   └── tasks.json        # workspace tasks
├── backend/       # NetSuite SDF project: SuiteScript backend code, deployment scripts, and SDF configs
├── docs/          # Documentation: overarching guides and cross-cutting documentation
├── frontend/      # React SPA: UI components, feature modules, data fetching hooks, and build setup
├── shared/        # Types & utilities: shared TypeScript types, validation schemas, and utilities
├── LICENSE        # The GPL-3.0-or-later license file
├── package.json   # Yarn workspace definition & top-level scripts
└── README.md      # This README file
```

### backend/

- Leverages my [NetSuite-TypeScript-SDF template](https://github.com/mattplant/NetSuite-TypeScript-SDF)
- Contains all backend logic, SuiteScript modules, and deployment scripts for NetSuite
- For additional information, see the [backend README](backend/README.md)

### frontend/

- Implements a single-page application with React, TypeScript, Flowbite-React components, and Zod schemas
- Organizes components in a hybrid structure:
  - components/shared/ for UI primitives and inline feedback components
  - components/features/ for feature-specific composites and data hooks
  - layout/ for top-level layouts (AppLayout, Header)
- Includes build scripts and optimized bundling via Vite
- For additional information, see the [frontend README](frontend/README.md)

### shared/

- Houses cross-workspace TypeScript types, Zod validation schemas, and utility functions
- Enables DRY principles by centralizing logic used by both frontend and backend, ensuring consistency in data shapes and validations
- For additional information, see the [shared README](shared/README.md)

## Installing SuiteTools

For detailed instructions on installing SuiteTools, see the [Installation Guide](docs/installation.md).

## Customizing SuiteTools

For detailed instructions on customizing SuiteTools, see the [Customizing Guide](docs/customizing.md).

## 📖 Documentation

See [SuiteTools Monorepo Documentation](docs/index.md) for suite-wide guides and cross-cutting patterns that apply across all workspaces.

Note that each workspace has its own documentation.

- [Frontend](frontend/README.md)
- [Backend](backend/README.md)
- [Shared](shared/README.md)

## Project Policies

### License Compliance

SuiteTools is licensed under **GPL‑3.0‑or‑later**, which carries strong copyleft requirements.
All contributors share responsibility for ensuring that every direct and transitive dependency is license‑compatible.
This safeguards legal clarity for our team, downstream users, and the open‑source community.

#### Why It Matters

- Preserves the integrity of SuiteTools’ licensing model.
- Avoids legal or distribution issues for downstream projects.
- Promotes trust and transparency with community.

#### If You Find a License Violation

If you discover a direct or transitive dependency that is **GPLv3‑incompatible**, please raise it immediately via an issue or pull request. Your vigilance helps keep SuiteTools safe, compliant, and welcoming — thank you for protecting our project’s integrity.

## License

This project is licensed under the GPL-3.0-or-later license. For detailed license terms and conditions, refer to the [LICENSE file](LICENSE). By using this project, you agree to comply with the terms of the license.
