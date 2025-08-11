import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import type { ZodBundle } from "./zodUtils";

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

export type File = z.infer<typeof CleanedFile>;
export type Files = File[];

/**
 * Bundled schema + helpers for File
 */
export const File: ZodBundle<File> = zNetSuite.createBundle(CleanedFile);
