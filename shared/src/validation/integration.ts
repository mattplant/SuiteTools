import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import { zHelpers } from "./zodUtils";
import type { ZEntityBundle } from "./zodUtils";

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
export const IntegrationSchema = z.object({
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

const IntegrationBundle: ZEntityBundle<
  typeof IntegrationSchema,
  "Integration"
> = zHelpers.zCreateBundle(IntegrationSchema, {
  meta: { entity: "Integration", plural: "Integrations" },
});

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { IntegrationBundle };
export type Integration = typeof IntegrationBundle.types.single;
export type Integrations = typeof IntegrationBundle.types.array;
