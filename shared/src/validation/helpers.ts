import * as z from "zod";

/**
 * Creates a Zod schema for validating date strings, timestamps, or Date objects.
 *
 * This schema will parse valid date strings and timestamps into JavaScript Date objects,
 * and will throw an error if the input is not a valid date.
 */
export function createZodDate(): z.ZodType<Date> {
  return z.coerce.date().refine((d) => !isNaN(d.getTime()), {
    message: "Expected a valid date string, timestamp, or Date object",
  });
}

/**
 * Generates a set of schema‐bound helpers for parsing and validating data.
 *
 * @template S extends z.ZodTypeAny
 * @param {S} schema
 *   The Zod schema that all helper methods will delegate to.
 * @returns {{
 *   assert(input: unknown): asserts input is z.infer<S>;
 *   parse(input: unknown): z.infer<S>;
 *   safeParse(input: unknown): ReturnType<S["safeParse"]>;
 * }}
 *   An object containing:
 *     - assert: throws if validation fails, otherwise narrows `input` to the schema type
 *     - parse: returns the parsed value or throws on failure
 *     - safeParse: returns a `{ success: boolean; data?: T; error?: ZodError }` result
 */
export function createSchemaHelpers<S extends z.ZodTypeAny>(
  schema: S
): {
  assert: (input: unknown) => asserts input is z.infer<S>;
  parse: (input: unknown) => z.infer<S>;
  safeParse: (input: unknown) => ReturnType<S["safeParse"]>;
} {
  return {
    /**
     * Asserts that `input` conforms to the schema.
     *
     * @param {unknown} input
     *   The value to validate.
     * @throws {z.ZodError}
     *   If `input` does not match the schema.
     */
    assert(input): asserts input is z.infer<S> {
      schema.parse(input);
    },

    /**
     * Parses `input` and returns the validated data.
     *
     * @param {unknown} input
     *   The value to parse.
     * @returns {z.infer<S>}
     *   The parsed and validated value.
     * @throws {z.ZodError}
     *   If parsing fails.
     */
    parse(input) {
      return schema.parse(input);
    },

    /**
     * Safely parses `input`, returning a success flag and either the data or the error.
     *
     * @param {unknown} input
     *   The value to parse.
     * @returns {ReturnType<S["safeParse"]>}
     *   An object of the form `{ success: true; data: T }` or `{ success: false; error: ZodError }`.
     */
    safeParse: ((input: unknown) => schema.safeParse(input)) as (
      input: unknown
    ) => ReturnType<S["safeParse"]>,
  };
}
