// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file errors/index.ts
 * @description
 * Root barrel for SuiteTools error system.
 *
 * Curates and re‑exports.
 *
 * Consumers should import from this file rather than deep paths.
 */

// Base error class
export * from "./base";

// contracts
export * from "./contracts";

// Domain errors
export * from "./domain";

// Integration errors
export * from "./integration";

// Utilities
export * from "./utils"; // factories, guards, handleError

// Vendor errors/types
export * from "./vendors";
