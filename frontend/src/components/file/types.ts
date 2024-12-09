export interface File {
  id: number;
  folder: number; // todo: change to string
  createddate: string;
  lastmodifieddate: string;
  filetypename: string;
  name: string;
  filesize: number;
  // TODO description: string;
  url: string;
  // additional properties
  urlNs?: string;
  urlDetail?: string;
}

export function assertIsFile(data: unknown): asserts data is File {
  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('File data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('File data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('File data "id" field is not a number');
  }
  // folder
  if (!('folder' in data)) {
    throw new Error('File data is missing the "folder" field');
  }
  if (typeof data.folder !== 'number') {
    throw new Error('File data "folder" field is not a number');
  }
  // is createddate
  if (!('createddate' in data)) {
    throw new Error('File data is missing the "createddate" field');
  }
  if (typeof data.createddate !== 'string') {
    throw new Error('File data "createddate" field is not a string');
  }
  // lastmodifieddate
  if (!('lastmodifieddate' in data)) {
    throw new Error('File data is missing the "lastmodifieddate" field');
  }
  if (typeof data.lastmodifieddate !== 'string') {
    throw new Error('File data "lastmodifieddate" field is not a string');
  }
  // filetypename
  if (!('filetypename' in data)) {
    throw new Error('File data is missing the "filetypename" field');
  }
  if (typeof data.filetypename !== 'string') {
    throw new Error('File data "filetypename" field is not a string');
  }
  // name
  if (!('name' in data)) {
    throw new Error('File data is missing the "name" field');
  }
  if (typeof data.name !== 'string') {
    throw new Error('File data "name" field is not a string');
  }
  // filesize
  if (!('filesize' in data)) {
    throw new Error('File data is missing the "filesize" field');
  }
  if (typeof data.filesize !== 'number') {
    throw new Error('File data "filesize" field is not a number');
  }
  // TODO description
  // if (!('description' in data)) {
  //   throw new Error('File data is missing the "description" field');
  // }
  // if (typeof data.description !== 'string') {
  //   throw new Error('File data "description" field is not a string');
  // }
  // url
  if (!('url' in data)) {
    throw new Error('File data is missing the "url" field');
  }
  if (typeof data.url !== 'string') {
    throw new Error('File data "url" field is not a string');
  }
  // ADDITIONAL PROPERTIES
  // urlNs
  if ('urlNs' in data && typeof data.urlNs !== 'string') {
    throw new Error('File data "urlNs" field is not a string');
  }
  // urlDetail
  if ('urlDetail' in data && typeof data.urlDetail !== 'string') {
    throw new Error('File data "urlDetail" field is not a string');
  }
}

export function assertIsFiles(data: unknown): asserts data is File[] {
  if (!Array.isArray(data)) {
    throw new Error('Files data is not an array');
  }
  // only checking the first element
  if (data.length > 0) {
    assertIsFile(data[0]);
  }
}
