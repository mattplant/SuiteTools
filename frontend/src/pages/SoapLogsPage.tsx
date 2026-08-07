// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from '../components/shared/criteria/types';
import { getSoapLog } from '../adapters/api/soapLog';
import { getSoapLogs } from '../adapters/api/soapLogs';
import type { SoapLogs } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/soapLog/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useEntityList } from '../hooks/useEntityList';

/**
 * SOAP Logs page — list SOAP web services process status rows.
 * @returns The rendered SOAP Logs page.
 */
export function SoapLogsPage(): React.ReactElement {
  const defaultCriteria: CriteriaFields = {
    integrations: [''],
  };

  const { setCriteria, results, statusMessage } = useEntityList<SoapLogs[number], CriteriaFields>({
    defaultCriteria,
    fetchList: getSoapLogs,
    getStatusMessage: (rows) =>
      rows.length === 0
        ? 'No SOAP web services jobs found for the last 90 days. Confirm jobs exist under Setup > Integration > SOAP Web Services Process Status.'
        : null,
  });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">SOAP Logs</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      {statusMessage ? <p className="mb-2 text-sm text-amber-700">{statusMessage}</p> : null}
      <Results type={ResultsTypes.SOAPLOG} lines={results} getModalData={getSoapLog} />
    </div>
  );
}
