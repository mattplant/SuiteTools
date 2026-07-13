import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getSoapLog } from '../adapters/api/soapLog';
import { getSoapLogs } from '../adapters/api/soapLogs';
import type { SoapLogs } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/soapLog/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';

export function SoapLogsPage() {
  const defaultCriteria: CriteriaFields = {
    integrations: [''],
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<SoapLogs>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        setStatusMessage(null);
        const data = await getSoapLogs(criteria);
        if (!ignore) {
          setResults(data);
          if (data.length === 0) {
            setStatusMessage(
              'No SOAP web services jobs found for the last 90 days. Confirm jobs exist under Setup > Integration > SOAP Web Services Process Status.',
            );
          }
        }
      } catch (error) {
        console.error('Error fetching SOAP logs:', error);
        if (!ignore) {
          setResults([]);
          setStatusMessage(error instanceof Error ? error.message : String(error));
        }
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">SOAP Logs</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      {statusMessage ? <p className="mb-2 text-sm text-amber-700">{statusMessage}</p> : null}
      <Results type={ResultsTypes.SOAPLOG} lines={results} getModalData={getSoapLog} />
    </div>
  );
}
