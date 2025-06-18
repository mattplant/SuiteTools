import { ConcurrencyDetailData } from './types';
import { formatDate } from '../../../utils/dates';

type Props = {
  data: ConcurrencyDetailData | undefined;
};

export function ConcurrencyDetailOverview({ data }: Props) {
  console.log('ConcurrencyDetailOverview() initiated', { data });
  if (!data) {
    return null;
  }
  // calculate error rate percentage
  const errorRate = (data.violations.overview.totalViolations / data.violations.overview.totalRequests) * 100;
  const errorRateRounded = Math.round(errorRate * 100) / 100 + '%';
  // get top integrations
  const topIntegrations = data.violations.overview.topIntegrations;
  console.log('topIntegrations = ' + JSON.stringify(topIntegrations));
  const topIntegrationsArray = [];
  if (topIntegrations && topIntegrations.length > 0) {
    for (let i = 0; i < topIntegrations.length; i++) {
      const topIntegration = topIntegrations[i];
      topIntegrationsArray.push(topIntegration.name + ' - ' + topIntegration.value + ' requests');
    }
  }

  return (
    <div className="mx-auto text-center">
      <div className="flex bg-gray-50 rounded-lg shadow">
        <div className="flex-1 p-5">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">Concurrency Limit</h3>
          <h1 id="concurrencyLimit" className="text-3xl text-gray-500 p-2">
            {data.concurrency.overview.concurrencyLimit}
          </h1>
        </div>
        <div className="flex-1 p-5">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">Peak Concurrency</h3>
          <h1 id="peakConcurrency" className="text-3xl text-gray-500 p-2">
            {data.concurrency.overview.peakConcurrency.value}
          </h1>
          <span id="peakConcurrencyDate" className="text-sm text-gray-500">
            {formatDate(data.concurrency.overview.peakConcurrency.dateMS)}
          </span>
        </div>
        <div className="flex-1 p-5">
          <h3 className="text-xl font-bold tracking-tight text-red-700">Error Rate</h3>
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
        <div className="flex-1 p-5">
          <h3 className="text-xl font-bold tracking-tight text-gray-900">Top Unallocated Integrations</h3>
          <span id="topIntegrations" className="text-sm text-gray-500">
            {topIntegrationsArray.map((item, idx) => (
              <span key={idx}>
                {item}
                {idx < topIntegrationsArray.length - 1 && <br />}
              </span>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
