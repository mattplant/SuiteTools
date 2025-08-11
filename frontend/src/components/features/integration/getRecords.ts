import { getDataFromPageTable } from '../../../lib/netsuite/collectData.ts';
import { Integration } from 'shared';
import { CriteriaFields } from '../../shared/criteria/types.ts';
import { Settings } from '../settings/types.ts';

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
      [
        '1',
        '<a href="/app/common/integration/integrapp.nl?id=1" target="_self">Application 1</a>',
        'ABCD12EF-456G-...',
        'Enabled',
        '2024-12-06 13:02:03',
      ],
      [
        '2',
        '<a href="/app/common/integration/integrapp.nl?id=2" target="_self">Application 2</a>',
        'ABCDE12F-456G-...',
        'Enabled',
        '2024-12-11 12:13:14',
      ],
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
    // TODO if integrationName = 'SuiteCloud IDE & CLI' then set integrationName = 'SuiteCloud Development Integration'

    data.push({
      id: Number(integration[0]),
      name: integration[1].replace(/<[^>]*>?/gm, '').trim(),
      applicationId: integration[2],
      state: integration[3],
      dateCreated: integration[4],
    });
  });

  return data;
}

export function addIntegrationLastLogins(integrations: Integration[], settings: Settings | undefined): Integration[] {
  if (
    settings &&
    settings.lastLogins &&
    settings.lastLogins.data &&
    Array.isArray(settings.lastLogins.data) &&
    settings.lastLogins.data.length > 0
  ) {
    const lastLoginsObj = settings.lastLogins.data;
    const lastLogins = lastLoginsObj.filter((lastLogin) => lastLogin.name.type === 'integration');
    integrations.forEach((integration) => {
      // add the last login data to the integration record if found
      const lastLogin = lastLogins.find((lastLogin) => lastLogin.name.name === integration.name);
      if (lastLogin) {
        integration.lastLogin = lastLogin.lastLogin;
      }
    });
  }

  return integrations;
}
