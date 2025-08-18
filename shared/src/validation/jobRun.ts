import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import { zHelpers } from "./zodUtils";
import type { ZEntityBundleWithoutNormalize } from "./zodUtils";

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
  id: z.number(),
  created: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO timestamp",
  }),
  jobid: z.number(),
  jobname: z.string(),
  completed: zNetSuite.booleanFromTF.schema,
  results: z.string().optional().nullable(),
  // additional properties
  urlDetail: z.string().optional(),
  urlJob: z.string().optional(),
});

const JobRunBundle: ZEntityBundleWithoutNormalize<
  typeof JobRunSchema,
  "JobRun"
> = zHelpers.zCreateEntity(JobRunSchema, {
  meta: { entity: "JobRun" },
});

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { JobRunBundle };
export type JobRun = typeof JobRunBundle.types.single;
export type JobRuns = typeof JobRunBundle.types.array;
