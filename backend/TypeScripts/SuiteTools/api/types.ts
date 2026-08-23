// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Wire types and the request-body guard for the RESTlet.
 *
 * @fileoverview
 * Twelve backend modules import from here. Re-exports the shared `RequestBody` and
 * `RequestResponse` under local names, and supplies `assertIsRequestBody`, the runtime check
 * that untrusted request payloads pass through before any handler reads them.
 *
 * @remarks
 * The type re-exports are type-only, which is what keeps the shared package's Zod runtime out
 * of this bundle — importing the value form here would pull it in. `assertIsRequestBody` is a
 * hand-written assertion rather than a schema parse for the same reason, so it must be kept in
 * step with the shared `RequestBody` shape by hand.
 *
 * @see ../../../../shared/src/schema/api – the shared definition this mirrors
 * @see ./SuiteToolsApi.ts – the dispatch that consumes these types
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 *
 * @NApiVersion 2.1
 */

// Import types from shared workspace (type-only, no runtime code)
import type { RequestBody as SharedRequestBody, RequestResponse } from "@suiteworks/suitetools-shared";

// Re-export shared types for local convenience
export type RequestBody = SharedRequestBody;
export type RequestBodyData = { [key: string]: unknown };
export type Response = RequestResponse;

/**
 * Runtime assertion that validates data conforms to RequestBody shape.
 * @param data - Unknown data to validate
 * @throws {Error} If data is not a valid RequestBody
 */
export function assertIsRequestBody(data: unknown): asserts data is RequestBody {
  if (typeof data !== "object" || data === null) {
    throw new Error("Request body data is not an object");
  }
  // endpoint
  if (!("endpoint" in data)) {
    throw new Error('Request params data is missing the "endpoint" field');
  }
  if (typeof data.endpoint !== "string") {
    throw new Error('Request params data "endpoint" field is not a string');
  }
  // data
  if (!("data" in data)) {
    throw new Error('Request params data is missing the "data" field');
  }
  if (typeof data.data !== "object") {
    throw new Error('Request params data "data" field is not a object');
  }
}

/**
 * Runtime assertion that validates data conforms to RequestBodyData shape.
 * @param data - Unknown data to validate
 * @throws {Error} If data is not a valid RequestBodyData
 */
export function assertIsRequestBodyData(data: unknown): asserts data is RequestBodyData {
  if (typeof data !== "object" || data === null) {
    throw new Error("Request body data is not an object");
  }
}
