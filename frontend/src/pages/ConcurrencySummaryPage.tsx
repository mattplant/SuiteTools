import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/features/concurrency/summary/types';
import { getConcurrencySummary } from '../components/features/concurrency/summary/getRecords';
import { RecordCriteria } from '../components/features/concurrency/summary/RecordCriteria';
import type { ConcurrencySummaryData } from '../components/features/concurrency/summary/types';
import { ConcurrencySummaryOverview } from '../components/features/concurrency/summary/Overview';
import { ConcurrencySummaryHeatMapWrapper } from '../components/features/concurrency/summary/heatMap/Wrapper';
import { ConcurrencySummaryViolations } from '../components/features/concurrency/summary/Violations';
// import { ConcurrencySummaryAverage } from '../components/concurrency/summary/Average';
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
  useEffect(() => {
    async function fetchData() {
      try {
        if (settings?.accountId) {
          setLoading(true);
          const data = await getConcurrencySummary(criteria, settings?.accountId);
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    }
    fetchData();

    return () => {};
  }, [criteria, settings?.accountId]);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Concurrency Summary</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ConcurrencySummaryOverview data={results} />
          <br />
          <ConcurrencySummaryHeatMapWrapper data={results} />
          <ConcurrencySummaryViolations data={results} />
          {/* <ConcurrencySummaryAverage data={results} /> */}
        </>
      )}
    </div>
  );
}
