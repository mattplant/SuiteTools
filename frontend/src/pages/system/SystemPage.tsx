import { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
import { assertIsSystemData, assertIsData } from './types';
import { SystemShow } from './SystemShow';

export function SystemPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">NetSuite Info</h2>
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.system}>
          {(sytemValues) => {
            assertIsSystemData(sytemValues);
            return <SystemShow data={sytemValues} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
