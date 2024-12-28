export interface Token {
  id: number;
  name: string;
  user: string;
  role: string;
  integration: string;
  state: string; // Inactive - TODO change type to boolean
  dateCreated: string;
  createdBy: string;
  // additional properties
  urlNs?: string;
  urlDetail?: string;
}

export function assertIsToken(data: unknown): asserts data is Token {
  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('Token data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('Token data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('Token data "id" field is not a number');
  }
  // name
  if (!('name' in data)) {
    throw new Error('Token data is missing the "name" field');
  }
  if (typeof data.name !== 'string') {
    throw new Error('Token data "name" field is not a string');
  }
  // user
  if (!('user' in data)) {
    throw new Error('Token data is missing the "user" field');
  }
  if (typeof data.user !== 'string') {
    throw new Error('Token data "user" field is not a string');
  }
  // role
  if (!('role' in data)) {
    throw new Error('Token data is missing the "role" field');
  }
  if (typeof data.role !== 'string') {
    throw new Error('Token data "role" field is not a string');
  }
  // integration
  if (!('integration' in data)) {
    throw new Error('Token data is missing the "integration" field');
  }
  if (typeof data.integration !== 'string') {
    throw new Error('Token data "integration" field is not a string');
  }
  // TODO fix state
  // if (!('state' in data)) {
  //   throw new Error('Token data is missing the "state" field');
  // }
  // if (typeof data.state !== 'boolean') {
  //   throw new Error('Token data "state" field is not a boolean');
  // }
  // TODO fix dateCreated
  // if (!('dateCreated' in data)) {
  //   throw new Error('Token data is missing the "dateCreated" field');
  // }
  // if (typeof data.dateCreated !== 'string') {
  //   throw new Error('Token data "dateCreated" field is not a string');
  // }
  // TODO fix createdBy
  // if (!('createdBy' in data)) {
  //   throw new Error('Token data is missing the "createdBy" field');
  // }
  // if (typeof data.createdBy !== 'string') {
  //   throw new Error('Token data "createdBy" field is not a string');
  // }
  // ADDITIONAL PROPERTIES
  // urlNs
  if ('urlNs' in data && typeof data.urlNs !== 'string') {
    throw new Error('Token data "urlNs" field is not a string');
  }
  // urlDetail
  if ('urlDetail' in data && typeof data.urlDetail !== 'string') {
    throw new Error('Detail data "urlDetail" field is not a string');
  }
}

export function assertIsTokens(data: unknown): asserts data is Token[] {
  if (!Array.isArray(data)) {
    throw new Error('Tokens data is not an array');
  }
  // only checking the first element
  if (data.length > 0) {
    assertIsToken(data[0]);
  }
}
