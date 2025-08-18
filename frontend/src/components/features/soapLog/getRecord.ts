import { getSoapLogs } from './getRecords';
import type { NotFound } from '../../../api/types';
import { SoapLogBundle } from '@suiteworks/suitetools-shared';
import type { SoapLog } from '@suiteworks/suitetools-shared';

export async function getSoapLog(id: number): Promise<SoapLog | NotFound> {
  console.log('getSoapLog() initiated', { id });
  let rawResult;
  if (window.location.href.includes('localhost')) {
    // mock data for local development
    rawResult = {
      id: 1,
      startDate: '12/22/2024 8:53:01 pm',
      duration: 0.123,
      integration: '/app/common/integration/integrapp.nl?id=123" target="_self">Application URL 1</a>',
      action: 'search',
      recordType: '',
      user: 'idev@systems.com',
      status: 'FINISHED',
      records: 0,
      recordsFinished: 0,
      recordsFailed: 0,
      recordsReturned: 0,
      request: 'request',
      response: 'response',
    };
  } else {
    if (!id) {
      rawResult = { message: 'Skipping loading SOAP log since id is 0' };
    } else {
      console.log('getSoapLog() loading SOAP logs from NetSuite page', { id });
      const records = await getSoapLogs({});
      rawResult = records.find((record) => record.id === id);
      if (!rawResult) {
        throw new Error(`SoapLog with ID ${id} not found`);
      }
    }
  }
  // now we have the raw result from either mock or NetSuite
  const parsedResult = SoapLogBundle.parse(rawResult);
  // add additional properties
  parsedResult.urlDetail = `#/soapLog/${parsedResult.id}`;

  return parsedResult;
}
