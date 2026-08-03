/**
 * SuiteTools API
 *
 * This script handles the SuiteTools API calls.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * Copyright (C) 2024  Matthew Plant
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @NApiVersion 2.1
 * @NScriptType Restlet
 */

import type { EntryPoints } from 'N/types';
import { SuiteToolsApi } from './api/SuiteToolsApi';
import type { ErrorResponse } from '@suiteworks/suitetools-shared/errors';
import {
  SuiteError,
  NotFoundError,
  InvalidParameterError,
  UnexpectedError,
} from '@suiteworks/suitetools-shared/errors';

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
  if (err instanceof InvalidParameterError) {
    return 400;
  }
  // Remaining SuiteErrors: treat fatal/error severity as server faults.
  if (err.severity === 'error' || err.severity === 'fatal') {
    return 500;
  }
  return 400;
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

    // Fallback for unexpected errors
    const errorResponse: ErrorResponse = {
      status: 500,
      code: 'UNEXPECTED_ERROR',
      message: 'Internal server error',
      severity: 'error',
    };
    return JSON.stringify(errorResponse);
  }
}

/**
 * Handles the POST request event.
 *
 * @param requestParams The request parameters.
 * @returns The response.
 */
export function post(requestBody: EntryPoints.RESTlet.put): string {
  // log.debug({ title: 'post() initiated', details: requestBody });
  const stApi = new SuiteToolsApi();
  const response = JSON.stringify(stApi.stApiPost.process(requestBody));

  return response;
}

/**
 * Handles the PUT request event.
 *
 * @param requestParams The request parameters.
 * @returns The response.
 */
export function put(requestBody: EntryPoints.RESTlet.put): string {
  // log.debug({ title: 'put() initiated', details: requestBody });
  const stApi = new SuiteToolsApi();
  const response = JSON.stringify(stApi.stApiPut.process(requestBody));

  return response;
}
