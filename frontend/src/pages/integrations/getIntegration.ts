import { getIntegrations } from './getIntegrations';
import { Integration, assertIsIntegration } from './types';

export async function getIntegration(id: number): Promise<Integration> {
  let integration: Integration;
  if (window.location.href.includes('localhost')) {
    // get mock data for local development
    integration = {
      id: 1,
      name: 'Sample Integration',
      applicationId: 'ABCD12EF-456G-...',
      state: 'Enabled',
      dateCreated: '2024-12-06 13:02:03',
    };
  } else {
    const integrations = await getIntegrations({});
    const result = integrations.find((integration) => integration.id === id);
    if (!result) {
      throw new Error(`Integration with ID ${id} not found`);
    } else {
      integration = result;
    }
  }
  assertIsIntegration(integration);

  // build additional properties
  integration.urlNs = `/app/common/integration/integrapp.nl?id=${integration.id}`;
  integration.urlDetail = `#/integration/${integration.id}`;

  return integration;
}
