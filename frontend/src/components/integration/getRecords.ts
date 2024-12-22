import { getDataFromPageTable } from '../../utils/collectData';
import { Integration } from './types';
import { CriteriaFields } from '../criteria/types';

export async function getIntegrations(fields: CriteriaFields): Promise<Integration[]> {
  console.log('getIntegrations() initiated', { fields });
  const urlParams = {
    active: fields.active,
  };
  const data: Integration[] = [];
  let dataArray: string[][] = [];
  if (window.location.href.includes('localhost')) {
    // mock data for local development
    dataArray = [
      ['1', 'Application 1', 'ABCD12EF-456G-...', 'Enabled', '2024-12-06 13:02:03'],
      ['2', 'Application 2', 'ABCDE12F-456G-...', 'Enabled', '2024-12-11 12:13:14'],
    ];
  } else {
    // get data from NetSuite page
    dataArray = await getDataFromPageTable('/app/common/integration/integrapplist.nl?showall=T', 'div__body', true);
  }
  // filter data based on active status
  if (urlParams.active == 'T') {
    dataArray = dataArray.filter((integration) => integration[3] === 'Enabled');
  } else if (urlParams.active == 'F') {
    dataArray = dataArray.filter((integration) => integration[3] === 'Blocked');
  }
  // convert array to Integration objects
  dataArray.map((integration) => {
    data.push({
      id: Number(integration[0]),
      name: integration[1],
      applicationId: integration[2],
      state: integration[3],
      dateCreated: integration[4],
    });
  });

  return data;
}
