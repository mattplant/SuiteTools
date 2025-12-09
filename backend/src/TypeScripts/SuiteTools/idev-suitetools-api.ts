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
import { SuiteError, NotFoundError } from '@suiteworks/suitetools-shared/errors';

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
      // Map SuiteError subclasses into a structured error response
      const status = err instanceof NotFoundError ? 404 : 400;
      const errorResponse: ErrorResponse = {
        status,
        code: err.code,
        message: err.message,
        severity: err.severity,
        context: err.context,
      };
      return JSON.stringify(errorResponse);
    }

    // Fallback for unexpected errors
    const errorResponse = {
      status: 500,
      code: 'UNEXPECTED',
      message: 'Internal server error',
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
