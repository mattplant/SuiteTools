import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import type { ZodBundle } from "./zodUtils";

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
export const BaseJobRun = z.object({
  id: z.number(),
  created: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO timestamp",
  }),
  jobid: z.number(),
  jobname: z.string(),
  completed: z.boolean().optional(),
  results: z.string().optional().nullable(),
  // additional properties
  urlDetail: z.string().optional(),
  urlJob: z.string().optional(),
});

/**
 * Currently no transformations are applied to the JobRun schema.
 */
const CleanedJobRun = BaseJobRun.transform((data) => {
  return data;
});

export type JobRun = z.infer<typeof CleanedJobRun>;
export type JobRuns = JobRun[];

/**
 * Bundled schema + helpers for JobRun
 */
export const JobRun: ZodBundle<JobRun> = zNetSuite.createBundle(CleanedJobRun);
