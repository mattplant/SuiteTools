import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsToken, Token } from '../components/token/types';
import { TokenResult } from '../components/token/RecordResult';

export function TokenPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Token</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.token}>
          {(record) => {
            assertIsToken(record);
            return <TokenResult data={record} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  token: Token;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('token' in data)) {
    throw new Error('Data does not contain token');
  }
}
