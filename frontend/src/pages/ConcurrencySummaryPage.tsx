import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/features/concurrency/summary/types';
import { getConcurrencySummary } from '../adapters/api/concurrencySummary';
import { RecordCriteria } from '../components/features/concurrency/summary/RecordCriteria';
import type { ConcurrencySummaryData } from '../components/features/concurrency/summary/types';
import { ConcurrencySummaryOverview } from '../components/features/concurrency/summary/Overview';
import { ConcurrencySummaryHeatMapWrapper } from '../components/features/concurrency/summary/heatMap/Wrapper';
import { ConcurrencySummaryViolations } from '../components/features/concurrency/summary/Violations';
import { useAppSettingsContext } from '../hooks/useAppSettingsContext';

export function ConcurrencySummaryPage() {
  const { settings } = useAppSettingsContext();
  const defaultCriteria: CriteriaFields = {
    startDate: new Date(),
    endDate: new Date(),
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<ConcurrencySummaryData>();
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      if (!settings?.accountId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setStatusMessage(null);
        const data = await getConcurrencySummary(criteria, settings.accountId);
        if (!ignore) {
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching concurrency summary:', error);
        if (!ignore) {
          setResults(undefined);
          setStatusMessage(
            error instanceof Error
              ? error.message
              : 'Failed to load concurrency summary from NetSuite APM.',
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [criteria, settings?.accountId]);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Concurrency Summary</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      {statusMessage ? <p className="mb-2 text-sm text-amber-700">{statusMessage}</p> : null}
      {loading ? (
        <p>Loading...</p>
      ) : results ? (
        <>
          <ConcurrencySummaryOverview data={results} />
          <br />
          <ConcurrencySummaryHeatMapWrapper data={results} />
          <ConcurrencySummaryViolations data={results} />
        </>
      ) : null}
    </div>
  );
}
