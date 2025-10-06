import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../../shared/criteria/types';
import { getSoapLog } from '../soapLog/getRecord';
import { getSoapLogs } from '../soapLog/getRecords';
import { SoapLogBundle } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import type { SoapLogs } from '@suiteworks/suitetools-shared';

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
