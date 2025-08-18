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
 * See the LICENSE file at https://github.com/mattplant/SuiteTools/blob/main/LICENSE
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

function safeParseFactory<TSchema extends z.ZodObject<any>, TOut>(
  schema: TSchema,
  transform?: (parsed: z.output<TSchema>) => TOut
) {
  return (input: unknown): NormalizedSafeParse<TSchema, TOut> => {
    const res = schema.safeParse(input);
    if (!res.success) {
      return {
        success: false,
        error: res.error as z.ZodError<z.input<TSchema>>,
      };
    }
    const value = transform
      ? transform(res.data as z.output<TSchema>)
      : (res.data as unknown as TOut);
    return { success: true, data: value };
  };
}

/**
 * Constructs an entity bundle with normalization applied after Zod parsing.
 * @internal
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
  const { parse, parseMany, assert, assertMany } = makeZHelpers({
    schema,
    normalize,
  });
  const safeParse = (
    input: unknown
  ): NormalizedSafeParse<TSchema, TNormalized> => {
    const res = schema.safeParse(input);
    if (!res.success) {
      return { success: false, error: res.error as ZodError<z.input<TSchema>> };
    }
    return { success: true, data: normalize(res.data) };
  };
  const safeParseMany = (
    input: unknown[] | null | undefined
  ): readonly NormalizedSafeParse<TSchema, TNormalized>[] => {
    if (!input) return [];
    return input.map((item) => safeParse(item));
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

/**
 * Constructs an entity bundle without normalization—returns raw Zod output.
 *
 * @internal
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
  const { parse, parseMany, assert, assertMany } = makeZHelpers({
    schema,
  });
  const safeParse = (
    input: unknown
  ): NormalizedSafeParse<TSchema, z.output<TSchema>> => {
    const res = schema.safeParse(input);
    if (!res.success) {
      return {
        success: false,
        error: res.error as ZodError<z.input<TSchema>>,
      };
    }
    return { success: true, data: res.data };
  };
  const safeParseMany = (
    input: unknown[] | null | undefined
  ): readonly NormalizedSafeParse<TSchema, z.output<TSchema>>[] => {
    if (!input) return [];
    return input.map((item) => safeParse(item));
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
 * A compact, stable safeParse result for single or many.
 */
type SafeResult<TSchema extends z.ZodTypeAny, TData> =
  | { success: true; data: TData }
  | { success: false; error: ZodError<z.input<TSchema>> };

/**
 * Factory function to create Zod helpers with optional normalization.
 * @internal
 * Overload: no normalize -> normalized type is z.output<TSchema>.
 */
function makeZHelpers<TSchema extends z.ZodTypeAny>(opts: {
  schema: TSchema;
}): {
  schema: TSchema;

  // single
  parse: (input: unknown) => z.output<TSchema>;
  assert: (input: unknown) => asserts input is z.output<TSchema>;

  // many
  parseMany: (input: unknown) => readonly z.output<TSchema>[];
  assertMany: (input: unknown) => asserts input is readonly z.output<TSchema>[];
};

/**
 * Factory function to create Zod helpers with optional normalization.
 * @internal
 * Overload: with normalize -> normalized type is TNormalized.
 */
function makeZHelpers<TSchema extends z.ZodTypeAny, TNormalized>(opts: {
  schema: TSchema;
  normalize: (value: z.output<TSchema>) => TNormalized;
}): {
  schema: TSchema;

  // single
  parse: (input: unknown) => TNormalized;
  assert: (input: unknown) => asserts input is TNormalized;

  // many
  parseMany: (input: unknown) => readonly TNormalized[];
  assertMany: (input: unknown) => asserts input is readonly TNormalized[];
};

/**
 * Creates Zod helpers with parsing, assertion, and normalization utilities.
 * @internal
 */
function makeZHelpers<TSchema extends z.ZodTypeAny, TNormalized>(opts: {
  schema: TSchema;
  normalize?: (value: z.output<TSchema>) => TNormalized;
}) {
  const { schema, normalize } = opts;
  const arraySchema = z.array(schema);

  type Out = z.output<TSchema>;
  type Norm = TNormalized extends unknown
    ? typeof normalize extends (...args: any) => any
      ? TNormalized
      : Out
    : Out;

  const normOne = (value: Out): Norm =>
    (normalize ? normalize(value as Out) : (value as unknown)) as Norm;

  // ——— single ———

  const parse = (input: unknown): Norm => {
    const parsed = schema.parse(input) as Out;
    return normOne(parsed);
  };

  const assert = (input: unknown): asserts input is Norm => {
    // Validates; does not mutate input. After this returns, `input` is treated as Norm.
    schema.parse(input);
  };

  // ——— many ———

  const parseMany = (input: unknown): readonly Norm[] => {
    if (input == null) return [];
    if (!Array.isArray(input)) {
      throw new TypeError(
        "Expected an array, null, or undefined for parseMany."
      );
    }
    // Throws on first invalid element; preserves error fidelity.
    const parsed = arraySchema.parse(input) as Out[];
    return parsed.map(normOne);
  };

  const assertMany = (input: unknown): asserts input is readonly Norm[] => {
    // Strict: null/undefined or non-arrays throw.
    arraySchema.parse(input);
  };

  return {
    schema,

    // single
    parse,
    assert,

    // many
    parseMany,
    assertMany,
  };
}

/**
 * Namespaced Zod factory helpers for reusable parsing logic.
 */
const zHelpers = {
  zParseHelpers,
  zCreateEntity,
};

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { zHelpers };

export type { ZEntityBundleWithoutNormalize, ZEntityBundleWithNormalize };
