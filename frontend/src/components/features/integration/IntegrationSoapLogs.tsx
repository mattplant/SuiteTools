import { useEffect, useState } from 'react';
import { CriteriaFields } from '../../shared/criteria/types.ts';
import { getSoapLog } from '../soapLog/getRecord.ts';
import { getSoapLogs } from '../soapLog/getRecords.ts';
import { SoapLog } from 'shared';
import { Results } from '../../shared/results/Results.tsx';
import { ResultsTypes } from '../../shared/results/types.ts';

type Props = {
  integrations: string[];
};

export function IntegrationSoapLogs({ integrations }: Props) {
  const [results, setResults] = useState<SoapLog[]>([]);

  useEffect(() => {
    const criteria: CriteriaFields = {
      active: 'T',
      integrations: integrations,
    };
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
  }, [integrations]);

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Soap Logs</h3>
      <Results type={ResultsTypes.SOAPLOG} lines={results} getModalData={getSoapLog} />
    </>
  );
}
