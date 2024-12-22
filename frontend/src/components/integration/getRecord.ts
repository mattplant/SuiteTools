import { getIntegrations } from './getRecords';
import { NotFound } from '../../api/types';
import { Integration } from './types';

export async function getIntegration(id: number): Promise<Integration | NotFound> {
  console.log('getIntegration() initiated', { id });
  let result;
  if (window.location.href.includes('localhost')) {
    // mock data for local development
    result = {
      id: 1,
      name: 'Sample Integration',
      applicationId: 'ABCD12EF-456G-...',
      state: 'Enabled',
      dateCreated: '2024-12-06 13:02:03',
    };
  } else {
    if (!id) {
      result = { message: 'Skipping loading integration since id is 0' };
    } else {
      console.log('getIntegration() loading integration from NetSuite page', { id });
      const records = await getIntegrations({});
      result = records.find((record) => record.id === id);
      if (!result) {
        throw new Error(`Integration with ID ${id} not found`);
      } else {
        // build additional properties
        result.urlNs = `/app/common/integration/integrapp.nl?id=${result.id}`;
        result.urlDetail = `#/integration/${result.id}`;
      }
    }
  }

  return result;
}
