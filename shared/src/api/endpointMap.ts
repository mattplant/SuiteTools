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
  file: "Fetch a single file by ID",
  files: "List files with optional filters",
  integration: "Fetch a single integration by ID",
  integrations: "List integrations with optional filters",
  job: "Fetch a single job by ID",
  jobs: "List jobs with optional filters",
  jobRun: "Fetch a single job run by ID",
  jobRuns: "List job runs with optional filters",
  logins: "List login audit records with optional filters",
  optionValues: "List option values",
  role: "Fetch a single role by ID",
  roles: "List roles with optional filters",
  script: "Fetch a single script by ID",
  scriptLog: "Fetch a single script log by ID",
  scriptLogs: "List script logs with optional filters",
  scripts: "List scripts with optional filters",
  settings: "Fetch SuiteTools application settings",
  token: "Fetch a single TBA access token by ID",
  tokens: "List TBA access tokens with optional filters",
  user: "Fetch a single user by ID",
  users: "List users with optional filters",
} as const);

/** Union type of all valid endpoint names. */
export type EndpointName = keyof typeof endpointMap;

/** Endpoint names that do not end with "s". */
export type SingularEntityName =
  Extract<EndpointName, `${string}`> extends infer T ? (T extends `${infer _}s` ? never : T) : never;

/** Endpoint names that end with "s". */
export type PluralEntityName = Extract<EndpointName, `${string}s`>;

/** Helper array of endpoint names for safe iteration. */
export const endpointNames = Object.keys(endpointMap) as EndpointName[];
