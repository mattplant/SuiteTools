import {
  RequestBody,
  Response,
  SavedEndpoint,
  SaveMethod,
  SavedData,
  assertIsResponse,
  assertIsSavedData,
} from './types';

const script = 'customscript_idev_suitetools_api';
const deploy = 'customdeploy_idev_suitetools_api';
const apiBaseUrl = `/app/site/hosting/restlet.nl?script=${script}&deploy=${deploy}`;

export async function getData(localTestData: object, endpoint: string, urlParams: object = {}): Promise<Response> {
  console.log('getData() initiated', { localTestData, endpoint, urlParams });

  // check to see if any of the used script params are in the urlParams object
  const usedParams = ['script', 'deploy', 'compid', 'endpoint']; // first 3 used by NetSuite and last by SuiteTools
  const usedParamsInUrlParams = usedParams.filter((param) => Object.keys(urlParams).includes(param));
  if (usedParamsInUrlParams.length > 0) {
    throw new Error(
      `getData() ${endpoint} urlParams contains the following script params: ${usedParamsInUrlParams.join(', ')}`,
    );
  }

  if (window.location.href.includes('localhost')) {
    // use dummy data for local development, but delay the response to simulate network latency
    const data = await new Promise((resolve) => setTimeout(() => resolve(localTestData), 1000));
    console.log(`getData() local ${endpoint} data`, data);
    assertIsResponse(data);

    return data;
  } else {
    // get data from NetSuite
    const apiEndpoint = `${apiBaseUrl}&endpoint=${endpoint}`;
    const urlParamsString = Object.entries(urlParams)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    const apiUrl = `${apiEndpoint}&${urlParamsString}`;
    console.log(`getData() ${endpoint} apiUrl`, apiUrl);
    const response = await fetch(apiUrl);
    const data = (await response.json()) as unknown;
    console.log(`getData() server ${endpoint} data`, data);
    assertIsResponse(data);

    return data;
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
