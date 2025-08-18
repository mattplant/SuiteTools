import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getSoapLog } from '../components/features/soapLog/getRecord';
import { getSoapLogs } from '../components/features/soapLog/getRecords';
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

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getSoapLogs(criteria);
        setResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    return () => {};
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">SOAP Logs</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.SOAPLOG} lines={results} getModalData={getSoapLog} />
    </div>
  );
}
