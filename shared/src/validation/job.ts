import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import { zHelpers } from "./zodUtils";
// import type { BundleOf, BundleArrayOf } from "./zodUtils";
import type { ZEntityBundleWithoutNormalize } from "./zodUtils";
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
  isinactive: z.boolean(),
  config: zNetSuite.stringOrEmpty.schema, // JSON string configuration
  description: z.string(),
  scheduled: zNetSuite.booleanFromTF.schema,
  notify: zNetSuite.booleanFromTF.schema,
  lastRun: z.string().optional(),
  urlDetail: z.string().optional(),
});

// /**
//  * Currently no transformations are applied to the Job schema.
//  */
// const NormalizedJobSchema = JobSchema.transform((data) => data);

// /**
//  * Bundled schema + helpers.
//  */
// // const JobBundle = zNetSuite.createBundle(NormalizedJobSchema);
// export const JobBundle: ReturnType<
//   typeof zNetSuite.createBundle<typeof NormalizedJobSchema>
// > = zNetSuite.createBundle(NormalizedJobSchema);

// /**
//  * Output type of the schema.
//  */
// type Job = BundleOf<typeof JobBundle>;

// /**
//  * Output type of the array schema.
//  */
// type Jobs = BundleArrayOf<typeof JobBundle>;

// const JobBundle = zHelpers.zCreateEntity(JobSchema);
// const JobBundle = zHelpers.zCreateEntity(JobSchema, {
//   normalize: (data) => ({ ...data, name: data.name.trim() }),
// });
// const JobBundle = zHelpers.zCreateEntity(JobSchema, {
//   // export const JobBundle: ZEntityBundle<typeof schema, Job> = zCreateEntity(schema);
//   // normalize: (d) => ({ ...d, name: d.name.trim() }),
//   meta: {
//     entity: "Job",
//     displayName: "Job Record",
//     plural: "Jobs",
//     version: "v1",
//   },
// });

// const JobBundle = zHelpers.zCreateEntity(JobSchema);

const JobBundle: ZEntityBundleWithoutNormalize<typeof JobSchema, "Job"> =
  zHelpers.zCreateEntity(JobSchema, {
    meta: { entity: "Job" },
  });

// JobBundle.assert(data);

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

// export const JobSchema = JobBundle.schema; // optional
// export const JobMeta = JobBundle.meta; // optional

export { JobBundle };
export type Job = typeof JobBundle.types.single;
export type Jobs = typeof JobBundle.types.array;

/**
 * Input and output types for the Job schema.
 */
export type JobIn = typeof JobBundle.types.input;
export type JobOut = typeof JobBundle.types.output;
