import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CriteriaFields } from '../components/features/concurrency/detail/types';
import { getConcurrencyDetail } from '../components/features/concurrency/detail/getRecords';
import type { ConcurrencyDetailData } from '../components/features/concurrency/detail/types';
import { ConcurrencyDetailOverview } from '../components/features/concurrency/detail/Overview';
import { ConcurrencyDetailBarGraphWrapper } from '../components/features/concurrency/detail/barGraph/Wrapper';
import { ConcurrencyDetailResults } from '../components/features/concurrency/detail/Results';
import { useAppSettingsContext } from '../hooks/useAppSettingsContext';

type Params = {
  startDate: string;
  endDate: string;
};

export function ConcurrencyDetailPage() {
  const params = useParams<Params>();
  const startDate = params.startDate;
  const endDate = params.endDate;
  console.log('ConcurrencyDetailPage inititated with params:', { startDate, endDate });
  if (!startDate || !endDate) {
    throw new Error('Missing required parameters');
  }

  const { settings } = useAppSettingsContext();
  const selectedCriteria: CriteriaFields = {
    startDate: startDate,
    endDate: endDate,
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(selectedCriteria);
  const [results, setResults] = useState<ConcurrencyDetailData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (settings?.accountId) {
          setLoading(true);
          setCriteria(criteria);
          const data = await getConcurrencyDetail(criteria, settings.accountId);
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
      <h2 className="text-xl font-bold text-slate-900">Concurrency Details</h2>
      <p className="text-sm text-gray-500">Below are the concurrency peaks for the selected hour.</p>
      <p className="text-sm text-gray-500">Drill in to see the incoming requests.</p>
      <br />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ConcurrencyDetailOverview data={results} />
          <br />
          <ConcurrencyDetailBarGraphWrapper data={results} />
          <br />
          <ConcurrencyDetailResults data={results} />
        </>
      )}
    </div>
  );
}
