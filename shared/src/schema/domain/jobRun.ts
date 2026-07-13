// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

/**
 * Normalize SuiteQL job-run payloads before validation.
 * Accepts legacy camelCase aliases (`jobId` / `jobName`) and maps them to schema keys.
 */
function normalizeJobRunInput(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const record = value as Record<string, unknown>;
  return {
    ...record,
    jobid: record.jobid ?? record.jobId,
    jobname: record.jobname ?? record.jobName,
  };
}

/**
 * Zod schema for a single JobRun record.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `created`: ISO8601 string (validated via `Date.parse`)
 * - `jobid`: numeric identifier for the job
 * - `jobname`: name of the job
 * - `completed`: boolean indicating if the job run is completed
 * - `results`: optional string containing results or payload
 * - `urlDetail`: optional URL for additional context
 * - `urlJob`: optional URL for the job details
 */
export const JobRunSchema = z.object({
  id: zNetSuite.numberFromString.schema,
  created: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO timestamp",
  }),
  jobid: zNetSuite.numberFromString.schema,
  jobname: z.string(),
  completed: zNetSuite.booleanFromTF.schema,
  results: z.string().optional().nullable(),
  // additional properties
  urlDetail: z.string().optional(),
  urlJob: z.string().optional(),
});

const JobRunBundle: ZEntityBundle<typeof JobRunSchema, "JobRun"> =
  zHelpers.zCreateBundle(JobRunSchema, {
    meta: { entity: "JobRun", plural: "JobRuns" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { JobRunBundle };
export type JobRun = typeof JobRunBundle.types.single;
export type JobRuns = typeof JobRunBundle.types.array;

// Convenience union for single entity
export const jobRunOrNotFoundSchema = orNotFoundSchema(
  z.preprocess(normalizeJobRunInput, JobRunSchema)
);
export type JobRunOrNotFound = OrNotFound<JobRun>;

// Convenience union for multiple entities
export const jobRunsOrNotFoundSchema = orNotFoundSchema(
  z.array(z.preprocess(normalizeJobRunInput, JobRunSchema))
);
export type JobRunsOrNotFound = OrNotFound<JobRuns>;
