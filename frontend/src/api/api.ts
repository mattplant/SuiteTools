import { PostEndpoint, PutEndpoint, RequestBody, RequestResponse, HttpResponse } from './types';

enum HttpMethod {
  PUT = 'PUT',
  POST = 'POST',
}

const script = 'customscript_idev_suitetools_api';
const deploy = 'customdeploy_idev_suitetools_api';
const apiBaseUrl = `/app/site/hosting/restlet.nl?script=${script}&deploy=${deploy}`;

export async function getData(localTestData: object, endpoint: string, params: object = {}): Promise<RequestResponse> {
  console.log('getData() initiated', { localTestData, endpoint, params });

  // check to see if any of the used script params are in the params object
  const usedParams = ['script', 'deploy', 'compid', 'endpoint']; // first 3 used by NetSuite and last by SuiteTools
  const paramsInUsedParams = usedParams.filter((param) => Object.keys(params).includes(param));
  if (paramsInUsedParams.length > 0) {
    throw new Error(
      `getData() ${endpoint} params contains the following script params: ${paramsInUsedParams.join(', ')}`,
    );
  }
  const paramString = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  if (window.location.href.includes('localhost')) {
    // mock data for local development
    console.log(`getData() endpoint "${endpoint}" mock call initiated with params:`, paramString);
    const data = await new Promise((resolve) => setTimeout(() => resolve(localTestData), 1000));
    console.log(`getData() endpoint "${endpoint}" mock call response`, data);
    assertIsRequestResponse(data);

    return data;
  } else {
    // get data from NetSuite
    console.log(`getData() endpoint "${endpoint}" initiated with params:`, paramString);
    const apiUrl = `${apiBaseUrl}&endpoint=${endpoint}&${paramString}`;
    const response = await fetch(apiUrl);
    const data = (await response.json()) as unknown;
    console.log(`getData() endpoint "${endpoint}" response`, data);
    assertIsRequestResponse(data);

    return data;
  }
}

export function assertIsRequestResponse(data: unknown): asserts data is RequestResponse {
  if (typeof data !== 'object') {
    throw new Error('RequestResponse is not an object');
  }
  if (data === null) {
    throw new Error('RequestResponse is null');
  }
  if (!('data' in data)) {
    throw new Error('RequestResponse does not contain data');
  }
}

export async function postData(endpoint: PostEndpoint, data: object): Promise<HttpResponse> {
  return saveData(HttpMethod.POST, endpoint, data);
}

export async function putData(endpoint: PutEndpoint, data: object): Promise<HttpResponse> {
  return saveData(HttpMethod.PUT, endpoint, data);
}

async function saveData(
  httpMethod: HttpMethod,
  endpoint: PostEndpoint | PutEndpoint,
  data: object,
): Promise<HttpResponse> {
  console.log('saveData() initiated', { httpMethod, endpoint, data });

  if (window.location.href.includes('localhost')) {
    // use dummy data for local development
    const responseBody: HttpResponse = {
      status: 200,
    };
    return { ...data, ...responseBody };
  } else {
    // save data to NetSuite
    const apiUrl = `${apiBaseUrl}`;
    const requestBody: RequestBody = {
      endpoint: endpoint,
      data: data,
    };
    const response = await fetch(apiUrl, {
      method: httpMethod,
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseBody = (await response.json()) as unknown;
    assertIsHttpResponse(responseBody);

    return { ...data, ...responseBody };
  }
}

function assertIsHttpResponse(data: unknown): asserts data is HttpResponse {
  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('Saved data is not an object');
  }
  // check the data for the required fields
  // status
  if (!('status' in data)) {
    throw new Error('Saved data is missing the "status" field');
  }
  if (typeof data.status !== 'number') {
    throw new Error('Saved data "status" field is not a number');
  }
}
