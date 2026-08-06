// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

/**
 * Accept legacy flat SuiteQL keys (`jobid` / `jobname`) and map them to camelCase.
 */
function normalizeJobRunInput(value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  const record = value as Record<string, unknown>;
  return {
    ...record,
    jobId: record.jobId ?? record.jobid,
    jobName: record.jobName ?? record.jobname,
  };
}

/**
 * Zod schema for a single JobRun record.
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
const JobRunSchemaInner = z.object({
  id: zNetSuite.numberFromString.schema,
  created: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO timestamp",
  }),
  jobId: zNetSuite.numberFromString.schema,
  jobName: zNetSuite.stringOrEmpty.schema,
  completed: zNetSuite.booleanFromTF.schema,
  results: z.string().optional().nullable(),
  // additional properties
  urlDetail: z.string().optional(),
  urlJob: z.string().optional(),
});

export const JobRunSchema = z.preprocess(
  normalizeJobRunInput,
  JobRunSchemaInner
);

const JobRunBundle: ZEntityBundle<typeof JobRunSchemaInner, "JobRun"> =
  zHelpers.zCreateBundle(JobRunSchemaInner, {
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
export const jobRunsOrNotFoundSchema = orNotFoundSchema(
  z.array(JobRunSchema)
);
export type JobRunsOrNotFound = OrNotFound<JobRuns>;
