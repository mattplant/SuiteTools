import { useEffect, useState } from 'react';
import { CriteriaFields } from '../../shared/criteria/types.ts';
import { getSoapLog } from '../soapLog/getRecord.ts';
import { getSoapLogs } from '../soapLog/getRecords.ts';
import { SoapLogBundle } from 'shared';
import { Results } from '../../shared/results/Results.tsx';
import { ResultsTypes } from '../../shared/results/types.ts';
import type { SoapLogs } from 'shared';

type Props = {
  integrations: string[];
};

export function IntegrationSoapLogs({ integrations }: Props) {
  const [results, setResults] = useState<SoapLogs>([]);

  useEffect(() => {
    const criteria: CriteriaFields = {
      active: 'T',
      integrations: integrations,
    };
    async function fetchData() {
      try {
        const data = await getSoapLogs(criteria);
        SoapLogBundle.assertMany(data);
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
