import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsIntegration, Integration } from '../components/integration/types';
import { IntegrationResult } from '../components/integration/RecordResult';
import { IntegrationSoapLogs } from '../components/integration/IntegrationSoapLogs';
import { IntegrationTokens } from '../components/integration/IntegrationTokens';

export function IntegrationPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Integration</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.integration}>
          {(record) => {
            assertIsIntegration(record);
            return (
              <>
                <IntegrationResult data={record} />
                <IntegrationTokens integrationName={record.name} />
                <br />
                <h2 className="text-xl font-bold text-slate-900">Execution Logs</h2>
                <IntegrationSoapLogs integrations={[String(record.id)]} />
              </>
            );
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
