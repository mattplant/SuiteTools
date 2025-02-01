import { ConcurrencySummaryHeatMapContent } from './Content.tsx';
import { ConcurrencySummaryData } from '../types.ts';

type Props = {
  data: ConcurrencySummaryData | undefined;
};

export function ConcurrencySummaryHeatMapWrapper({ data }: Props) {
  return (
    <>
      {data && (
        <>
          <br />
          <h3 className="text-lg font-bold text-slate-900">Estimated Concurrency Rates (%)</h3>
          <p>
            For more accurate data, view the Concurrency Details pages. The darker shade of blue, the highest percentage
            of concurrent users for that hour. Red indicates that there were concurrency request errors. Note that
            NetSuite rounds up in 25% increments.
          </p>
          <div style={{ position: 'relative' }}>
            <ConcurrencySummaryHeatMapContent data={data} />
          </div>
        </>
      )}
    </>
  );
}
