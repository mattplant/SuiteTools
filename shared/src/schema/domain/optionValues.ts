import { z } from "zod";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";

import { orNotFoundSchema, OrNotFound } from "./utils/orNotFound";

/**
 * Zod schema for an Option Value record.
 *
 * Fields:
 * - `value`: the internal value of the option
 * - `text`: the display text of the option
 */
const schema = z.object({
  value: z.string(),
  text: z.string(),
});

const OptionValueBundle: ZEntityBundle<typeof schema, "OptionValue"> =
  zHelpers.zCreateBundle(schema, {
    meta: { entity: "OptionValue", plural: "OptionValues" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { OptionValueBundle };
export type OptionValue = typeof OptionValueBundle.types.single;
export type OptionValues = typeof OptionValueBundle.types.array;

// ----- Convenience union for single OptionValue -----
export const optionValueOrNotFoundSchema = orNotFoundSchema(schema);
export type OptionValueOrNotFound = OrNotFound<OptionValue>;

// ----- Convenience union for multiple OptionValues -----
export const optionValuesOrNotFoundSchema = orNotFoundSchema(
  OptionValueBundle.schema.array()
);
export type OptionValuesOrNotFound = OrNotFound<OptionValues>;
