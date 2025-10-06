// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * SuiteTools Zod Schema Utilities
 *
 * @fileoverview
 * Bundling helpers for validation, type inference, and DX utilities
 *
 * @module zodUtils
 * @see Zod documentation https://github.com/colinhacks/zod
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { z, ZodError } from "zod";

/**
 * Enhances a Zod schema with runtime parsing and type assertion methods
 *
 * @template S - A Zod schema type.
 * @param schema -- The Zod schema to enhance.
 * @returns Object containing `assert`, `parse`, and `safeParse` utilities.
 */
function zParseHelpers<S extends z.ZodTypeAny>(schema: S) {
  return {
    /**
     * Asserts that `input` conforms to the schema.
     *
     * @param {unknown} input
     *   The value to validate.
     * @throws {z.ZodError}
     *   If `input` does not match the schema.
     */
    assert(input: unknown): asserts input is z.output<S> {
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
    parse(input: unknown): z.output<S> {
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
    safeParse(input: unknown): ReturnType<typeof schema.safeParse> {
      return schema.safeParse(input);
    },
  };
}

function toJSON<T>(data: T): Record<string, unknown> {
  return JSON.parse(JSON.stringify(data));
}

// ───────────────────────────────────────────────────────────
// Type Definitions
// ───────────────────────────────────────────────────────────

type ShapeKeys<TSchema extends z.ZodObject<any>> = keyof TSchema["shape"];

type ZEntityMeta<
  TSchema extends z.ZodObject<any>,
  TName extends string = string,
> = {
  entity?: TName; // Singular name of the entity
  version?: string; // Version of the schema
  plural: string; // Plural name of the entity
  displayName?: string; // Human-readable name for display
  /** Auto-filled when schema is a ZodObject */
  fields?: ReadonlyArray<ShapeKeys<TSchema>>;
};

type Final<
  TSchema extends z.ZodObject<any>,
  TNormalizeFn extends ((data: z.output<TSchema>) => any) | undefined,
> = TNormalizeFn extends (...a: any) => any
  ? ReturnType<NonNullable<TNormalizeFn>>
  : z.output<TSchema>;

type ZEntityTypes<TSchema extends z.ZodTypeAny, TNormalized> = {
  /** Pre-transform input type */
  input: z.input<TSchema>;
  /** Schema output type (before optional normalize) */
  output: z.output<TSchema>;
  /** Final single-item type (after optional normalize) */
  single: TNormalized;
  /** Array of final items */
  array: ReadonlyArray<TNormalized>;
};

type ZEntityBundle<
  TSchema extends z.ZodObject<any>,
  TName extends string,
  TNormalizeFn extends
    | ((data: z.output<TSchema>) => any)
    | undefined = undefined,
> = {
  schema: TSchema;
  arraySchema: z.ZodArray<TSchema>;

  parse: (input: unknown) => Final<TSchema, TNormalizeFn>;
  safeParse: (
    input: unknown
  ) =>
    | { success: true; data: Final<TSchema, TNormalizeFn> }
    | { success: false; error: ZodError<z.input<TSchema>> };

  // Explicit predicate annotations prevent TS2775
  assert: (input: unknown) => asserts input is Final<TSchema, TNormalizeFn>;

  parseMany: (
    input: ReadonlyArray<unknown>
  ) => ReadonlyArray<Final<TSchema, TNormalizeFn>>;
  safeParseMany: (
    input: unknown[] | null | undefined
  ) => ReadonlyArray<
    | { success: true; data: Final<TSchema, TNormalizeFn> }
    | { success: false; error: ZodError<z.input<TSchema>> }
  >;

  // Explicit predicate annotations prevent TS2775
  assertMany: (
    input: unknown
  ) => asserts input is ReadonlyArray<Final<TSchema, TNormalizeFn>>;

  types: ZEntityTypes<TSchema, Final<TSchema, TNormalizeFn>>;
  meta: ZEntityMeta<TSchema, TName>;

  toJSON: (data: Final<TSchema, TNormalizeFn>) => Record<string, unknown>;

  /** Optional normalization function, strictly typed if present */
  normalize?: TNormalizeFn;
};

/**
 * Creates an entity bundle from a Zod schema with optional normalization.
 *
 * @param schema - Zod schema defining the entity shape
 * @param options - Options for the bundle
 *   @param options.normalize - Optional normalization function applied after parsing
 *   @param options.meta - Metadata for the entity, including fields, plural name, and display name
 * @returns A typed entity bundle with parsing, assertion, and metadata utilities
 */
function zCreateBundle<
  const TSchema extends z.ZodObject<any>,
  const TName extends string,
  TNormalizeFn extends
    | ((data: z.output<TSchema>) => any)
    | undefined = undefined,
>(
  schema: TSchema,
  options: { normalize?: TNormalizeFn; meta: ZEntityMeta<TSchema, TName> }
): ZEntityBundle<TSchema, TName, TNormalizeFn> {
  const { normalize } = options;

  const arraySchema = z.array(schema);
  const meta = {
    ...options.meta,
    // auto-fill fields if not provided
    fields:
      options.meta.fields ??
      (Object.keys(schema.shape) as readonly ShapeKeys<TSchema>[]),
    plural:
      options.meta.plural ??
      (options.meta.entity ? `${options.meta.entity}s` : ""),
    displayName:
      options.meta.displayName ??
      (options.meta.entity ?? "").replace(/([a-z])([A-Z])/g, "$1 $2"),
  } as const;

  // Final output type
  type Final = TNormalizeFn extends (...a: any) => any
    ? ReturnType<NonNullable<TNormalizeFn>>
    : z.output<TSchema>;

  // Single-item helpers
  const parse: (input: unknown) => Final = (input) => {
    const parsed = schema.parse(input) as z.output<TSchema>;
    return normalize ? (normalize(parsed) as Final) : (parsed as Final);
  };
  const safeParse: (
    input: unknown
  ) =>
    | { success: true; data: Final }
    | { success: false; error: ZodError<z.input<TSchema>> } = (input) => {
    const res = schema.safeParse(input);
    if (!res.success) {
      return { success: false, error: res.error as ZodError<z.input<TSchema>> };
    }
    const data = normalize
      ? (normalize(res.data as z.output<TSchema>) as Final)
      : (res.data as Final);
    return { success: true, data };
  };
  const assert: (input: unknown) => asserts input is Final = (input) => {
    void parse(input); // throws if invalid; narrows on success
  };

  // Many-items helpers
  const parseMany: (input: ReadonlyArray<unknown>) => ReadonlyArray<Final> = (
    input
  ) =>
    arraySchema
      .parse(input)
      .map((val) =>
        normalize
          ? (normalize(val as z.output<TSchema>) as Final)
          : (val as Final)
      );
  const safeParseMany: (
    input: unknown[] | null | undefined
  ) => ReadonlyArray<
    | { success: true; data: Final }
    | { success: false; error: ZodError<z.input<TSchema>> }
  > = (input) => {
    if (!input) return [];
    return input.map((item) => safeParse(item));
  };
  const assertMany: (
    input: unknown
  ) => asserts input is ReadonlyArray<Final> = (input) => {
    arraySchema.parse(input);
  };

  const toJSON = (data: Final): Record<string, unknown> => {
    return JSON.parse(JSON.stringify(data));
  };

  const bundle = {
    schema,
    arraySchema,
    normalize: normalize as TNormalizeFn,
    parse,
    safeParse,
    assert,
    parseMany,
    safeParseMany,
    assertMany,
    types: undefined as unknown as ZEntityTypes<
      TSchema,
      TNormalizeFn extends (...a: any) => any
        ? ReturnType<NonNullable<TNormalizeFn>>
        : z.output<TSchema>
    >,
    meta,
    toJSON,
  } satisfies ZEntityBundle<TSchema, TName, TNormalizeFn>;

  return Object.freeze(bundle);
}

// /**
//  * Upstreamed helper: fully binds zCreateBundle’s generics.
//  * Contributors only need to pass TSchema — TName and TNormalizeFn are inferred/defaulted.
//  */
// type Bundle<
//   TSchema extends z.ZodObject<any, any>,
//   TName extends string = string,
//   TNormalizeFn extends
//     | ((arg: z.output<TSchema>) => any)
//     | undefined = undefined,
// > = ReturnType<
//   // Pretend to call zCreateBundle with the right generics, so TS binds and infers correctly.
//   (
//     schema: TSchema,
//     options: { normalize?: TNormalizeFn; meta: { entity: TName } }
//   ) => ReturnType<typeof zCreateBundle<TSchema, TName, TNormalizeFn>>
// >;

const zHelpers = {
  zParseHelpers,
  zCreateBundle,
  toJSON,
};

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { zHelpers };

export type { ZEntityBundle };
