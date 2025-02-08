export interface Job {
  id: number;
  name: string;
  // additional properties
  urlDetail?: string;
}

export function assertIsJob(data: unknown): asserts data is Job {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Job data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('Job data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('Job data "id" field is not a number');
  }
  // name
  if (!('name' in data)) {
    throw new Error('Job data is missing the "name" field');
  }
  if (typeof data.name !== 'string') {
    throw new Error('Job data "name" field is not a string');
  }
  // ADDITIONAL PROPERTIES
  // urlDetail
  if ('urlDetail' in data && typeof data.urlDetail !== 'string') {
    throw new Error('Job data "urlDetail" field is not a string');
  }
}

export function assertIsJobs(data: unknown): asserts data is Job[] {
  if (!Array.isArray(data)) {
    throw new Error('Jobs data is not an array');
  }
  // only checking the first element
  if (data.length > 0) {
    assertIsJob(data[0]);
  }
}
