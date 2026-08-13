import { useLoaderData } from 'react-router-dom';
import { IntegrationResult } from '../components/features/integration/RecordResult';
import { IntegrationSoapLogs } from '../components/features/integration/IntegrationSoapLogs';
import { IntegrationTokens } from '../components/features/integration/IntegrationTokens';
import type { IntegrationLoaderData } from '../routes/integrationLoader';

/**
 * Renders the integration detail page.
 * @returns The rendered integration page component.
 */
export function IntegrationPage(): React.JSX.Element {
  const { integration } = useLoaderData() as IntegrationLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Integration</h2>
      <br />
      <IntegrationResult data={integration} />
      <IntegrationTokens integrationName={integration.name} />
      <br />
      <h2 className="text-xl font-bold text-slate-900">Execution Logs</h2>
      <IntegrationSoapLogs integrations={[String(integration.id)]} />
    </div>
  );
}
