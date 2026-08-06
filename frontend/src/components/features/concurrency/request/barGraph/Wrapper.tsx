import { ConcurrencyRequestBarGraphContent } from './Content';
import type { ConcurrencyRequestData } from '../types';

type Props = {
  data: ConcurrencyRequestData | undefined;
};

export function ConcurrencyRequestBarGraphWrapper({ data }: Props) {
  return (
    <>
      {data && (
        <>
          <h3 className="text-lg font-bold text-slate-900">Concurrency Requests Graph</h3>
          <div style={{ position: 'relative' }}>
            <ConcurrencyRequestBarGraphContent data={data} />
          </div>
        </>
      )}
    </>
  );
}
