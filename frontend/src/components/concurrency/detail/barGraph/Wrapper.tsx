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
          <br />
          <h3 className="text-lg font-bold text-slate-900">Estimated Concurrency Details</h3>
          <p>Click the desired minute to view the incoming requests for each minute.</p>
          <br />
          <p>
            Where applicable, you can further drill into a particular request and see the execution logs for the script
            during the request duration.
          </p>
          <div style={{ position: 'relative' }}>
            <ConcurrencyDetailBarGraphContent data={data} />
          </div>
        </>
      )}
    </>
  );
}
