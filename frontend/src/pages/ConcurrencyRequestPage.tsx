import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CriteriaFields } from '../components/features/concurrency/request/types.ts';
import { getConcurrencyRequest } from '../components/features/concurrency/request/getRecords.ts';
import { ConcurrencyRequestData } from '../components/features/concurrency/request/types.ts';
import { ConcurrencyRequestResults } from '../components/features/concurrency/request/Results.tsx';
import { ConcurrencyRequestBarGraphWrapper } from '../components/features/concurrency/request/barGraph/Wrapper.tsx';
import { useAppSettingsContext } from '../components/shared/context/AppSettingsContext.tsx';
import { formatDate, formatMinuteSecond } from '../utils/date.ts';

type Params = {
  startDate: string;
  endDate: string;
  peakConcurrency: string;
  peakConcurrencyTime: string;
};

export function ConcurrencyRequestPage() {
  const params = useParams<Params>();
  const startDate = params.startDate;
  const endDate = params.endDate;
  const peakConcurrency = params.peakConcurrency;
  const peakConcurrencyTime = params.peakConcurrencyTime;
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
      <h2 className="text-xl font-bold text-slate-900">Concurrency Requests</h2>
      {results && (
        <>
          <p className="text-sm text-gray-500">
            Below are the concurrency requests that executed between {formatDate(Number(startDate))} to{' '}
            {formatDate(Number(endDate))}.
          </p>
          <p className="text-sm text-gray-500">
            {peakConcurrency && (
              <>
                The peak concurrency {peakConcurrencyTime && <> at {formatMinuteSecond(Number(peakConcurrencyTime))}</>}{' '}
                was {peakConcurrency}.
              </>
            )}
          </p>
          <p className="text-sm text-gray-500">
            This page includes requests that started before the selected timeframe and continued into this timeframe.
            This is useful to see long running requests that may not be visible in the Concurrency APM tool.
          </p>
          <br />
        </>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ConcurrencyRequestBarGraphWrapper data={results} />
          <br />
          <ConcurrencyRequestResults data={results} />
        </>
      )}
    </div>
  );
}
