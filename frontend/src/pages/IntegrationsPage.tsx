import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getIntegrationModalData } from '../adapters/api/integration';
import { getIntegrations, addIntegrationLastLogins } from '../adapters/api/integrations';
import type { Integrations } from '@suiteworks/suitetools-shared';
import { handleError, toArray } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/integration/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useAppSettingsContext } from '../hooks/useAppSettingsContext';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';

export function IntegrationsPage() {
  const triggerError = useErrorBoundaryTrigger();
  const { settings } = useAppSettingsContext();
  const defaultCriteria: CriteriaFields = {
    active: '',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Integrations>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        setStatusMessage(null);
        const data = await getIntegrations(criteria);
        const withLogins = addIntegrationLastLogins(data, settings);
        if (!ignore) {
          const rows = toArray(withLogins);
          setResults(rows);
          if (rows.length === 0) {
            setStatusMessage('No integrations matched the current filter. Try State = All.');
          } else if (rows.some((row) => !row.dateCreated)) {
            setStatusMessage('Date Created could not be read for some integrations from the NetSuite list page.');
          }
        }
      } catch (error) {
        if (!ignore) {
          setResults([]);
          setStatusMessage(null);
        }
        handleError(error, { reactTrigger: triggerError });
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [criteria, settings, triggerError]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Integrations</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      {statusMessage ? <p className="mb-2 text-sm text-amber-700">{statusMessage}</p> : null}
      <Results type={ResultsTypes.INTEGRATION} lines={results} getModalData={getIntegrationModalData} />
    </div>
  );
}
