export type Response = {
  data: object;
  remainingUsage?: number;
};

export enum SavedEndpoint {
  SETTINGS = 'settings',
}

export enum SaveMethod {
  PUT = 'PUT',
  POST = 'POST',
}

export type SavedData = {
  status: number;
};

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
