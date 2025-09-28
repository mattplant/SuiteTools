// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file errors/index.ts
 * @description
 * Root barrel for SuiteTools error system.
 *
 * Curates and re‑exports:
 * - Base error class (SuiteError)
 * - Domain‑level errors (via ./domain)
 * - API‑level errors (via ./api)
 * - Integration‑level errors (via ./integration)
 * - Vendor error types (via ./vendors)
 * - Utilities (via ./utils)
 *
 * Consumers should import from this file rather than deep paths.
 */

// Base
export * from "./base";

// Domain errors
export * from "./domain";

// Integration errors
export * from "./integration";

// Vendor errors/types
export * from "./vendors";

// Utilities
export * from "./utils"; // factories, guards, handleError
