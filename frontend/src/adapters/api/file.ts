// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving a single File entity from SuiteTools.
 * @description
 * Fetches and validates a single File record by ID, returning either a fully typed File object or throwing NotFound.
 * Pattern: Schema → Adapter → View
 * - Always validate via shared bundle `.schema`
 * - Transform only on success; propagate `NotFound` via SuiteError
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, fileOrNotFoundSchema } from "@suiteworks/suitetools-shared";
import type { File } from "@suiteworks/suitetools-shared";
import { makeSingularAdapter } from "./adapterUtils";

/**
 * Transform a validated `File` payload into the enriched view model used by the frontend.
 * @param file - The validated File payload to enrich.
 * @returns The enriched File object with navigation URLs.
 */
function adaptFile(file: File): File {
  return { ...file, urlNs: `/app/common/media/mediaitem.nl?id=${file.id}`, urlDetail: `#/file/${file.id}` };
}

const fileRequestResponseSchema = makeRequestResponseSchema(fileOrNotFoundSchema);

/**
 * Fetch and validate a single `File` record by ID.
 * - Uses shared schemas for runtime validation and type inference.
 * - Adds `urlNs` and `urlDetail` to valid `File` records.
 * @param id - The ID of the file to retrieve.
 * @returns A Promise resolving to a File object.
 */
export const getFile = makeSingularAdapter<File>("file", fileRequestResponseSchema, adaptFile);
