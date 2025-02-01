import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/concurrency/summary/types.ts';
import { getConcurrencySummary } from '../components/concurrency/summary/getRecords.ts';
import { RecordsCriteria } from '../components/concurrency/summary/RecordsCriteria.tsx';
import { ConcurrencySummaryData } from '../components/concurrency/summary/types.ts';
import { ConcurrencySummaryOverview } from '../components/concurrency/summary/Overview.tsx';
import { ConcurrencySummaryHeatMapWrapper } from '../components/concurrency/summary/heatMap/Wrapper.tsx';
import { ConcurrencySummaryPeak } from '../components/concurrency/summary/Peak.tsx';
import { ConcurrencySummaryAverage } from '../components/concurrency/summary/Average.tsx';
import { useAppSettingsContext } from '../components/AppSettingsContext.tsx';

export function ConcurrencySummaryPage() {
  const { settings } = useAppSettingsContext();
  const defaultCriteria: CriteriaFields = {
    dateRange: '1',
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
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ConcurrencySummaryOverview data={results} />
          <ConcurrencySummaryHeatMapWrapper data={results} />
          <ConcurrencySummaryPeak data={results} />
          <ConcurrencySummaryAverage data={results} />
        </>
      )}
    </div>
  );
}
