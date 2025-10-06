import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";

/**
 * Zod schema for a single Job record.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `name`: name of the job
 * - `isinactive`: boolean indicating if the job is inactive
 * - `config`: JSON string configuration for the job
 * - `description`: description of the job
 * - `scheduled`: boolean indicating if the job is scheduled
 * - `notify`: boolean indicating if notifications are enabled
 * - `lastRun`: optional timestamp of the last run
 * - `urlDetail`: optional URL for additional context
 */
const JobSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
  isinactive: zNetSuite.booleanFromTF.schema,
  config: zNetSuite.stringOrEmpty.schema, // JSON string configuration
  description: z.string(),
  scheduled: zNetSuite.booleanFromTF.schema,
  notify: zNetSuite.booleanFromTF.schema,
  lastRun: zNetSuite.dateFromString.schema.optional(),
  urlDetail: z.string().optional(),
  json: z.string().optional(),
});

const NormalizedJobSchema = JobSchema.transform((data) => {
  data.json = JSON.stringify(zHelpers.toJSON(data));

  return data;
});

const JobBundle = zHelpers.zCreateBundle(JobSchema, {
  meta: { entity: "Job", plural: "Jobs", displayName: "Job Record" },
  normalize: (data: z.output<typeof JobSchema>) =>
    NormalizedJobSchema.parse(data),
});

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { JobBundle };
export type Job = typeof JobBundle.types.single;
export type Jobs = typeof JobBundle.types.array;
