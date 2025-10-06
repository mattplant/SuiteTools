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
import { makeNetSuiteApiError, makeSchemaValidationError, ZodError } from '@suiteworks/suitetools-shared';

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
  console.log(`[SuiteTools API] getData() endpoint "${endpoint}" initiated`, { params });
  let result: RequestResponse; // = { status: 500, data: {} }; // default to error

  // Guard against reserved keys in the params object - first 3 used by NetSuite and last by SuiteTools
  const reservedParamKeys = ['script', 'deploy', 'compid', 'endpoint'];
  const conflicts = reservedParamKeys.filter((param) => param in params);
  if (conflicts.length > 0) {
    // TODO: use a SuteTools error class with factory method
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

  // Call the NetSuite API
  const paramString = new URLSearchParams(params as Record<string, string>).toString();
  const url = `${apiBaseUrl}&endpoint=${endpoint}&${paramString}`;
  console.log(`[SuiteTools API] getData() endpoint "${endpoint}" fetching URL: ${url}`);
  const res = await fetch(url.toString());
  console.log(`[SuiteTools API] getData() endpoint "${endpoint}" responded`, {
    status: res.status,
    ok: res.ok,
  });

  // Read the body once
  let raw = '';
  try {
    raw = await res.text();
  } catch {
    // Ignore read errors — raw stays ''
  }

  // Handle non-2xx responses
  if (!res.ok) {
    throw makeNetSuiteApiError(endpoint, `NetSuite API error on endpoint "${endpoint}": ${res.status}: ${raw}`, {
      status: res.status,
    });
  }

  // First: decode JSON
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw makeNetSuiteApiError(endpoint, `Invalid JSON payload: ${raw}`, { status: res.status });
  }

  // Second: validate against the schema
  let payload: RequestResponse;
  try {
    payload = requestResponse.parse(parsed);
  } catch (err) {
    if (err instanceof ZodError) {
      throw makeSchemaValidationError(endpoint, err.issues);
    }
    // Not a Zod error — bubble it up unchanged
    throw err;
  }

  console.log(`[SuiteTools API] getData() endpoint "${endpoint}" payload`, payload);

  // Successful handshake and parse so now handle based on payload.status
  // The `payload.status` is the "real" status signal from the RESTlet endpoint for for business‑level success/failure
  switch (payload.status) {
    case 200:
      // All good so return the payload below
      result = payload;
      break;

    case 404:
      // Not found is not an error condition for getData() so just return the payload
      result = payload;
      break;
    default:
      throw makeNetSuiteApiError(endpoint, payload.message || 'NetSuite API error', {
        status: payload.status,
      });
  }
  console.log(`[SuiteTools API] getData() endpoint "${endpoint}" and status "${payload.status} returning`, { payload });

  return result;
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
