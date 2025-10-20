/**
 * SuiteTools API - Shared Types
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

export type RequestBody = {
  endpoint: string;
  data: RequestBodyData;
};

export type RequestBodyData = { [key: string]: unknown };

export type Response = {
  status: number;
  data: object;
  message?: string;
};

export function assertIsRequestBody(data: unknown): asserts data is RequestBody {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Request body data is not an object');
  }
  // endpoint
  if (!('endpoint' in data)) {
    throw new Error('Request params data is missing the "endpoint" field');
  }
  if (typeof data.endpoint !== 'string') {
    throw new Error('Request params data "endpoint" field is not a string');
  }
  // data
  if (!('data' in data)) {
    throw new Error('Request params data is missing the "data" field');
  }
  if (typeof data.data !== 'object') {
    throw new Error('Request params data "data" field is not a object');
  }
}

export function assertIsRequestBodyData(data: unknown): asserts data is RequestBodyData {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Request body data is not an object');
  }
}