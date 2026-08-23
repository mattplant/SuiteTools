// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The RESTlet the frontend talks to — the entire backend API surface.
 *
 * @fileoverview
 * NetSuite invokes this directly. Every request from the browser arrives here, is dispatched
 * into `SuiteToolsApi`, and comes back as a `RequestResponse`. `statusForSuiteError` is the
 * other half of the contract: it maps each SuiteError subclass onto the HTTP-style status the
 * frontend adapters branch on.
 *
 * @remarks
 * The error mapping is a wire contract, not an implementation detail — changing which status a
 * SuiteError maps to changes how the frontend reacts, with no compiler error on either side.
 * Imports from the `/errors` subpath rather than the package root so the Zod runtime stays out
 * of this bundle.
 *
 * @see ./api/SuiteToolsApi.ts – the dispatch this delegates to
 * @see ../../../frontend/src/adapters/api/netSuiteClient.ts – the client calling in
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 *
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */

import type { EntryPoints } from "N/types";
import { SuiteToolsApi } from "./api/SuiteToolsApi";
import type { ErrorResponse } from "@suiteworks/suitetools-shared/errors";
import {
  SuiteError,
  NotFoundError,
  InvalidParameterError,
  UnexpectedError,
  SchemaValidationError,
} from "@suiteworks/suitetools-shared/errors";

/**
 * Map a SuiteError to an HTTP-style business status for ErrorResponse.
 */
function statusForSuiteError(err: SuiteError): number {
  if (err instanceof NotFoundError) {
    return 404;
  }
  if (err instanceof UnexpectedError) {
    return 500;
  }
  if (err instanceof SchemaValidationError) {
    // Response failed our own shared schema — treat as server fault.
    return 500;
  }
  if (err instanceof InvalidParameterError) {
    return 400;
  }
  // Remaining SuiteErrors: treat fatal/error severity as server faults.
  if (err.severity === "error" || err.severity === "fatal") {
    return 500;
  }
  return 400;
}

/**
 * Serialize any thrown value into the shared ErrorResponse JSON contract.
 * Used by GET / POST / PUT so method entrypoints cannot drift.
 */
function errorResponseJson(err: unknown): string {
  if (err instanceof SuiteError) {
    const errorResponse: ErrorResponse = {
      status: statusForSuiteError(err),
      code: err.code,
      message: err.message,
      severity: err.severity,
    };
    if (err.context) {
      errorResponse.context = err.context;
    }
    return JSON.stringify(errorResponse);
  }

  const errorResponse: ErrorResponse = {
    status: 500,
    code: "UNEXPECTED_ERROR",
    message: "Internal server error",
    severity: "error",
  };
  return JSON.stringify(errorResponse);
}

/**
 * Handles the GET request event.
 *
 * @param requestParams The request parameters.
 * @returns The serialized JSON response.
 */
export function get(requestParams: EntryPoints.RESTlet.get): string {
  // log.debug({ title: 'get() initiated', details: requestParams });
  const stApi = new SuiteToolsApi();

  try {
    const response = stApi.stApiGet.process(requestParams);
    return JSON.stringify(response);
  } catch (err: unknown) {
    return errorResponseJson(err);
  }
}

/**
 * Handles the POST request event.
 *
 * @param requestBody The request body.
 * @returns The serialized JSON response.
 */
export function post(requestBody: EntryPoints.RESTlet.post): string {
  // log.debug({ title: 'post() initiated', details: requestBody });
  const stApi = new SuiteToolsApi();

  try {
    const response = stApi.stApiPost.process(requestBody);
    return JSON.stringify(response);
  } catch (err: unknown) {
    return errorResponseJson(err);
  }
}

/**
 * Handles the PUT request event.
 *
 * @param requestBody The request body.
 * @returns The serialized JSON response.
 */
export function put(requestBody: EntryPoints.RESTlet.put): string {
  // log.debug({ title: 'put() initiated', details: requestBody });
  const stApi = new SuiteToolsApi();

  try {
    const response = stApi.stApiPut.process(requestBody);
    return JSON.stringify(response);
  } catch (err: unknown) {
    return errorResponseJson(err);
  }
}
