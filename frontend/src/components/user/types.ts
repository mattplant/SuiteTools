export interface User {
  id: number;
  isinactive: string;
  email: string;
  name: string;
  supervisor?: string;
  title: string;
  // supplemental properties
  lastLogin?: string;
  role_names?: string;
  // additional properties
  urlNs?: string;
  urlDetail?: string;
}

export function assertIsUser(data: unknown): asserts data is User {
  if (typeof data !== 'object' || data === null) {
    throw new Error('User data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('User data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('User data "id" field is not a number');
  }
  // is inactive
  if (!('isinactive' in data)) {
    throw new Error('User data is missing the "isinactive" field');
  }
  if (typeof data.isinactive !== 'string') {
    throw new Error('User data "isinactive" field is not a string');
  }
  // email
  if (!('email' in data)) {
    throw new Error('User data is missing the "email" field');
  }
  if (typeof data.email !== 'string') {
    throw new Error('User data "email" field is not a string');
  }
  // name
  if (!('name' in data)) {
    throw new Error('User data is missing the "name" field');
  }
  if (typeof data.name !== 'string') {
    throw new Error('User data "name" field is not a string');
  }
  // supervisor (optional)
  if ('supervisor' in data && data.supervisor && typeof data.supervisor !== 'string') {
    throw new Error('User data "supervisor" field is not a string');
  }
  // title
  if (!('title' in data)) {
    throw new Error('User data is missing the "title" field');
  }
  if (typeof data.title !== 'string') {
    throw new Error('User data "title" field is not a string');
  }
  // SUPPLEMENTAL PROPERTIES
  // lastLogin
  if ('lastLogin' in data && data.lastLogin && typeof data.lastLogin !== 'string') {
    throw new Error('User data "lastLogin" field is not a string');
  }
  // roles
  if ('roles' in data && typeof data.roles !== 'string') {
    throw new Error('User data "roles" field is not a string');
  }
  // ADDITIONAL PROPERTIES
  // urlNs
  if ('urlNs' in data && typeof data.urlNs !== 'string') {
    throw new Error('User data "urlNs" field is not a string');
  }
  // urlUser
  if ('urlUser' in data && typeof data.urlUser !== 'string') {
    throw new Error('User data "urlUser" field is not a string');
  }
}

export function assertIsUsers(data: unknown): asserts data is User[] {
  if (!Array.isArray(data)) {
    throw new Error('User data is not an array');
  }
  // only checking the first element
  if (data.length > 0) {
    assertIsUser(data[0]);
  }
}
