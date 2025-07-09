import { ConcurrencySummaryData } from './types';
import { formatDate } from '../../../utils/dates';

type Props = {
  data: ConcurrencySummaryData | undefined;
};

export function ConcurrencySummaryOverview({ data }: Props) {
  console.log('ConcurrencySummaryOverview() initiated', { data });
  if (!data) {
    return null;
  }

  // calculate error rate percentage
  const errorRate = (data.violations.overview.totalViolations / data.violations.overview.totalRequests) * 100;
  const errorRateRounded = Math.round(errorRate * 100) / 100 + '%';

  return (
    <div className="mx-auto text-center">
      <div className="flex bg-gray-50 rounded-lg shadow-sm">
        <div className="flex-1 p-5">
          <h3 className="text-lg font-bold text-slate-900">Concurrency Limit</h3>
          <h1 id="concurrencyLimit" className="text-3xl text-gray-500 p-2">
            {data.concurrency.overview.concurrencyLimit}
          </h1>
        </div>
        <div className="flex-1 p-5">
          <h3 className="text-lg font-bold text-slate-900">Peak Concurrency</h3>
          <h1 id="peakConcurrency" className="text-3xl text-gray-500 p-2">
            {data.concurrency.overview.peakConcurrency.value}
          </h1>
          <span id="peakConcurrencyDate" className="text-sm text-gray-500">
            {formatDate(data.concurrency.overview.peakConcurrency.dateMS)}
          </span>
        </div>
        <div className="flex-1 p-5">
          <h3 className="text-lg font-bold text-slate-900">Close to the Limit</h3>
          <h1 id="closeToLimitRate" className="text-3xl text-gray-500 p-2">
            {data.concurrency.overview.timeCloseToLimit.value + '%'}
          </h1>
          <span id="closeToLimitRange" className="text-sm text-gray-500">
            {'Requests between ' +
              data.concurrency.overview.timeCloseToLimit.lowerRange +
              ' and ' +
              data.concurrency.overview.timeCloseToLimit.upperRange}
          </span>
        </div>
        <div className="flex-1 p-5">
          <h3 className="text-lg font-bold text-slate-900">Over the Limit</h3>
          <h1 id="overLimitRate" className="text-3xl text-gray-500 p-2">
            {data.concurrency.overview.timeOverLimit.value + '%'}
          </h1>
          <span id="overLimitRange" className="text-sm text-gray-500">
            {'Requests over ' + data.concurrency.overview.timeOverLimit.range}
          </span>
        </div>
        <div className="flex-1 p-5">
          <h3 className="text-lg font-bold text-red-700">Error Rate</h3>
          <h1 id="errorRate" className="text-3xl text-gray-500 p-2">
            {errorRateRounded}
          </h1>
          <span id="errorRateDetail" className="text-sm text-gray-500">
            {data.violations.overview.totalViolations +
              ' violations in ' +
              data.violations.overview.totalRequests +
              ' requests'}
          </span>
        </div>
      </div>
    </div>
  );
}
