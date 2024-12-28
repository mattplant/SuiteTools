import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsScript, Script } from '../components/script/types';
import { ScriptResult } from '../components/script/RecordResult';

export function ScriptPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Script</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.script}>
          {(script) => {
            assertIsScript(script);
            return <ScriptResult data={script} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  script: Script;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('script' in data)) {
    throw new Error('Data does not contain script');
  }
}
