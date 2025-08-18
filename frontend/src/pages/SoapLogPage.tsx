import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { SoapLogBundle } from '@suiteworks/suitetools-shared';
import { SoapLogResult } from '../components/features/soapLog/RecordResult';

export function SoapLogPage() {
  const data = useLoaderData();
  SoapLogBundle.assert(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">SOAP Log</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data}>
          {(record) => {
            SoapLogBundle.assert(record);
            return (
              <>
                <SoapLogResult data={record} />
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
