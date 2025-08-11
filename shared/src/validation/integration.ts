import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import type { ZodBundle } from "./zodUtils";

/**
 * Zod schema for a single Integration record.
 *
 * Fields:
 * - `id`: number
 * - `name`: string
 * - `applicationId`: string
 * - `state`: string
 * - `dateCreated`: string (ISO date format)
 * - `lastLogin`: string (optional, ISO date format)
 * - `urlNs`: string (optional)
 * - `urlDetail`: string (optional)
 */
export const BaseIntegration = z.object({
  id: z.number(),
  name: z.string(),
  applicationId: z.string(),
  state: z.string(),
  dateCreated: z.string(),
  lastLogin: z.string().optional(),
  // additional properties
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

/**
 * Currently no transformations are applied to the Integration schema.
 */
const CleanedIntegration = BaseIntegration.transform((data) => {
  return data;
});

export type Integration = z.infer<typeof CleanedIntegration>;
export type Integrations = Integration[];

/**
 * Bundled schema + helpers for Integration
 */
export const Integration: ZodBundle<Integration> =
  zNetSuite.createBundle(CleanedIntegration);
