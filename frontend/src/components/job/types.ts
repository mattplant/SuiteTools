export interface Job {
  id: number; // internalid
  name: string;
  isinactive: boolean;
  config: string; // JSON string configuration
  description: string;
  scheduled: boolean;
  notify: boolean;
  // additional properties
  lastRun?: string; // last run timestamp
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
  // isinactive
  if (!('isinactive' in data)) {
    throw new Error('Job data is missing the "isinactive" field');
  }
  if (typeof data.isinactive !== 'boolean') {
    throw new Error('Job data "isinactive" field is not a boolean');
  }
  // config
  if (!('config' in data)) {
    throw new Error('Job data is missing the "config" field');
  }
  // if (typeof data.config !== 'string') {
  //   throw new Error('Job data "config" field is not a string');
  // }
  // description
  if (!('description' in data)) {
    throw new Error('Job data is missing the "description" field');
  }
  if (typeof data.description !== 'string') {
    throw new Error('Job data "description" field is not a string');
  }
  // scheduled
  // notify
  // ADDITIONAL PROPERTIES
  // lastRun
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
