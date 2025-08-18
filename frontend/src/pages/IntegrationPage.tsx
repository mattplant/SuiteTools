import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { IntegrationBundle } from '@suiteworks/suitetools-shared';
import { IntegrationResult } from '../components/features/integration/RecordResult';
import { IntegrationSoapLogs } from '../components/features/integration/IntegrationSoapLogs';
import { IntegrationTokens } from '../components/features/integration/IntegrationTokens';

export function IntegrationPage() {
  const data = useLoaderData();

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Integration</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data}>
          {(record) => {
            IntegrationBundle.assert(record);
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
