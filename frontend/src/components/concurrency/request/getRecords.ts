import { getConcurrencyRequestData } from '../../../utils/concurrency';
import { ConcurrencyRequestData, CriteriaFields } from './types';

/**
 * Gets concurrency request data.
 *
 * @param fields - number of days to get the request for
 * @param [accountId] - NetSuite account ID
 * @returns concurrency request
 */
export async function getConcurrencyRequest(
  fields: CriteriaFields,
  accountId: string,
): Promise<ConcurrencyRequestData> {
  console.log('getConcurrencyRequest() initiated', { fields, accountId });

  let result: ConcurrencyRequestData;
  if (window.location.href.includes('localhost')) {
    result = [
      {
        date: 1733934299089,
        email: 'i@idev.systems',
        executionTime: 0.123,
        status: 'FINISHED',
        totalRecords: 0,
        operationId: 'aa111a1a-bbb2-33cc-d44d-55555e5ee5e5',
        frhtId: '111a11a1-2bb2-333-c44c-55e55ee55555',
      },
      {
        date: 1733937418436,
        email: 'i@idev.systems',
        executionTime: 0.456,
        status: 'FINISHED',
        totalRecords: 0,
        operationId: 'aa111a1a-bbb2-33cc-d44d-55555e5ee5e6',
        frhtId: '111a11a1-2bb2-333-c44c-55e55ee55555',
      },
    ] as ConcurrencyRequestData;
  } else {
    console.log('getConcurrencyRequest() loading concurrency from NetSuite page');
    if (accountId && fields.startDate && fields.endDate) {
      result = await getConcurrencyRequestData(accountId, fields.startDate, fields.endDate);
    } else {
      throw new Error('getConcurrencyRequest() missing required fields of accountId, startDate and endDate');
    }
  }

  return result;
}
