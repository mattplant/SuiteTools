import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { Integration } from './types';
import { assertIsIntegration } from './types';
import { IntegrationResult } from './IntegrationResult';

export function IntegrationPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Integration</h2>
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.integration}>
          {(integration) => {
            assertIsIntegration(integration);
            return <IntegrationResult data={integration} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  integration: Integration;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('integration' in data)) {
    throw new Error('Data does not contain integration');
  }
}
