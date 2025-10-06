import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { TokenBundle } from '@suiteworks/suitetools-shared';
import { TokenResult } from '../components/features/token/RecordResult';

export function TokenPage() {
  const data = useLoaderData();

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Token</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data}>
          {(record) => {
            TokenBundle.assert(record);
            return <TokenResult data={record} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
