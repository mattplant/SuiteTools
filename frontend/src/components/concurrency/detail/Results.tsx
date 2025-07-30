import { useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../../results/Export.tsx';
import { ConcurrencyDetailData, ConcurrencyDetailRows } from './types';
import { formatDate } from '../../../utils/dates';
import { useAppSettingsContext } from '../../../context/AppSettingsContext.tsx';

type Props = {
  data: ConcurrencyDetailData | undefined;
};

const columns = [
  { key: 'startTime', name: 'Start Time' },
  { key: 'endTime', name: 'End Time' },
  // { key: 'averageConcurrency', name: 'Average' },
  { key: 'peakConcurrency', name: 'Peak' },
  { key: 'peakConcurrencyTime', name: 'Peak Time' },
];

export function ConcurrencyDetailResults({ data }: Props) {
  const { settings } = useAppSettingsContext();
  const gridRef = useRef<DataGridHandle>(null);
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
          // averageConcurrency: result.averageConcurrency,
          peakConcurrency: result.peakConcurrency,
          peakConcurrencyTime: result.peakConcurrencyTime !== undefined ? String(result.peakConcurrencyTime) : '',
        };
        formattedResults.push(formattedResult);
      }
    }
  }

  return (
    <>
      <h3 className="text-lg font-bold text-slate-900">Concurrency Details Table</h3>
      <p className="text-sm text-gray-500">Click the row of the desired minute to view the incoming requests.</p>
      <Export gridRef={gridRef} />
      <div style={{ height: '600px', overflowY: 'auto' }}>
        <DataGrid
          ref={gridRef}
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
            const peakConcurrency = cell.row[`peakConcurrency`];
            let peakConcurrencyTime = String(cell.row[`peakConcurrencyTime`]);
            if (peakConcurrencyTime === 'undefined') {
              peakConcurrencyTime = '';
            } else {
              // convert date string (e.g. 2025-07-05 08:25:41) to a number
              peakConcurrencyTime = String(new Date(peakConcurrencyTime).getTime());
            }
            const link =
              settings?.appUrl +
              `#/concurrencyRequest/${startDate}/${endDate}/${peakConcurrency}/${peakConcurrencyTime}`;
            window.open(link, '_blank');
          }}
        />
      </div>
    </>
  );
}
