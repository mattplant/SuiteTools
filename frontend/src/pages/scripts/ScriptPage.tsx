import { Suspense } from 'react';
// import { Await, useLoaderData, useParams } from 'react-router-dom';
import { Await, useLoaderData } from 'react-router-dom';
// import { assertIsScript } from './types';
import { ScriptResult } from './ScriptResult';

// type Params = {
//   id: string;
// };

export function ScriptPage() {
  // // TODO either use i or to load specific script data here or use the defer
  // const params = useParams<Params>();
  // const id = params.id === undefined ? undefined : parseInt(params.id);

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
