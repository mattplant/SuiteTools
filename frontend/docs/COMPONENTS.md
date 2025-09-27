# SuiteTools Components

> Part of the SuiteTools frontend workspace documentation set.
> See `/frontend/README.md` and `/docs/governance` for related policies and resources.

Last updated: September 22, 2025

<!-- License badges: keep in sync with LICENSE, LICENSE-DOCS.md and ATTRIBUTION.md -->
[![Docs License: CC BY 4.0](https://img.shields.io/badge/Docs%20License-CC%20BY%204.0-lightgrey.svg)](../../LICENSE-DOCS.md) [![Source Code License: GPLv3-or-later](https://img.shields.io/badge/Source%20Code-GPLv3--or--later-yellow.svg)](../../LICENSE)
[![Attribution Formats](https://img.shields.io/badge/Attribution%20Formats-Markdown%20%26%20Plain%20Text-blue)](../../ATTRIBUTION.md) [![Source: SuiteTools](https://img.shields.io/badge/Source-SuiteTools-green)](https://github.com/mattplant/SuiteTools/)

---

## 🎯 Purpose & Scope

This document defines the structure and conventions for SuiteTools frontend React components.
Components are UI‑only, reusable, and organized into features, layouts, and shared modules.

Reusable React components using a hybrid structure for better reuse and clearer organization.

**Out of scope:** business logic, validation schemas, or backend‑specific utilities.

See the frontend [README](../README.md) for more information about the SuiteTools frontend workspace.

---

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

---

## 📁 `layout/`

Layout components that define the overall structure of pages, such as headers, footers, and sidebars. These should be composable and reusable across different views.

- `layout/AppLayout.tsx` — Main application layout
- `layout/Header.tsx` — Top navigation bar
- `layout/Footer.tsx` — Footer section

---

## 📁 `shared/`

UI components that can be reused across different features. These should be self-contained and not depend on any specific feature logic.

- `components/shared/context/` — React context providers for managing global state, such as authentication, theme, or user preferences
- `components/shared/criteria` — Reusable criteria components for filtering and searching
- `components/shared/errors` — Error display components <!-- TODO: should I use feedback instead? What about messages? -->
- `components/shared/results` — Components for displaying results, including tables and export functionality
- `components/shared/ui/` — Custom UI components that are not included in `flowbite-react` or other imported libraries like `react-data-grid`

---

## 🔗 Related

- [Frontend Workspace](../README.md)

## 🗒️ Stewardship Notes

- Review and update when underlying UI or build dependencies evolve.
