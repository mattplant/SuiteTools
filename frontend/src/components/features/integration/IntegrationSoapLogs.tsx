// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from '../../shared/criteria/types';
import { getSoapLog } from '../../../adapters/api/soapLog';
import { getSoapLogs } from '../../../adapters/api/soapLogs';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import type { SoapLogs } from '@suiteworks/suitetools-shared';
import { useEntityList } from '../../../hooks/useEntityList';

type Props = {
  integrations: string[];
};

/**
 * Nested SOAP logs list for an integration detail page.
 * @param props - Component props.
 * @param props.integrations - Integration id filters.
 * @returns The rendered SOAP logs section.
 */
export function IntegrationSoapLogs({ integrations }: Props): React.ReactElement {
  // Parent may pass a fresh array each render — key off joined ids.
  const integrationsKey = integrations.join(',');
  const { results } = useEntityList<SoapLogs[number], CriteriaFields>({
    defaultCriteria: { integrations },
    fetchList: () => getSoapLogs({ integrations }),
    deps: [integrationsKey],
  });

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Soap Logs</h3>
      <Results type={ResultsTypes.SOAPLOG} lines={results} getModalData={getSoapLog} />
    </>
  );
}
