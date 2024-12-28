import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getSoapLog } from '../components/soapLog/getRecord.ts';
import { getSoapLogs } from '../components/soapLog/getRecords.ts';
import { SoapLog } from '../components/soapLog/types.ts';
import { RecordsCriteria } from '../components/soapLog/RecordsCriteria.tsx';
import { Results } from '../components/results/Results.tsx';
import { ResultsTypes } from '../components/results/types.ts';

export function SoapLogsPage() {
  const defaultCriteria: CriteriaFields = {
    integration: '',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<SoapLog[]>([]);

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
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.SOAPLOG} lines={results} getModalData={getSoapLog} />
    </div>
  );
}
