export interface ScriptLogsLine {
  id: number;
  timestamp: string;
  type: string;
  scripttype: string;
  owner: string;
  scriptname: string;
  title: string;
  detail: string;
}

export function assertIsScriptLog(data: unknown): asserts data is ScriptLogsLine {
  console.log('assertIsScriptLog', data);

  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('Script log data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('Script log data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('Script log data "id" field is not a number');
  }
  // timestamp
  if (!('timestamp' in data)) {
    throw new Error('Script log data is missing the "timestamp" field');
  }
  if (typeof data.timestamp !== 'string') {
    throw new Error('Script log data "timestamp" field is not a string');
  }
  // type
  if (!('type' in data)) {
    throw new Error('Script log data is missing the "type" field');
  }
  if (typeof data.type !== 'string') {
    throw new Error('Script log data "type" field is not a string');
  }
  // scripttype
  if (!('scripttype' in data)) {
    throw new Error('Script log data is missing the "scripttype" field');
  }
  if (typeof data.scripttype !== 'string') {
    throw new Error('Script log data "scripttype" field is not a string');
  }
  // owner
  if (!('owner' in data)) {
    throw new Error('Script log data is missing the "owner" field');
  }
  if (typeof data.owner !== 'string') {
    throw new Error('Script log data "owner" field is not a string');
  }
  // scriptname
  if (!('scriptname' in data)) {
    throw new Error('Script log data is missing the "scriptname" field');
  }
  if (typeof data.scriptname !== 'string') {
    throw new Error('Script log data "scriptname" field is not a string');
  }
  // title
  if (!('title' in data)) {
    throw new Error('Script log data is missing the "title" field');
  }
  if (typeof data.title !== 'string') {
    throw new Error('Script log data "title" field is not a string');
  }
  // detail
  if (!('detail' in data)) {
    throw new Error('Script log data is missing the "detail" field');
  }
  // if (typeof data.detail !== 'string') {
  //   throw new Error('Script log data "detail" field is not a string');
  // }
}

export function assertIsScriptLogs(data: unknown): asserts data is ScriptLogsLine[] {
  console.log('assertIsScriptLogs', data);
  if (!Array.isArray(data)) {
    throw new Error('Script log data is not an array');
  }
  if (data.length > 0) {
    assertIsScriptLog(data[0]);
  }
}
