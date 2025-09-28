// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file schema/api/index.ts
 * @description
 * Barrel for API-level schemas.
 *
 * Curates and re‑exports:
 * - Endpoint definitions
 * - HTTP response schemas
 * - Request body schemas
 * - Request/response wrappers
 *
 * Consumers should import from this file rather than deep paths.
 */

export * from "./endpoints";
export * from "./httpResponse";
export * from "./requestBody";
export * from "./requestResponse";
