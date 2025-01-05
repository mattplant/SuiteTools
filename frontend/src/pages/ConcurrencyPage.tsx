import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/concurrency/types';
import { getConcurrencySummary } from '../components/concurrency/getConcurrencySummary.ts';
import { RecordsCriteria } from '../components/concurrency/RecordsCriteria.tsx';
import { ConcurrencySummaryData } from '../components/concurrency/types';
import { ConcurrencyOverview } from '../components/concurrency/Overview.tsx';
import { ConcurrencyHeatMap } from '../components/concurrency/HeatMap.tsx';
import { ConcurrencyPeak } from '../components/concurrency/Peak.tsx';
import { ConcurrencyAverage } from '../components/concurrency/Average.tsx';
import { useAppSettingsContext } from '../components/AppSettingsContext';

export function ConcurrencyPage() {
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

  console.log('ConcurrencyPage() results', results);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Concurrency Summary</h2>
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ConcurrencyOverview data={results} />
          <ConcurrencyHeatMap data={results} />
          <ConcurrencyPeak data={results} />
          <ConcurrencyAverage data={results} />
        </>
      )}
    </div>
  );
}
