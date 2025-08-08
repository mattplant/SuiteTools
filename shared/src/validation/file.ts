import { z } from "zod";
import { createSchemaHelpers, createZodDate } from "./helpers";

/**
 * Zod schema for a single File record.
 *
 * Fields:
 * - id: unique numeric identifier
 * - fileName: human‐readable name of the file
 * - size: size in bytes
 * - createdDate: timestamp when the file was created
 * - modifiedDate: timestamp when the file was last modified (optional)
 * - urlDetail: contextual URL (optional)
 */
export const BaseFile = z.object({
  id: z.number(),
  folder: z.number(), // todo: change to string
  createddate: z.string(),
  lastmodifieddate: z.string(),
  filetypename: z.string(),
  name: z.string(),
  filesize: z.number(),
  // TODO description: string;
  url: z.string(),
  // additional properties
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

/**
 * Currently no transformations are applied to the File schema.
 */
const CleanedFile = BaseFile.transform((data) => {
  return data;
});

export type File = z.infer<typeof BaseFile>;

/**
 * Single‐entry helpers (assert/parse/safeParse)
 */
const singleHelpers = createSchemaHelpers(CleanedFile);

export const assertValidFile: typeof singleHelpers.assert =
  singleHelpers.assert;

export const parseFile: typeof singleHelpers.parse = singleHelpers.parse;

export const safeParseFile: typeof singleHelpers.safeParse =
  singleHelpers.safeParse;

/**
 * Array‐of‐entries helpers (assert/parse/safeParse)
 */
const arrayHelpers = createSchemaHelpers(CleanedFile.array());

export const assertValidFiles: typeof arrayHelpers.assert = arrayHelpers.assert;

export const parseFiles: typeof arrayHelpers.parse = arrayHelpers.parse;

export const safeParseFiles: typeof arrayHelpers.safeParse =
  arrayHelpers.safeParse;
