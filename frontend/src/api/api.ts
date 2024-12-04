import { RequestBody, Response, SavedEndpoint, SaveMethod, SavedData } from './types';

const script = 'customscript_idev_suitetools_api';
const deploy = 'customdeploy_idev_suitetools_api';
const apiBaseUrl = `/app/site/hosting/restlet.nl?script=${script}&deploy=${deploy}`;

export async function getData(localTestData: object, endpoint: string, params: object = {}): Promise<Response> {
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
    // get mock data for local development
    console.log(`getData() endpoint "${endpoint}" mock call initiated with params:`, paramString);
    const data = await new Promise((resolve) => setTimeout(() => resolve(localTestData), 1000));
    console.log(`getData() endpoint "${endpoint}" mock call response`, data);
    assertIsResponse(data);

    return data;
  } else {
    // get data from NetSuite
    console.log(`getData() endpoint "${endpoint}" initiated with params:`, paramString);
    const apiUrl = `${apiBaseUrl}&endpoint=${endpoint}&${paramString}`;
    const response = await fetch(apiUrl);
    const data = (await response.json()) as unknown;
    console.log(`getData() endpoint "${endpoint}" response`, data);
    assertIsResponse(data);

    return data;
  }
}

export function assertIsResponse(data: unknown): asserts data is Response {
  if (typeof data !== 'object') {
    throw new Error('Response is not an object');
  }
  if (data === null) {
    throw new Error('Response is null');
  }
  if (!('data' in data)) {
    throw new Error('Response does not contain data');
  }
}

export async function saveData(endpoint: SavedEndpoint, saveMethod: SaveMethod, data: object): Promise<SavedData> {
  console.log('saveData() initiated', { endpoint, saveMethod, data });

  if (window.location.href.includes('localhost')) {
    // use dummy data for local development
    const responseBody: SavedData = {
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
      method: saveMethod,
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseBody = (await response.json()) as unknown;
    assertIsSavedData(responseBody);

    return { ...data, ...responseBody };
  }
}

export function assertIsSavedData(data: unknown): asserts data is SavedData {
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
