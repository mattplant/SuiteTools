import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getScriptLog } from '../adapters/api/scriptLog';
import { getScriptLogs } from '../adapters/api/scriptLogs';
import type { ScriptLogs } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/scriptLog/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';
import { handleError, toArray } from '@suiteworks/suitetools-shared';

/**
 * ScriptLogsPage component displays the script logs list and criteria filter.
 * @returns The rendered ScriptLogsPage component.
 */
export function ScriptLogsPage(): React.ReactElement {
  const triggerError = useErrorBoundaryTrigger();

  const defaultCriteria: CriteriaFields = {
    rows: 50,
    levels: ['ERROR', 'EMERGENCY', 'SYSTEM'],
    // user: [''],
    scripttypes: [''],
    scriptnames: [''],
    owners: [''],
    timemode: 'now',
    createddate: '15', // default to last 15 minutes
    customdatetime: undefined, // will be set by SearchCriteriaAdvancedTimePicker
    customduration: '1', // default to 1 minute
    title: '',
    detail: '',
  };

  // if a script param was passed in, set the scriptname criteria
  const { script } = useParams();
  if (script) {
    defaultCriteria.scriptnames = [script]; // set the script to see logs for
    defaultCriteria.levels = ['']; // clear the level criteria
  }

  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<ScriptLogs>([]);

  useEffect(() => {
    let ignore = false;

    async function fetchData(): Promise<void> {
      try {
        const data = await getScriptLogs(criteria);
        const normalized = toArray<ScriptLogs[number]>(data);
        if (!ignore) {
          setResults(normalized);
        }
      } catch (err) {
        if (!ignore) {
          setResults([]); // fail safe: still give empty array
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
      <h2 className="text-xl font-bold text-slate-900 mb-2">Sever Script Logs</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.SCRIPTLOG} lines={results} getModalData={getScriptLog} />
    </div>
  );
}
