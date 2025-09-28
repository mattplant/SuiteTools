// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file endpointMap.ts
 * @description
 * Central registry of API endpoint identifiers and their descriptions.
 *
 * Provides:
 * - A frozen map of endpoint names to human‑readable descriptions
 * - A derived `EndpointName` type for compile‑time safety
 * - A helper array `endpointNames` for safe iteration
 *
 * Consumers should use `EndpointName` instead of hard‑coding strings.
 */

export const endpointMap = {
  user: "Fetch a single user by ID",
  users: "List users with optional filters",
  optionValues: "Retrieve option values",
} as const;

/** Union type of all valid endpoint names. */
export type EndpointName = keyof typeof endpointMap;

/** Helper array of endpoint names for safe iteration. */
export const endpointNames = Object.keys(endpointMap) as EndpointName[];
