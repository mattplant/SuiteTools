// ───────────────────────────────────────────────────────────
// Zod Schema Utilities
// - Bundling helpers for validation, type inference, and DX
// ───────────────────────────────────────────────────────────

import { z } from "zod";

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

/**
 * Wraps a Zod schema in a full-featured bundle, including array handling.
 *
 * @template T - The inferred type of the schema.
 * @param schema - The base Zod schema to bundle.
 * @returns An ZodBundle with helpers and array support.
 */
function zCreateBundle<T>(schema: z.ZodType<T>) {
  const create = <S extends z.ZodTypeAny>(s: S) => ({
    schema: s,
    ...zParseHelpers(s),
  });

  return {
    ...create(schema),
    array: create(z.array(schema)),
  };
}

// ───────────────────────────────────────────────────────────
// ZEntityBundle with typed metadata and normalization
// ───────────────────────────────────────────────────────────

type NormalizedSafeParse<TSchema extends z.ZodObject<any>, TData> =
  | { success: true; data: TData }
  | { success: false; error: z.ZodError<z.input<TSchema>> };

type ShapeKeys<TSchema extends z.ZodObject<any>> = keyof TSchema["shape"];

type ZEntityMeta<
  TSchema extends z.ZodObject<any>,
  TName extends string = string,
> = {
  entity?: TName;
  version?: string;
  plural?: string;
  displayName?: string;
  namespace?: string;
  source?: string;
  deprecated?: boolean;
  experimental?: boolean;
  /** Auto-filled when schema is a ZodObject */
  fields?: ReadonlyArray<ShapeKeys<TSchema>>;
};

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

interface ZEntityBundle<
  TSchema extends z.ZodObject<any>,
  TNormalized,
  TName extends string = string,
> {
  /** Original schema */
  schema: TSchema;
  /** Array(schema) convenience */
  arraySchema: z.ZodArray<TSchema>;

  /** Optional normalization step applied after parse/safeParse */
  normalize?: (data: z.output<TSchema>) => TNormalized;

  /** Runtime helpers (normalize applied if present) */
  parse: (input: unknown) => TNormalized;
  safeParse: (input: unknown) => NormalizedSafeParse<TSchema, TNormalized>;
  assert: (input: unknown) => asserts input is TNormalized;
  parseMany: (input: unknown[]) => ReadonlyArray<TNormalized>;
  safeParseMany: (
    input: unknown[]
  ) => ReadonlyArray<NormalizedSafeParse<TSchema, TNormalized>>;
  assertMany: (input: unknown) => asserts input is ReadonlyArray<TNormalized>;

  /** Types (purely phantom—no runtime cost) */
  types: ZEntityTypes<TSchema, TNormalized>;

  /** Introspection metadata (frozen at runtime) */
  meta: Readonly<ZEntityMeta<TSchema, TName>>;
}

function defaultPluralize(name?: string): string | undefined {
  if (!name) return undefined;
  // naive pluralization; swap with a smarter util if needed
  return name.endsWith("s") ? name : `${name}s`;
}

type ZEntityBundleWithNormalize<
  TSchema extends z.ZodObject<any>,
  TNormalized,
  TName extends string,
> = {
  schema: TSchema;
  arraySchema: z.ZodArray<TSchema>;
  normalize: (data: z.output<TSchema>) => TNormalized;
  parse: (input: unknown) => TNormalized;
  safeParse: (input: unknown) => NormalizedSafeParse<TSchema, TNormalized>;
  assert: (input: unknown) => asserts input is TNormalized;
  parseMany: (input: ReadonlyArray<unknown>) => ReadonlyArray<TNormalized>;
  safeParseMany: (
    input: unknown[] | null | undefined
  ) => ReadonlyArray<NormalizedSafeParse<TSchema, TNormalized>>;
  assertMany: (input: unknown) => asserts input is ReadonlyArray<TNormalized>;
  types: ZEntityTypes<TSchema, TNormalized>;
  meta: ZEntityMeta<TSchema, TName>;
};

type ZEntityBundleWithoutNormalize<
  TSchema extends z.ZodObject<any>,
  TName extends string,
> = {
  schema: TSchema;
  arraySchema: z.ZodArray<TSchema>;
  parse: (input: unknown) => z.output<TSchema>;
  safeParse: (
    input: unknown
  ) => NormalizedSafeParse<TSchema, z.output<TSchema>>;
  assert: (input: unknown) => asserts input is z.output<TSchema>;
  parseMany: (
    input: ReadonlyArray<unknown>
  ) => ReadonlyArray<z.output<TSchema>>;
  safeParseMany: (
    input: unknown[] | null | undefined
  ) => ReadonlyArray<NormalizedSafeParse<TSchema, z.output<TSchema>>>;
  assertMany: (
    input: unknown
  ) => asserts input is ReadonlyArray<z.output<TSchema>>;
  types: ZEntityTypes<TSchema, z.output<TSchema>>;
  meta: ZEntityMeta<TSchema, TName>;
};

/**
 * Constructs an entity bundle without normalization—returns raw Zod output.
 *
 * @template TSchema - Zod object schema defining the entity shape.
 * @template TName - Entity name used for metadata and pluralization.
 *
 * @param schema - Zod schema for single entity validation.
 * @param meta - Metadata including fields, plural name, and display name.
 * @param arraySchema - Zod array schema for validating multiple entities.
 *
 * @returns A bundle with parsing, assertion, and metadata utilities that return raw Zod output.
 *
 * @remarks
 * - Use when no normalization is needed.
 * - Metadata is frozen to prevent accidental mutation.
 * - Parsing functions return `z.output<TSchema>` directly.
 */
function makeWithoutNormalize<
  TSchema extends z.ZodObject<any>,
  TName extends string,
>(
  schema: TSchema,
  meta: ZEntityMeta<TSchema, TName>,
  arraySchema: z.ZodArray<TSchema>
): ZEntityBundleWithoutNormalize<TSchema, TName> {
  const parse = (input: unknown) => schema.parse(input) as z.output<TSchema>;

  // const safeParse = (
  //   input: unknown
  // ): NormalizedSafeParse<TSchema, z.output<TSchema>> => {
  //   const res = schema.safeParse(input);
  //   return res.success ? { success: true, data: res.data } : res;
  // };
  const safeParse = (
    input: unknown
  ): NormalizedSafeParse<TSchema, z.output<TSchema>> => {
    const res = schema.safeParse(input);
    if (res.success) return { success: true, data: res.data };
    return {
      success: false,
      error: res.error as z.ZodError<z.input<TSchema>>,
    };
  };
  const assert = (input: unknown): asserts input is z.output<TSchema> => {
    void parse(input);
  };
  const parseMany = (input: ReadonlyArray<unknown>) => input.map(parse);
  const safeParseMany = (input: unknown[] | null | undefined) =>
    Array.isArray(input) ? input.map(safeParse) : [];
  const assertMany = (
    input: unknown
  ): asserts input is ReadonlyArray<z.output<TSchema>> => {
    void arraySchema.parse(input);
  };

  return {
    schema,
    arraySchema,
    parse,
    safeParse,
    assert,
    parseMany,
    safeParseMany,
    assertMany,
    types: undefined as unknown as ZEntityTypes<TSchema, z.output<TSchema>>,
    meta,
  };
}

/**
 * Constructs an entity bundle with normalization applied after Zod parsing.
 *
 * @template TSchema - Zod object schema defining the entity shape.
 * @template TNormalized - Output type after normalization.
 * @template TName - Entity name used for metadata and pluralization.
 *
 * @param schema - Zod schema for single entity validation.
 * @param normalize - Function to transform parsed Zod output into normalized shape.
 * @param meta - Metadata including fields, plural name, and display name.
 * @param arraySchema - Zod array schema for validating multiple entities.
 *
 * @returns A bundle with parsing, assertion, and metadata utilities that return normalized output.
 *
 * @remarks
 * - All parsing functions apply `normalize` after Zod validation.
 * - Metadata is frozen to prevent accidental mutation.
 * - Use `assertMany` to surface per-item normalization errors.
 */
function makeWithNormalize<
  TSchema extends z.ZodObject<any>,
  TNormalized,
  TName extends string,
>(
  schema: TSchema,
  normalize: (d: z.output<TSchema>) => TNormalized,
  meta: ZEntityMeta<TSchema, TName>,
  arraySchema: z.ZodArray<TSchema>
): ZEntityBundleWithNormalize<TSchema, TNormalized, TName> {
  const parse = (input: unknown) =>
    normalize(schema.parse(input) as z.output<TSchema>);
  const safeParse = (
    input: unknown
  ): NormalizedSafeParse<TSchema, TNormalized> => {
    const res = schema.safeParse(input);
    return res.success
      ? { success: true, data: normalize(res.data) }
      : {
          success: false,
          error: res.error as z.ZodError<z.input<TSchema>>,
        };
  };
  const assert = (input: unknown): asserts input is TNormalized => {
    void parse(input);
  };
  const parseMany = (input: ReadonlyArray<unknown>) => input.map(parse);
  const safeParseMany = (input: unknown[] | null | undefined) =>
    Array.isArray(input) ? input.map(safeParse) : [];
  const assertMany = (
    input: unknown
  ): asserts input is ReadonlyArray<TNormalized> => {
    const arr = arraySchema.parse(input) as ReadonlyArray<z.output<TSchema>>;
    for (const item of arr) normalize(item);
  };

  return {
    schema,
    arraySchema,
    normalize,
    parse,
    safeParse,
    assert,
    parseMany,
    safeParseMany,
    assertMany,
    types: undefined as unknown as ZEntityTypes<TSchema, TNormalized>,
    meta,
  };
}

// zCreateEntity overload signature for optional normalization.
function zCreateEntity<TSchema extends z.ZodObject<any>, TName extends string>(
  schema: TSchema,
  options?: { meta?: ZEntityMeta<TSchema, TName> }
): ZEntityBundleWithoutNormalize<TSchema, TName>;

// zCreateEntity overload signature where normalization function is applied after parsing.
function zCreateEntity<
  TSchema extends z.ZodObject<any>,
  TNormalized,
  TName extends string,
>(
  schema: TSchema,
  options: {
    normalize: (data: z.output<TSchema>) => TNormalized;
    meta?: ZEntityMeta<TSchema, TName>;
  }
): ZEntityBundleWithNormalize<TSchema, TNormalized, TName>;

/**
 * Creates a Zod-backed entity bundle with optional normalization and metadata.
 *
 * This function supports two modes:
 * - With `normalize`: returns a bundle where all parsing functions apply normalization after Zod validation.
 * - Without `normalize`: returns raw Zod output as the entity shape.
 *
 * @template TSchema - Zod schema defining the entity shape.
 * @template TNormalized - Output type after normalization.
 * @template TName - Entity name used for metadata and pluralization.
 *
 * @param schema - Zod object schema representing the entity.
 * @param options - Optional configuration:
 *   @param options.normalize - Function to transform parsed Zod output into a normalized shape.
 *   @param options.meta - Metadata used for pluralization, display name, and field overrides.
 *
 * @returns A typed entity bundle with parsing, assertion, and metadata utilities.
 *
 * @remarks
 * - If `normalize` is provided, all parsing functions will return `TNormalized`.
 * - Metadata fields are inferred from schema shape unless overridden.
 * - Use `assertMany` to surface per-item errors with index context.
 *
 * @example
 * ```ts
 * const userEntity = zCreateEntity(userSchema, {
 *   normalize: (data) => ({ ...data, fullName: `${data.first} ${data.last}` }),
 *   meta: { entity: "user" }
 * });
 * ```
 */
function zCreateEntity<
  TSchema extends z.ZodObject<any>,
  TNormalized,
  TName extends string,
>(
  schema: TSchema,
  options?: {
    normalize?: (data: z.output<TSchema>) => TNormalized;
    meta?: ZEntityMeta<TSchema, TName>;
  }
) {
  const arraySchema = z.array(schema);

  // Compute fields if schema is a ZodObject
  const fields =
    schema instanceof z.ZodObject
      ? (Object.keys(schema.shape) as Array<keyof typeof schema.shape>)
      : undefined;

  function resolvePlural(meta?: ZEntityMeta<any>): string | undefined {
    if (meta?.plural !== undefined) return meta.plural;
    if (meta?.entity !== undefined) return defaultPluralize(meta.entity);
    if (meta?.displayName !== undefined)
      return defaultPluralize(meta.displayName);
    return undefined;
  }

  const plural = resolvePlural(options?.meta);

  function createMergedMeta<
    TSchema extends z.ZodObject<any>,
    TName extends string,
  >(
    base: Partial<ZEntityMeta<TSchema, TName>>,
    fields: ReadonlyArray<ShapeKeys<TSchema>>,
    plural: string | undefined
  ): ZEntityMeta<TSchema, TName> {
    return {
      fields: base.fields ?? fields,
      ...(plural !== undefined ? { plural } : {}),
      ...base,
    };
  }

  const resolvedFields =
    options?.meta?.fields ??
    fields ??
    ([] as ReadonlyArray<ShapeKeys<TSchema>>);

  const mergedMeta = createMergedMeta(
    options?.meta ?? {},
    resolvedFields,
    plural
  );

  const normalize = options?.normalize;

  const parse = (input: unknown): TNormalized => {
    const parsed = schema.parse(input) as z.output<TSchema>;
    return normalize ? normalize(parsed) : (parsed as unknown as TNormalized);
  };

  const safeParse = (
    input: unknown
  ): NormalizedSafeParse<TSchema, TNormalized> => {
    const res = schema.safeParse(input);
    if (!res.success) return res as any;
    const value = normalize
      ? normalize(res.data as z.output<TSchema>)
      : (res.data as unknown as TNormalized);
    return { success: true, data: value };
  };

  const assert = (input: unknown): asserts input is TNormalized => {
    void parse(input);
  };

  const parseMany = (
    input: ReadonlyArray<unknown>
  ): ReadonlyArray<TNormalized> => {
    return input.map(parse);
  };

  const safeParseMany = (
    input: unknown[] | null | undefined
  ): ReadonlyArray<NormalizedSafeParse<TSchema, TNormalized>> => {
    if (!Array.isArray(input)) return [];
    return input.map(safeParse);
  };

  const assertMany = (
    input: unknown
  ): asserts input is ReadonlyArray<TNormalized> => {
    // Ensure we get good ZodError context (indexes) for non-arrays and per-element failures
    const arr = arraySchema.parse(input) as ReadonlyArray<z.output<TSchema>>;
    // Run normalization if present to surface any normalize-time errors
    if (normalize) {
      for (const item of arr) normalize(item);
    }
  };

  // TODO: using alternate way
  // const base = {
  //   schema,
  //   arraySchema,
  //   parse,
  //   safeParse,
  //   assert,
  //   parseMany,
  //   safeParseMany,
  //   assertMany,
  //   types: undefined as unknown as ZEntityTypes<TSchema, TNormalized>,
  //   meta: Object.freeze(mergedMeta),
  // } as const;

  // return normalize
  //   ? ({ ...base, normalize } as ZEntityBundleWithNormalize<
  //       TSchema,
  //       TNormalized,
  //       TName
  //     >)
  //   : (base as ZEntityBundleWithoutNormalize<TSchema, TName>);

  // TODO: initial alternative implementation
  // if (options?.normalize) {
  //   // With normalization
  //   return makeWithNormalize(
  //     schema,
  //     options.normalize,
  //     mergedMeta,
  //     arraySchema
  //   ) as ZEntityReturn<TSchema, TNormalized, TName>;
  // }

  // // Without normalization
  // return makeWithoutNormalize(schema, mergedMeta, arraySchema) as ZEntityReturn<
  //   TSchema,
  //   TNormalized,
  //   TName
  // >;
  if (options?.normalize) {
    return makeWithNormalize(
      schema,
      options.normalize,
      mergedMeta,
      arraySchema
    );
  }

  return makeWithoutNormalize(schema, mergedMeta, arraySchema);
}

/** Convenience extractors for existing bundles */
type BundleOf<T> = T extends ZEntityBundle<infer _S, infer N, any> ? N : never;

type BundleArrayOf<T> =
  T extends ZEntityBundle<infer _S, infer N, any> ? ReadonlyArray<N> : never;

// ───────────────────────────────────────────────────────────
// Type Helpers
// - Zod schema type inference and utility types
// ───────────────────────────────────────────────────────────

/**
 * Type for a Zod bundle, which includes the schema and array variants.
 * This is useful for defining reusable validation schemas with both singular and array forms.
 * @template T - The type of the schema.
 * @returns {ZodBundle<T>} - The Zod bundle type with schema and array methods.
 */
type ZodBundle<T> = ReturnType<typeof zCreateBundle<T>>;

// /**
//  * Type for the output of a Zod bundle schema.
//  * This is the type of data that the schema validates against.
//  * @template M - The Zod bundle type.
//  * @returns {BundleOf<M>} - The output type of the schema.
//  */
// type BundleOf<M extends { schema: z.ZodTypeAny }> = z.output<M["schema"]>;

/**
 * Type for the input of a Zod bundle schema.
 * This is the type of data that can be parsed into the schema.
 * @template M - The Zod bundle type.
 * @returns {BundleIn<M>} - The input type of the schema.
 */
type BundleIn<M extends { schema: z.ZodTypeAny }> = z.input<M["schema"]>;

// /**
//  * Type for the output of a Zod bundle array schema.
//  * This is the type of data that the array schema validates against.
//  * @template M - The Zod bundle type.
//  * @returns {BundleArrayOf<M>} - The output type of the array schema.
//  */
// type BundleArrayOf<M extends { array: { schema: z.ZodTypeAny } }> = z.output<
//   M["array"]["schema"]
// >;

/**
 * Type for the input of a Zod bundle array schema.
 * This is the type of data that can be parsed into the array schema.
 * @template M - The Zod bundle type.
 * @returns {BundleArrayIn<M>} - The input type of the array schema.
 */
type BundleArrayIn<M extends { array: { schema: z.ZodTypeAny } }> = z.input<
  M["array"]["schema"]
>;

/**
 * Namespaced Zod factory helpers for reusable parsing logic.
 */
const zHelpers = {
  zParseHelpers,
  zCreateEntity,
  zCreateBundle, // TODO: remove after verifying zCreateEntity works
};

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { zHelpers };

// export type { ZodBundle, BundleOf, BundleIn, BundleArrayOf, BundleArrayIn };
export type {
  ZodBundle,
  BundleIn,
  BundleArrayIn,
  ZEntityBundleWithoutNormalize,
  ZEntityBundleWithNormalize,
  BundleOf,
  BundleArrayOf,
};
