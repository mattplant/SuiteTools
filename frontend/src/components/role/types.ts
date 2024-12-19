export interface Role {
  id: number;
  isinactive: string;
  name: string;
  centertype: string;
  issalesrole: boolean;
  issupportrole: boolean;
  iswebserviceonlyrole: boolean;
  // additional properties
  urlNs?: string;
  urlDetail?: string;
}

export function assertIsRole(data: unknown): asserts data is Role {
  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('Role data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('Role data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('Role data "id" field is not a number');
  }
  // is inactive
  if (!('isinactive' in data)) {
    throw new Error('Role data is missing the "isinactive" field');
  }
  if (typeof data.isinactive !== 'string') {
    throw new Error('Role data "isinactive" field is not a string');
  }
  // name
  if (!('name' in data)) {
    throw new Error('Role data is missing the "name" field');
  }
  if (typeof data.name !== 'string') {
    throw new Error('Role data "name" field is not a string');
  }
  // centertype
  if (!('centertype' in data)) {
    throw new Error('Role data is missing the "centertype" field');
  }
  if (typeof data.centertype !== 'string') {
    throw new Error('Role data "centertype" field is not a string');
  }
  // issalesrole
  if (!('issalesrole' in data)) {
    throw new Error('Role data is missing the "issalesrole" field');
  }
  if (typeof data.issalesrole !== 'string') {
    throw new Error('Role data "issalesrole" field is not a string');
  }
  // issupportrole
  if (!('issupportrole' in data)) {
    throw new Error('Role data is missing the "issupportrole" field');
  }
  if (typeof data.issupportrole !== 'string') {
    throw new Error('Role data "issupportrole" field is not a string');
  }
  // iswebserviceonlyrole
  if (!('iswebserviceonlyrole' in data)) {
    throw new Error('Role data is missing the "iswebserviceonlyrole" field');
  }
  if (typeof data.iswebserviceonlyrole !== 'string') {
    throw new Error('Role data "iswebserviceonlyrole" field is not a string');
  }
  // ADDITIONAL PROPERTIES
  // urlNs
  if ('urlNs' in data && typeof data.urlNs !== 'string') {
    throw new Error('Role data "urlNs" field is not a string');
  }
  // urlRole
  if ('urlRole' in data && typeof data.urlRole !== 'string') {
    throw new Error('Role data "urlRole" field is not a string');
  }
}

export function assertIsRoles(data: unknown): asserts data is Role[] {
  if (!Array.isArray(data)) {
    throw new Error('Role data is not an array');
  }
  // only checking the first element
  if (data.length > 0) {
    assertIsRole(data[0]);
  }
}
