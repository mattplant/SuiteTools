import { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
// import { assertIsScript } from './types';
import { ScriptResult } from './ScriptResult';

export function ScriptPage() {
  const data = useLoaderData();
  // assertIsScript(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Script</h2>
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data}>
          {(scriptValues) => {
            console.log('scriptValues', scriptValues);
            // assertIsScript(scriptValues);
            return <ScriptResult data={scriptValues} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
