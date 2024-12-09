export interface Script {
  id: number;
  apiversion: string;
  isinactive: string;
  scripttype: string;
  name: string;
  scriptid: string;
  owner: string;
  scriptfile: string;
  notifyemails: string;
  description: string;
  // additional properties
  urlNs?: string;
  urlDetail?: string;
  urlScriptLogs?: string;
}

export function assertIsScript(data: unknown): asserts data is Script {
  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('Script data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('Script data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('Script data "id" field is not a number');
  }
  // api version
  if (!('apiversion' in data)) {
    throw new Error('Script data is missing the "apiversion" field');
  }
  if (typeof data.apiversion !== 'string') {
    throw new Error('Script data "apiversion" field is not a string');
  }
  // is inactive
  if (!('isinactive' in data)) {
    throw new Error('Script data is missing the "isinactive" field');
  }
  if (typeof data.isinactive !== 'string') {
    throw new Error('Script data "isinactive" field is not a string');
  }
  // script type
  if (!('scripttype' in data)) {
    throw new Error('Script data is missing the "scripttype" field');
  }
  if (typeof data.scripttype !== 'string') {
    throw new Error('Script data "scripttype" field is not a string');
  }
  // name
  if (!('name' in data)) {
    throw new Error('Script data is missing the "name" field');
  }
  if (typeof data.name !== 'string') {
    throw new Error('Script data "name" field is not a string');
  }
  // script id
  if (!('scriptid' in data)) {
    throw new Error('Script data is missing the "scriptid" field');
  }
  if (typeof data.scriptid !== 'string') {
    throw new Error('Script data "scriptid" field is not a string');
  }
  // owner
  if (!('owner' in data)) {
    throw new Error('Script data is missing the "owner" field');
  }
  if (typeof data.owner !== 'string') {
    throw new Error('Script data "owner" field is not a string');
  }
  // script file
  if (!('scriptfile' in data)) {
    throw new Error('Script data is missing the "scriptfile" field');
  }
  if (typeof data.scriptfile !== 'string') {
    throw new Error('Script data "scriptfile" field is not a string');
  }
  // TODO notifyemails: string;
  // TODO description: string;
  // ADDITIONAL PROPERTIES
  // urlNs
  if ('urlNs' in data && typeof data.urlNs !== 'string') {
    throw new Error('File data "urlNs" field is not a string');
  }
  // urlDetail
  if ('urlDetail' in data && typeof data.urlDetail !== 'string') {
    throw new Error('File data "urlDetail" field is not a string');
  }
  // urlScriptLogs
  if ('urlScriptLogs' in data && typeof data.urlScriptLogs !== 'string') {
    throw new Error('File data "urlScriptLogs" field is not a string');
  }
}

export function assertIsScripts(data: unknown): asserts data is Script[] {
  if (!Array.isArray(data)) {
    throw new Error('Script data is not an array');
  }
  // only checking the first element
  if (data.length > 0) {
    assertIsScript(data[0]);
  }
}
