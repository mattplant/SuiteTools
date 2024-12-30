export interface SoapLog {
  id: number;
  startDate: string;
  duration: number;
  integration: string;
  integrationId?: number;
  action: string;
  recordType: string;
  user: string;
  status: string;
  records: number;
  recordsFinished: number;
  recordsFailed: number;
  recordsReturned: number;
  request: string;
  response: string;
  // additional properties
  urlDetail?: string;
}

export function assertIsSoapLog(data: unknown): asserts data is SoapLog {
  // check if the data is an object
  if (typeof data !== 'object' || data === null) {
    throw new Error('SoapLog data is not an object');
  }
  // check the data for the required fields
  // id
  if (!('id' in data)) {
    throw new Error('SoapLog data is missing the "id" field');
  }
  if (typeof data.id !== 'number') {
    throw new Error('SoapLog data "id" field is not a number');
  }
  // startDate
  if (!('startDate' in data)) {
    throw new Error('SoapLog data is missing the "startDate" field');
  }
  if (typeof data.startDate !== 'string') {
    throw new Error('SoapLog data "startDate" field is not a string');
  }
  // duration
  if (!('duration' in data)) {
    throw new Error('SoapLog data is missing the "duration" field');
  }
  if (typeof data.duration !== 'number') {
    throw new Error('SoapLog data "duration" field is not a number');
  }
  // integration
  if (!('integration' in data)) {
    throw new Error('SoapLog data is missing the "integration" field');
  }
  if (typeof data.integration !== 'string') {
    throw new Error('SoapLog data "integration" field is not a string');
  }
  // integrationId
  if ('integrationId' in data && typeof data.integrationId !== 'number') {
    throw new Error('SoapLog data "integrationId" field is not a number');
  }
  // action
  if (!('action' in data)) {
    throw new Error('SoapLog data is missing the "action" field');
  }
  if (typeof data.action !== 'string') {
    throw new Error('SoapLog data "action" field is not a string');
  }
  // recordType
  if (!('recordType' in data)) {
    throw new Error('SoapLog data is missing the "recordType" field');
  }
  if (typeof data.recordType !== 'string') {
    throw new Error('SoapLog data "recordType" field is not a string');
  }
  // user
  if (!('user' in data)) {
    throw new Error('SoapLog data is missing the "user" field');
  }
  if (typeof data.user !== 'string') {
    throw new Error('SoapLog data "user" field is not a string');
  }
  // status
  if (!('status' in data)) {
    throw new Error('SoapLog data is missing the "status" field');
  }
  if (typeof data.status !== 'string') {
    throw new Error('SoapLog data "status" field is not a string');
  }
  // records
  if (!('records' in data)) {
    throw new Error('SoapLog data is missing the "records" field');
  }
  if (typeof data.records !== 'number') {
    throw new Error('SoapLog data "records" field is not a number');
  }
  // recordsFinished
  if (!('recordsFinished' in data)) {
    throw new Error('SoapLog data is missing the "recordsFinished" field');
  }
  if (typeof data.recordsFinished !== 'number') {
    throw new Error('SoapLog data "recordsFinished" field is not a number');
  }
  // recordsFailed
  if (!('recordsFailed' in data)) {
    throw new Error('SoapLog data is missing the "recordsFailed" field');
  }
  if (typeof data.recordsFailed !== 'number') {
    throw new Error('SoapLog data "recordsFailed" field is not a number');
  }
  // recordsReturned
  if (!('recordsReturned' in data)) {
    throw new Error('SoapLog data is missing the "recordsReturned" field');
  }
  if (typeof data.recordsReturned !== 'number') {
    throw new Error('SoapLog data "recordsReturned" field is not a number');
  }
  // request
  if (!('request' in data)) {
    throw new Error('SoapLog data is missing the "request" field');
  }
  if (typeof data.request !== 'string') {
    throw new Error('SoapLog data "request" field is not a string');
  }
  // response
  if (!('response' in data)) {
    throw new Error('SoapLog data is missing the "response" field');
  }
  if (typeof data.response !== 'string') {
    throw new Error('SoapLog data "response" field is not a string');
  }
}

export function assertIsSoapLogs(data: unknown): asserts data is SoapLog[] {
  if (!Array.isArray(data)) {
    throw new Error('SoapLogs data is not an array');
  }
  // only checking the first element
  if (data.length > 0) {
    assertIsSoapLog(data[0]);
  }
}

export function cleanSoapLogData(data: SoapLog): SoapLog {
  // clear recordType field if blank
  if (data.recordType === '&nbsp;') {
    data.recordType = '';
  }
  if (data.integration) {
    const matchResult = data.integration.match(/id=(\d+)/);
    if (matchResult) {
      data.integrationId = Number(matchResult[1]);
    }
    data.integration = data.integration.replace(/<[^>]*>?/gm, '').trim();
  }
  if (data.request) {
    const matchResult = data.request.match(/jobid=([^&"]*)/);
    if (matchResult) {
      data.request = `/app/webservices/wslog.nl?req=T&jobid=${matchResult[1]}`;
    }
  }
  if (data.response) {
    const matchResult = data.response.match(/jobid=([^&"]*)/);
    if (matchResult) {
      data.response = `/app/webservices/wslog.nl?req=F&jobid=${matchResult[1]}`;
    }
  }

  return data;
}

export function cleanSoapLogsData(data: SoapLog[]): SoapLog[] {
  console.log('cleanSoapLogsData() initiated', { data });
  if (data) {
    data.forEach((record) => {
      cleanSoapLogData(record);
    });
  }

  return data;
}
