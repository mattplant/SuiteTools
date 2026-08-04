import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../../shared/criteria/types';
import { getSoapLog } from '../../../adapters/api/soapLog';
import { getSoapLogs } from '../../../adapters/api/soapLogs';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import type { SoapLogs } from '@suiteworks/suitetools-shared';
import { handleError } from '@suiteworks/suitetools-shared';
import { useErrorBoundaryTrigger } from '../../../hooks/useErrorBoundaryTrigger';

type Props = {
  integrations: string[];
};

export function IntegrationSoapLogs({ integrations }: Props) {
  const triggerError = useErrorBoundaryTrigger();
  const [results, setResults] = useState<SoapLogs>([]);

  useEffect(() => {
    let ignore = false;
    const criteria: CriteriaFields = {
      integrations,
    };

    async function fetchData() {
      try {
        const data = await getSoapLogs(criteria);
        if (!ignore) {
          setResults(data);
        }
      } catch (error) {
        if (!ignore) {
          setResults([]);
        }
        handleError(error, { reactTrigger: triggerError });
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [integrations, triggerError]);

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Soap Logs</h3>
      <Results type={ResultsTypes.SOAPLOG} lines={results} getModalData={getSoapLog} />
    </>
  );
}
