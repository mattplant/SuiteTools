import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { ConcurrencyDetailData, ConcurrencyDetailRows } from './types';
import { formatDate } from '../../../utils/dates';
import { useAppSettingsContext } from '../../../components/AppSettingsContext.tsx';

type Props = {
  data: ConcurrencyDetailData | undefined;
};

const columns = [
  { key: 'startTime', name: 'Start Time' },
  { key: 'endTime', name: 'End Time' },
  { key: 'averageConcurrency', name: 'Average' },
  { key: 'peakConcurrency', name: 'Peak' },
  { key: 'peakConcurrencyTime', name: 'Peak Time' },
];

export function ConcurrencyDetailResults({ data }: Props) {
  console.log('ConcurrencyDetailPeak() initiated', { data });
  const { settings } = useAppSettingsContext();

  const formattedResults: ConcurrencyDetailRows[] = [];
  if (data) {
    const results = data.concurrency.results;
    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const formattedResult = {
          startTimeMS: result.startTime,
          startTime: formatDate(result.startTime),
          endTimeMS: result.endTime,
          endTime: formatDate(result.endTime),
          averageConcurrency: result.averageConcurrency,
          peakConcurrency: result.peakConcurrency,
          peakConcurrencyTime: result.peakConcurrencyTime,
        };
        formattedResults.push(formattedResult);
      }
    }
  }

  return (
    <>
      <h2 className="pt-5 pb-1 text-xl font-bold text-slate-900">Detail Table</h2>
      <DataGrid
        columns={columns}
        rows={formattedResults}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        className="fill-grid"
        onCellClick={(cell) => {
          console.log(cell);
          const startDate = cell.row[`startTimeMS`];
          const endDate = cell.row[`endTimeMS`];
          const link = settings?.appUrl + `#/concurrencyRequest/${startDate}/${endDate}`;
          window.open(link, '_blank');
        }}
      />
    </>
  );
}
