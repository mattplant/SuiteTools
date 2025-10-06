import { getConcurrencyRequestData } from '../../../../utils/concurrency';
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
        startDate: 1748941035512,
        type: 'RESTLET',
        integrationId: 12345,
        operation: 'RESTLET',
        endDate: 1748941035984,
        scriptId: 123,
        integration: 'integration1',
        scriptName: 'My test integration',
        status: 'FINISHED',
        wouldBeRejected: false,
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
