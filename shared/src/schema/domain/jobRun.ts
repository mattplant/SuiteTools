// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

/**
 * Zod schema for a single JobRun record.
 *
 * Multi-word SuiteQL fields use camelCase wire keys (`jobId`, `jobName`).
 * The RESTlet cleaner remaps SuiteQL lowercase aliases before validation.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `created`: ISO8601 string (validated via `Date.parse`)
 * - `jobId`: numeric identifier for the job
 * - `jobName`: name of the job (empty when SuiteQL returns null)
 * - `completed`: boolean indicating if the job run is completed
 * - `results`: optional string containing results or payload
 * - `urlDetail`: optional URL for additional context
 * - `urlJob`: optional URL for the job details
 */
export const JobRunSchema = z.object({
  id: zNetSuite.numberFromString.schema,
  created: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid ISO timestamp" }),
  jobId: zNetSuite.numberFromString.schema,
  jobName: zNetSuite.stringOrEmpty.schema,
  completed: zNetSuite.booleanFromTF.schema,
  results: z.string().optional().nullable(),
  // additional properties
  urlDetail: z.string().optional(),
  urlJob: z.string().optional(),
});

const JobRunBundle: ZEntityBundle<typeof JobRunSchema, "JobRun"> = zHelpers.zCreateBundle(JobRunSchema, {
  meta: { entity: "JobRun", plural: "JobRuns" },
});

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { JobRunBundle };
export type JobRun = typeof JobRunBundle.types.single;
export type JobRuns = typeof JobRunBundle.types.array;

// Convenience union for single entity
export const jobRunOrNotFoundSchema = orNotFoundSchema(JobRunSchema);
export type JobRunOrNotFound = OrNotFound<JobRun>;

// Convenience union for multiple entities
export const jobRunsOrNotFoundSchema = orNotFoundSchema(z.array(JobRunSchema));
export type JobRunsOrNotFound = OrNotFound<JobRuns>;
