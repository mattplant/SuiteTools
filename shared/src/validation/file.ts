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
 * See the LICENSE file at https://github.com/mattplant/SuiteTools/blob/main/LICENSE
 */

import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import { zHelpers } from "./zodUtils";
import type { ZEntityBundle } from "./zodUtils";

/**
 * Zod schema for a single NetSuite `File` record.
 *
 * ## Fields from NetSuite
 * - id: unique numeric identifier
 * - folder: folder ID (string or number)
 * - createddate: timestamp when the file was created
 * - lastmodifieddate: timestamp when the file was last modified
 * - filetypename: type of the file (e.g., PDF, CSV)
 * - name: human‑readable name of the file
 * - filesize: size of the file in bytes
 * - description: optional description of the file (coerced to empty string if not provided)
 * - url: URL (path only) to the file in NetSuite
 *
 * ## Additional fields populated by SuiteTools
 * - urlNs: optional path to the file record in NetSuite UI
 * - urlDetail: optional path to the SuiteTools file detail page
 */
const FileSchema = z.object({
  id: z.number().positive(),
  folder: z.number(),
  createddate: zNetSuite.dateFromString.schema,
  lastmodifieddate: zNetSuite.dateFromString.schema,
  filetypename: z.string(),
  name: z.string(),
  filesize: z.number(),
  description: zNetSuite.stringOrEmpty.schema,
  url: z.string(),
  // SuiteTools‑added: fields for convenience, not in raw NetSuite response
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const FileBundle: ZEntityBundle<typeof FileSchema, "File"> =
  zHelpers.zCreateBundle(FileSchema, {
    meta: {
      entity: "File",
      plural: "Files",
      displayName: "File Record",
    },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { FileBundle };
export type File = typeof FileBundle.types.single;
export type Files = typeof FileBundle.types.array;
