import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { ScriptLogResult } from '../components/features/scriptLog/RecordResult';
import type { ScriptLogLoaderData } from '../routes/scriptLogLoader';

/**
 * Renders the script log page with script log details.
 * @returns The rendered script log page component.
 */
export function ScriptLogPage(): JSX.Element {
  const data = useLoaderData() as ScriptLogLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Script Log</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.scriptLog}>
          {(record) => {
            return <ScriptLogResult data={record} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
