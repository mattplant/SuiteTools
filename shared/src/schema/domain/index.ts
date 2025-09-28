// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file schema/domain/index.ts
 * @description
 * Barrel for domain-level schemas.
 *
 * Curates and re‑exports all domain schema definitions
 * (e.g., user, role, job, script, etc.) and domain schema
 * utilities so consumers can import them from a single entry point.
 */

export * from "./file";
export * from "./integration";
export * from "./job";
export * from "./jobRun";
export * from "./login";
export * from "./optionValues";
export * from "./role";
export * from "./script";
export * from "./scriptLog";
export * from "./soapLog";
export * from "./token";
export * from "./user";

// Domain schema utilities
export * from "./utils";
