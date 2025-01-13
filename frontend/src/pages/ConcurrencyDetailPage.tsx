import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CriteriaFields } from '../components/concurrency/detail/types.ts';
import { getConcurrencyDetail } from '../components/concurrency/detail/getRecords.ts';
import { ConcurrencyDetailData } from '../components/concurrency/detail/types.ts';
import { ConcurrencyDetailOverview } from '../components/concurrency/detail/Overview.tsx';
import { ConcurrencyDetailResults } from '../components/concurrency/detail/Results.tsx';
import { useAppSettingsContext } from '../components/AppSettingsContext.tsx';

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
      <h2 className="text-xl font-bold text-slate-900">Concurrency Detail</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ConcurrencyDetailOverview data={results} />
          <ConcurrencyDetailResults data={results} />
        </>
      )}
    </div>
  );
}
