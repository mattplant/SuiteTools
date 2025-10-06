import { getDataFromPageTable } from '../../../lib/netsuite/collectData';
import type { CriteriaFields } from '../../shared/criteria/types';
import { IntegrationBundle } from '@suiteworks/suitetools-shared';
import type { Integration, Integrations } from '@suiteworks/suitetools-shared';
import { Settings } from '../settings/types';

// Local helpers
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, '').trim();

function parseTable(rows: string[][]) {
  return rows.map((cols) => {
    const id = Number(cols[0]);
    const nameHtml = cols[1] ?? '';
    const applicationId = cols[2] ?? '';
    const state = cols[3] ?? '';
    const dateCreated = cols[4] ?? '';

    // extract href if present (optional)
    const hrefMatch = nameHtml.match(/href="([^"]+)"/);
    const urlNs = hrefMatch?.[1];

    // clean display name
    let name = stripHtml(nameHtml);
    // handle SuiteCloud rename
    if (name === 'SuiteCloud IDE & CLI') {
      name = 'SuiteCloud Development Integration';
    }

    return {
      id,
      name,
      applicationId,
      state,
      dateCreated,
      urlNs,
      urlDetail: `#/integration/${id}`,
    };
  });
}

export async function getIntegrations(fields: CriteriaFields): Promise<Integrations> {
  console.log('getIntegrations() initiated', { fields });
  const urlParams = {
    active: fields.active,
  };
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
    dataArray = dataArray.filter((cols) => cols[3] === 'Enabled');
  } else if (urlParams.active == 'F') {
    dataArray = dataArray.filter((cols) => cols[3] === 'Blocked');
  }
  const mapped = parseTable(dataArray);
  const integrations = IntegrationBundle.parseMany(mapped); // TODO: is this necessary? "as Integrations";

  return integrations;
}

export function addIntegrationLastLogins(
  integrations: readonly Integration[],
  settings: Settings | undefined,
): readonly Integration[] {
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
