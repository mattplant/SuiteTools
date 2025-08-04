import { getConcurrencyDetailData } from '../../../../utils/concurrency';
import { ConcurrencyDetailData, CriteriaFields } from './types';

/**
 * Gets concurrency detail data.
 *
 * @param fields - number of days to get the detail for
 * @param [accountId] - NetSuite account ID
 * @returns concurrency detail
 */
export async function getConcurrencyDetail(fields: CriteriaFields, accountId: string): Promise<ConcurrencyDetailData> {
  console.log('getConcurrencyDetail() initiated', { fields, accountId });

  let result: ConcurrencyDetailData;
  if (window.location.href.includes('localhost')) {
    result = {
      concurrency: {
        overview: {
          pagingStartDateMS: 1736064000000,
          pagingEndDateMS: 1736067600000,
          concurrencyLimit: 20,
          peakConcurrency: {
            value: 1,
            dateMS: 1736067360000,
          },
        },
        config: {
          startDateMS: 1736064000000,
          endDateMS: 1736067600000,
          groupAggMS: 60000,
          maxConcurrency: 20,
        },
        indices: {
          '1736064000000': 0,
          '1736064060000': 1,
        },
        concurrency: [
          [1736064000000, 0],
          [1736064060000, 0],
        ],
        results: [
          {
            startTime: 1736064000000,
            endTime: 1736064060000,
            averageConcurrency: 0,
            peakConcurrency: 1,
            peakConcurrencyTime: '2025-01-05 09:13:04',
          },
          {
            startTime: 1736064060000,
            endTime: 1736064120000,
            averageConcurrency: 0,
            peakConcurrency: 0,
          },
        ],
      },
      violations: {
        overview: {
          totalRequests: 13,
          totalViolations: 0,
          topIntegrations: [
            {
              id: 18143,
              name: 'eTail Connectors (Token-Based Auth)',
              value: 13,
            },
          ],
          integrationName: '',
        },
        config: {
          startDateMS: 1736064000000,
          endDataMS: 1736067600000,
          groupAggMS: 60000,
        },
        indices: {
          '1736064000000': 0,
          '1736064060000': 1,
        },
        violations: [
          [1736064000000, 0],
          [1736064060000, 0],
        ],
      },
    };
  } else {
    console.log('getConcurrencyDetail() loading concurrency from NetSuite page');
    if (accountId && fields.startDate && fields.endDate) {
      result = await getConcurrencyDetailData(accountId, fields.startDate, fields.endDate);
    } else {
      throw new Error('getConcurrencyDetail() missing required fields of accountId, startDate and endDate');
    }
  }

  return result;
}
