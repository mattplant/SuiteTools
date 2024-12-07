export interface Integration {
  id: number;
  name: string;
  applicationId: string;
  state: string;
  dateCreated: string;
  // additional properties
  urlNs?: string;
  urlDetail?: string;
}

export function assertIsIntegration(data: unknown): asserts data is Integration {
  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('Integration data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('Integration data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('Integration data "id" field is not a number');
  }
  // name
  if (!('name' in data)) {
    throw new Error('Integration data is missing the "name" field');
  }
  if (typeof data.name !== 'string') {
    throw new Error('Integration data "name" field is not a string');
  }
  // applicationId
  if (!('applicationId' in data)) {
    throw new Error('Integration data is missing the "applicationId" field');
  }
  if (typeof data.applicationId !== 'string') {
    throw new Error('Integration data "applicationId" field is not a string');
  }
  // state
  if (!('state' in data)) {
    throw new Error('Integration data is missing the "state" field');
  }
  if (typeof data.state !== 'string') {
    throw new Error('Integration data "state" field is not a string');
  }
  // dateCreated
  if (!('dateCreated' in data)) {
    throw new Error('Integration data is missing the "dateCreated" field');
  }
  if (typeof data.dateCreated !== 'string') {
    throw new Error('Integration data "dateCreated" field is not a string');
  }
  // ADDITIONAL PROPERTIES
  // urlNs
  if ('urlNs' in data && typeof data.urlNs !== 'string') {
    throw new Error('Integration data "urlNs" field is not a string');
  }
  // urlDetail
  if ('urlDetail' in data && typeof data.urlDetail !== 'string') {
    throw new Error('Detail data "urlDetail" field is not a string');
  }
}

export function assertIsIntegrations(data: unknown): asserts data is Integration[] {
  if (!Array.isArray(data)) {
    throw new Error('Integrations data is not an array');
  }
  // only checking the first element
  if (data.length > 0) {
    assertIsIntegration(data[0]);
  }
}
