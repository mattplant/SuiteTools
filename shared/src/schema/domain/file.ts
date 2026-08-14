// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Zod schema and entity bundle definition for NetSuite `File` records.
 *
 * @fileoverview
 * Validation and type exports for `File` records.
 * See `FileSchema` below for complete field definitions.
 *
 * @module validation/File
 * @see zNetSuite – NetSuite-specific Zod parsing helpers
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

/**
 * Zod schema for a single NetSuite `File` record.
 *
 * ## Fields from NetSuite
 * - id: unique numeric identifier
 * - folder: folder ID
 * - dateCreated: timestamp when the file was created
 * - lastModifiedDate: timestamp when the file was last modified
 * - fileTypeName: type of the file (e.g., PDF, CSV); empty when SuiteQL returns null
 * - name: human‑readable name of the file
 * - fileSize: size of the file in bytes
 * - description: optional description (coerced to empty string if not provided)
 * - url: URL (path only) to the file in NetSuite; empty when SuiteQL returns null
 *
 * ## Additional fields populated by SuiteTools
 * - urlNs: optional path to the file record in NetSuite UI
 * - urlDetail: optional path to the SuiteTools file detail page
 */
const FileSchema = z.object({
  id: z.number().positive(),
  folder: zNetSuite.numberFromString.schema,
  dateCreated: zNetSuite.dateFromString.schema,
  lastModifiedDate: zNetSuite.dateFromString.schema,
  fileTypeName: zNetSuite.stringOrEmpty.schema,
  name: zNetSuite.stringOrEmpty.schema,
  fileSize: zNetSuite.numberFromString.schema,
  description: zNetSuite.stringOrEmpty.schema,
  url: zNetSuite.stringOrEmpty.schema,
  // SuiteTools‑added: fields for convenience, not in raw NetSuite response
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const FileBundle: ZEntityBundle<typeof FileSchema, "File"> = zHelpers.zCreateBundle(FileSchema, {
  meta: { entity: "File", plural: "Files", displayName: "File Record" },
});

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { FileBundle };
export type File = typeof FileBundle.types.single;
export type Files = typeof FileBundle.types.array;

// Convenience union for single entity
export const fileOrNotFoundSchema = orNotFoundSchema(FileSchema);
export type FileOrNotFound = OrNotFound<File>;

// Convenience union for multiple entities
export const filesOrNotFoundSchema = orNotFoundSchema(FileBundle.schema.array());
export type FilesOrNotFound = OrNotFound<Files>;
