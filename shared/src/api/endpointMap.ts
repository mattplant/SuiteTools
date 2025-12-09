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

/** Frozen map of API endpoint names to their descriptions. */
export const endpointMap = Object.freeze({
  role: "Fetch a single role by ID",
  roles: "List roles with optional filters",
  scriptLog: "Fetch a single script log by ID",
  scriptLogs: "List script logs with optional filters",
  user: "Fetch a single user by ID",
  users: "List users with optional filters",
  optionValues: "List option values",
} as const);

/** Union type of all valid endpoint names. */
export type EndpointName = keyof typeof endpointMap;

/** Endpoint names that do not end with "s". */
export type SingularEntityName =
  Extract<EndpointName, `${string}`> extends infer T
    ? T extends `${infer _}s`
      ? never
      : T
    : never;

/** Endpoint names that end with "s". */
export type PluralEntityName = Extract<EndpointName, `${string}s`>;

/** Helper array of endpoint names for safe iteration. */
export const endpointNames = Object.keys(endpointMap) as EndpointName[];
