import { getPageTableContent } from '../../utils/getPageTableContent';
import { Integration, assertIsIntegrations } from './types';
import { CriteriaFields } from '../../components/search/criteria/types';

export async function getIntegrations(fields: CriteriaFields): Promise<Integration[]> {
  // TODO remove next temporary line
  console.log('getIntegrations', fields);

  let integrations: Integration[] = [];
  if (window.location.href.includes('localhost')) {
    // mock data for local development
    integrations = [
      {
        id: 1,
        name: 'Sample Integration',
        applicationId: 'ABCD12EF-456G-...',
        state: 'Enabled',
        dateCreated: '2024-12-06 13:02:03',
      },
    ];
  } else {
    // get integrations from NetSuite page
    const integrationsTable = await getPageTableContent('/app/common/integration/integrapplist.nl', 'div__body');
    console.log('integrationsTable =', integrationsTable);
    // verify integrationsTable is an array
    if (!Array.isArray(integrationsTable)) {
      throw new Error('Integrations data is not an array');
    }
    // remove the header first row
    const header = integrationsTable.shift();
    console.log('header =', header);
    // map columns to Integration fields
    integrationsTable.map((integration) => {
      integrations.push({
        id: Number(integration[0]),
        name: integration[1],
        applicationId: integration[2],
        state: integration[3],
        dateCreated: integration[4],
      });
    });
  }
  console.log('integrations = ', integrations);
  assertIsIntegrations(integrations);

  return integrations;
}
