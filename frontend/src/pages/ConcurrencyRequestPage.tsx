import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CriteriaFields } from '../components/concurrency/request/types.ts';
import { getConcurrencyRequest } from '../components/concurrency/request/getRecords.ts';
import { ConcurrencyRequestData } from '../components/concurrency/request/types.ts';
import { ConcurrencyRequestResults } from '../components/concurrency/request/Results.tsx';
import { useAppSettingsContext } from '../components/AppSettingsContext.tsx';

type Params = {
  startDate: string;
  endDate: string;
};

export function ConcurrencyRequestPage() {
  const params = useParams<Params>();
  const startDate = params.startDate;
  const endDate = params.endDate;
  console.log('ConcurrencyRequestPage inititated with params:', { startDate, endDate });
  if (!startDate || !endDate) {
    throw new Error('Missing required parameters');
  }

  const { settings } = useAppSettingsContext();
  const selectedCriteria: CriteriaFields = {
    startDate: startDate,
    endDate: endDate,
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(selectedCriteria);
  const [results, setResults] = useState<ConcurrencyRequestData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (settings?.accountId) {
          setLoading(true);
          setCriteria(criteria);
          const data = await getConcurrencyRequest(criteria, settings.accountId);
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
      <h2 className="text-xl font-bold text-slate-900">Concurrency Request</h2>
      {loading ? <p>Loading...</p> : <ConcurrencyRequestResults data={results} />}
    </div>
  );
}
