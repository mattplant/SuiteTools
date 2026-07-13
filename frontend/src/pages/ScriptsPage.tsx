import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getScriptModalData } from '../adapters/api/script';
import { getScripts } from '../adapters/api/scripts';
import type { Scripts } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/script/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';
import { handleError, toArray } from '@suiteworks/suitetools-shared';

/**
 * ScriptsPage component displays the scripts list and criteria filter.
 * @returns The rendered ScriptsPage component.
 */
export function ScriptsPage(): React.ReactElement {
  const triggerError = useErrorBoundaryTrigger();

  const defaultCriteria: CriteriaFields = {
    active: '',
    files: [''],
    owners: [''],
    scripttypes: [''],
    scriptnames: [''],
    versions: [''],
  };

  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Scripts>([]);

  useEffect(() => {
    let ignore = false;

    async function fetchData(): Promise<void> {
      try {
        const data = await getScripts(criteria);
        const normalized = toArray<Scripts[number]>(data);
        if (!ignore) {
          setResults(normalized);
        }
      } catch (err) {
        if (!ignore) {
          setResults([]);
        }
        handleError(err, { reactTrigger: triggerError });
      }
    }

    fetchData();
    return (): void => {
      ignore = true;
    };
  }, [criteria, triggerError]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Scripts</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.SCRIPT} lines={results} getModalData={getScriptModalData} />
    </div>
  );
}
