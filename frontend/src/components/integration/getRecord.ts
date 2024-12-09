import { getIntegrations } from './getRecords';
import { Integration, assertIsIntegration } from './types';

export async function getIntegration(id: number): Promise<Integration> {
  let record: Integration;
  if (window.location.href.includes('localhost')) {
    // get mock data for local development
    record = {
      id: 1,
      name: 'Sample Integration',
      applicationId: 'ABCD12EF-456G-...',
      state: 'Enabled',
      dateCreated: '2024-12-06 13:02:03',
    };
  } else {
    const records = await getIntegrations({});
    const result = records.find((record) => record.id === id);
    if (!result) {
      throw new Error(`Integration with ID ${id} not found`);
    } else {
      record = result;
    }
  }
  assertIsIntegration(record);

  // build additional properties
  record.urlNs = `/app/common/integration/integrapp.nl?id=${record.id}`;
  record.urlDetail = `#/integration/${record.id}`;

  return record;
}
