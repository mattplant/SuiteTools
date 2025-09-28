// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file schema/index.ts
 * @description
 * Root barrel for SuiteTools schema system.
 *
 * Curates and re‑exports:
 * - NetSuite schemas
 * - API schemas
 * - Domain schemas
 * - Domain schema utilities
 * - Type guards
 *
 * Consumers should import from this file rather than deep paths.
 */

// NetSuite schemas
export * from "./zNetSuite";

// API schemas
export * from "./api";

// Domain schemas
export * from "./domain";

// Type guards
export * from "../typeGuards";
