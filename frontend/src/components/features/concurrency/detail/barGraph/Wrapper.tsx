import { ConcurrencyDetailBarGraphContent } from './Content.tsx';
import { ConcurrencyDetailData } from '../types.ts';

type Props = {
  data: ConcurrencyDetailData | undefined;
};

export function ConcurrencyDetailBarGraphWrapper({ data }: Props) {
  return (
    <>
      {data && (
        <>
          <h3 className="text-lg font-bold text-slate-900">Concurrency Details Graph</h3>
          <p className="text-sm text-gray-500">Click the bar of the desired minute to view the incoming requests.</p>
          <div style={{ position: 'relative' }}>
            <ConcurrencyDetailBarGraphContent data={data} />
          </div>
        </>
      )}
    </>
  );
}
