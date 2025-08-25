// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * SuiteTools NetSuite API client adapter.
 * @file netSuiteClient.ts
 * @description Bridges raw NetSuite HTTP calls into the SuiteTools Schema → Adapter → View pipeline
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { httpResponse, requestResponse, zRequestBody } from '@suiteworks/suitetools-shared';
import type {
  HttpResponse,
  RequestResponse,
  RequestBody,
  PostEndpoint,
  PutEndpoint,
} from '@suiteworks/suitetools-shared';
import type { EndpointName } from '@suiteworks/suitetools-shared';
import { makeNetSuiteApiError } from '@suiteworks/suitetools-shared';

enum HttpMethod {
  PUT = 'PUT',
  POST = 'POST',
}

const script = 'customscript_idev_suitetools_api';
const deploy = 'customdeploy_idev_suitetools_api';
const apiBaseUrl = `/app/site/hosting/restlet.nl?script=${script}&deploy=${deploy}`;

/**
 * Fetches and validates data from the NetSuite API.
 * @param endpoint - Logical API endpoint that the backend SuiteTools RESTlet handler maps to a specific function.
 * @param [params] - Query parameters to append to the request URL. Keys `script`, `deploy`, `compid`, and `endpoint` are reserved. The first three are NetSuite parameters and the last one is used SuiteTools.
 * @returns Parsed and schema‑validated API response.
 * @throws {NetSuiteApiError} When the HTTP response status is not OK (non‑2xx).
 */
export async function getData(endpoint: EndpointName, params: Record<string, unknown> = {}): Promise<RequestResponse> {
  console.log('[SuiteTools API] getData() initiated', { endpoint, params });

  // Guard against reserved keys in the params object - first 3 used by NetSuite and last by SuiteTools
  const reservedParamKeys = ['script', 'deploy', 'compid', 'endpoint'];
  const conflicts = reservedParamKeys.filter((param) => param in params);
  if (conflicts.length > 0) {
    throw new Error(
      `getData() ${endpoint} params contain reserved keys: ${conflicts.map((k) => `${k}=${params[k]}`).join(', ')}`,
    );
  }

  // TODO: Cleanup. This hardened code had issues. Also it is still passing empty strings.
  // // Construct URL safely skipping nullish params
  // const url = new URL(apiBaseUrl);
  // url.searchParams.set('endpoint', endpoint);
  // Object.entries(params).forEach(([k, v]) => {
  //   if (v != null) url.searchParams.set(k, String(v));
  // });
  const paramString = new URLSearchParams(params as Record<string, string>).toString();
  const url = `${apiBaseUrl}&endpoint=${endpoint}&${paramString}`;

  // Call the API
  const response = await fetch(url.toString());
  console.log(`[SuiteTools API] getData() endpoint "${endpoint}" responded`, {
    status: response.status,
    ok: response.ok,
  });
  /**
   * Read the response body (if available) to include in the error message,
   * and attaches both the HTTP status code and the API endpoint to the
   * thrown error object for richer upstream handling.
   * @throws {Error} Always throws on non‑OK responses, with `status` and `endpoint` properties attached.
   */
  if (!response.ok) {
    let bodyText = '';
    try {
      bodyText = await response.text();
    } catch {
      // Intentionally ignore error while reading response text
    }
    const error = makeNetSuiteApiError(endpoint, `NetSuite API error ${response.status}: ${bodyText}`, {
      status: response.status,
    });
    throw error;
  }

  // // Parse and validate the response
  // class SchemaValidationError extends Error {
  //   constructor(
  //     message: string,
  //     public issues?: unknown,
  //   ) {
  //     super(message);
  //     this.name = 'SchemaValidationError';
  //   }
  // }

  // try {
  //   return requestResponse.parse(await response.json());
  // } catch (err) {
  //   if (err instanceof ZodError) {
  //     throw new SchemaValidationError(`Schema validation failed for [${endpoint}]`, err.issues);
  //   }
  //   throw err; // re‑throw unrelated errors untouched
  // }

  const parsedResponse = requestResponse.parse(await response.json());

  return parsedResponse;
}

/**
 * Sends a POST request to the specified NetSuite API endpoint with the provided data.
 * @param endpoint - The API endpoint to call.
 * @param data - The data to send in the request body.
 * @returns The response from the API.
 */
export async function postData(endpoint: PostEndpoint, data: object): Promise<HttpResponse> {
  return saveData(HttpMethod.POST, endpoint, data);
}

/**
 * Sends a PUT request to the specified NetSuite API endpoint with the provided data.
 * @param endpoint - The API endpoint to call.
 * @param data - The data to send in the request body.
 * @returns The response from the API.
 */
export async function putData(endpoint: PutEndpoint, data: object): Promise<HttpResponse> {
  return saveData(HttpMethod.PUT, endpoint, data);
}

/**
 * Sends data to the NetSuite API using the specified HTTP method.
 * Uses mock data during local development.
 * @param httpMethod - The HTTP method to use (POST or PUT).
 * @param endpoint - The API endpoint to call.
 * @param data - The data to send in the request body.
 * @returns The response from the API.
 */
async function saveData(
  httpMethod: HttpMethod,
  endpoint: PostEndpoint | PutEndpoint,
  data: object,
): Promise<HttpResponse> {
  if (window.location.href.includes('localhost')) {
    // use dummy data for local development
    return httpResponse.parse({ status: 200 });
  }

  // save data to NetSuite
  const requestBody: RequestBody = { endpoint, data };
  const apiUrl = `${apiBaseUrl}`;
  const response = await fetch(apiUrl, {
    method: httpMethod,
    body: JSON.stringify(zRequestBody.parse(requestBody)),
    headers: { 'Content-Type': 'application/json' },
  });
  const parsedResponse = httpResponse.parse(await response.json());
  console.log(`[SuiteTools API] saveData() ${httpMethod} ${endpoint} response`, parsedResponse);

  return parsedResponse;
}
