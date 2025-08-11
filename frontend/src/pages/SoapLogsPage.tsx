import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/shared/criteria/types.ts';
import { getSoapLog } from '../components/features/soapLog/getRecord.ts';
import { getSoapLogs } from '../components/features/soapLog/getRecords.ts';
import { RecordCriteria } from '../components/features/soapLog/RecordCriteria.tsx';
import { Results } from '../components/shared/results/Results.tsx';
import { ResultsTypes } from '../components/shared/results/types.ts';
import type { SoapLogs } from 'shared';

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
