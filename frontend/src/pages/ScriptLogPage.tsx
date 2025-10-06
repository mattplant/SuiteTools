import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { ScriptLogBundle } from '@suiteworks/suitetools-shared';

import { ScriptLogResult } from '../components/features/scriptLog/RecordResult';

export function ScriptLogPage() {
  const data = useLoaderData();

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Script Log</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data}>
          {(record) => {
            ScriptLogBundle.assert(record);
            return <ScriptLogResult data={record} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
