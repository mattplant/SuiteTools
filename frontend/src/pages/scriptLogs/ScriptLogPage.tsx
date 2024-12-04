import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { ScriptLog } from './types';
import { assertIsScriptLog } from './types';
import { ScriptLogResult } from './ScriptLogResult';

export function ScriptLogPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Script Log</h2>
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.scriptLog}>
          {(scriptLog) => {
            assertIsScriptLog(scriptLog);
            return <ScriptLogResult data={scriptLog} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  scriptLog: ScriptLog;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('scriptLog' in data)) {
    throw new Error('Data does not contain scriptLog');
  }
}
