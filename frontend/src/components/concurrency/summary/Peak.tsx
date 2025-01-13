import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { Column, RowCol } from '../types';
import { ConcurrencySummaryData } from './types';
import { initializeConcurrencySummaryColumns } from '../../../utils/concurrency';
import { useAppSettingsContext } from '../../../components/AppSettingsContext.tsx';

type Props = {
  data: ConcurrencySummaryData | undefined;
};

export function ConcurrencySummaryPeak({ data }: Props) {
  const { settings } = useAppSettingsContext();

  let columns: Column[] = [];
  const rows: RowCol[] = [];

  if (data) {
    const results = data.concurrency.results;
    if (results && results.length > 0) {
      columns = initializeConcurrencySummaryColumns(data.concurrency.xCategories);
      let rowCol: RowCol = {};
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const startDate = result.startTime;
        const endDate = result.endTime;
        const concurrency = result.peakConcurrency;
        // create new row every 24 columns
        const colPosition = i % 24;
        if (colPosition == 0) {
          if (i > 0) {
            rows.push(rowCol);
            rowCol = {};
          }
          rowCol['date'] = new Date(startDate).toLocaleDateString();
        }
        rowCol[String(colPosition)] = String(concurrency);
        rowCol['startDate' + String(colPosition)] = String(startDate);
        rowCol['endDate' + String(colPosition)] = String(endDate);
      }
      // if last row is not full, add it
      if (rowCol && Object.keys(rowCol).length > 0) {
        rows.push(rowCol);
      }
    }
  }

  return (
    <>
      <h2 className="pt-5 pb-1 text-xl font-bold text-slate-900">Peak Concurrency</h2>
      <p>
        Click on the desired cell to view the concurrency details. From there you can further drill in to see all the
        incoming requests for each minute. Where applicable, you can further drill into a particular request and see the
        execution logs for the script during the request duration.
      </p>
      <DataGrid
        columns={columns}
        rows={rows}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        className="fill-grid"
        onCellClick={(cell) => {
          const startDate = cell.row[`startDate${cell.column.key}`];
          const endDate = cell.row[`endDate${cell.column.key}`];
          const link = settings?.appUrl + `#/concurrencyDetail/${startDate}/${endDate}`;
          window.open(link, '_blank');
        }}
      />
    </>
  );
}
