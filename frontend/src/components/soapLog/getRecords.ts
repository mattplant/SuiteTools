import { getDataFromPageTable } from '../../utils/collectData';
import { assertIsSoapLogs, cleanSoapLogsData, SoapLog } from './types';
import { CriteriaFields } from '../criteria/types';

export async function getSoapLogs(fields: CriteriaFields): Promise<SoapLog[]> {
  console.log('getSoapLogs() initiated', { fields });
  const urlParams = {
    integrations: fields.integrations,
  };
  let data: SoapLog[] = [];
  let dataArray: string[][] = [];
  if (window.location.href.includes('localhost')) {
    // mock data for local development
    dataArray = [
      [
        '12345',
        '12/22/2024 8:53:01 pm',
        '0.123',
        '<a href="/app/common/integration/integrapp.nl?id=123" target="_self">Application URL 1</a>',
        'search',
        '',
        'idev@systems.com',
        'FINISHED',
        '0',
        '0',
        '0',
        '0',
        'request',
        'response',
      ],
      [
        '123456',
        '12/22/2024 8:53:02 pm',
        '0.1234',
        '<a href="/app/common/integration/integrapp.nl?id=456">Application URL 2</a>',
        'search',
        '',
        'idev@systems.com',
        'FINISHED',
        '0',
        '0',
        '0',
        '0',
        'request',
        'response',
      ],
    ];
  } else {
    // get data from NetSuite page
    dataArray = await getDataFromPageTable(
      '/app/webservices/syncstatus.nl?frame=B&sortcol=jobid&sortdir=DESC&daterange=CUSTOM&datemodi=WITHIN&datefrom=12%2F1%2F2024&datefromtime=12%3A00%20am&date=CUSTOM&segment=0',
      'div__body',
      true,
    );
  }
  // convert array to record objects
  dataArray.map((record) => {
    data.push({
      id: Number(record[0]),
      startDate: record[1],
      duration: Number(record[2]),
      integration: record[3],
      action: record[4],
      recordType: record[5],
      user: record[6],
      status: record[7],
      records: Number(record[8]),
      recordsFinished: Number(record[9]),
      recordsFailed: Number(record[10]),
      recordsReturned: Number(record[11]),
      request: record[12],
      response: record[13],
    });
  });
  assertIsSoapLogs(data);
  cleanSoapLogsData(data);
  // filter data based on integrationId
  if (urlParams.integrations && urlParams.integrations.length > 0 && urlParams.integrations[0]) {
    data = data.filter((record) => {
      return urlParams.integrations!.includes(String(record.integrationId));
    });
  }

  return data;
}
