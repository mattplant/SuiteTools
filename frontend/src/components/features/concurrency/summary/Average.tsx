import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { Column, RowCol } from '../types';
import { ConcurrencySummaryData } from './types';
import { initializeConcurrencySummaryColumns } from '../../../../utils/concurrency';

type Props = {
  data: ConcurrencySummaryData | undefined;
};

export function ConcurrencySummaryAverage({ data }: Props) {
  let columns: Column[] = [];
  const rows: RowCol[] = [];

  if (data) {
    const results = data.concurrency.results;
    if (results && results.length > 0) {
      columns = initializeConcurrencySummaryColumns(data.concurrency.xCategories);
      const url = '{{{scriptUrl}}}&action=apmConcurDetail';
      let rowCol: RowCol = {};
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const startDate = result.startTime;
        const endDate = result.endTime;
        const concurrency = result.averageConcurrency;
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
        rowCol['link' + String(colPosition)] = url + '&startDate=' + startDate + '&endDate=' + endDate;
      }
      // if last row is not full, add it
      if (rowCol && Object.keys(rowCol).length > 0) {
        rows.push(rowCol);
      }
    }
  }

  return (
    <>
      <h2 className="pt-5 pb-1 text-xl font-bold text-slate-900">Average Concurrency</h2>
      <p>Helps identify optimal integration schedules.</p>
      <DataGrid
        columns={columns}
        rows={rows}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        className="fill-grid"
      />
    </>
  );
}
