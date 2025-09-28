// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file errors/domain/index.ts
 * @description
 * Barrel for domain-level errors.
 *
 * Curates and re‑exports all domain error classes
 * (e.g., NotFoundError, SchemaValidationError) so consumers
 * can import them from a single entry point.
 */

export { NotFoundError } from "./not-found.error";
export { SchemaValidationError } from "./schema-validation.error";
