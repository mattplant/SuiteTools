import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { ScriptBundle } from '@suiteworks/suitetools-shared';
import { ScriptResult } from '../components/features/script/RecordResult';

export function ScriptPage() {
  const data = useLoaderData();

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Script</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data}>
          {(record) => {
            ScriptBundle.assert(record);
            return <ScriptResult data={record} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
