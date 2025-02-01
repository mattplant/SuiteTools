import { getConcurrencySummaryData } from '../../../utils/concurrency';
import { ConcurrencySummaryData, CriteriaFields } from './types';

/**
 * Gets concurrency summary data.
 *
 * @param fields - number of days to get the summary for
 * @param [accountId] - NetSuite account ID
 * @returns concurrency summary
 */
export async function getConcurrencySummary(
  fields: CriteriaFields,
  accountId?: string,
): Promise<ConcurrencySummaryData> {
  console.log('getConcurrencySummary() initiated', { fields, accountId });

  let result: ConcurrencySummaryData;
  if (window.location.href.includes('localhost')) {
    result = {
      concurrency: {
        overview: {
          concurrencyLimit: 20,
          peakConcurrency: { value: 17, dateMS: 1735866000000 },
          timeCloseToLimit: { value: '1.23', lowerRange: 18, upperRange: 20 },
          timeOverLimit: { value: '2.46', range: 20 },
        },
        config: {
          concurrencyLimit: 20,
          resolutionMS: 3600000,
          refreshDate: 1735977600000,
          startDateFilterMS: 1733385600000,
          endDateFilterMS: 1735977600000,
        },
        xCategories: [1735891200000, 1735894800000],
        yCategories: [1733385600000, 1733472000000],
        series: {
          average: [
            [0, 0, 0, 1733385600000],
            [1, 0, 0, 1733389200000],
          ],
          peak: [
            [0, 0, 50, 1733385600000],
            [1, 0, 25, 1733389200000],
          ],
        },
        allocations: {},
        results: [
          {
            startTime: 1733385600000,
            endTime: 1733389200000,
            averageConcurrency: 0,
            peakConcurrency: 0,
          },
        ],
      },
      violations: {
        mode: 'noallocation',
        integrations: [],
        overview: { totalViolations: 1, totalRequests: 123 },
        config: { resolutionMS: 3600000 },
        series: { violation: {} },
      },
    };
  } else {
    console.log('getConcurrencySummary() loading concurrency from NetSuite page');
    if (accountId && fields.dateRange) {
      result = await getConcurrencySummaryData(accountId, fields.dateRange);
    } else {
      throw new Error('getConcurrencySummary() missing required fields of accountId and dateRange');
    }
  }

  return result;
}
