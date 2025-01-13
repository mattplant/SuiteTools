import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { Column, RowCol } from '../types';
import { ConcurrencySummaryData } from './types';
import { initializeConcurrencySummaryColumns } from '../../../utils/concurrency';

type Props = {
  data: ConcurrencySummaryData | undefined;
};

export function ConcurrencySummaryHeatMap({ data }: Props) {
  let columns: Column[] = [];
  const rows: RowCol[] = [];

  if (data) {
    const peaks = data.concurrency.series.peak;

    // TODO violations
    // const violations = data.violations; // need to get to data

    // BUILD HEATMAP TABLE
    if (peaks && peaks.length > 0) {
      columns = initializeConcurrencySummaryColumns(data.concurrency.xCategories);
      // build rowws
      let rowCol: RowCol = {};
      for (let i = 0; i < peaks.length; i++) {
        const peak = peaks[i];
        const startDate = peak[3];
        const percentage = peak[2];

        // TODO if startDate is in violations, then signify that
        // if (violations[startDate]) {
        //   percentage = -percentage;
        // }

        // create new row every 24 columns
        const colPosition = i % 24;
        if (colPosition == 0) {
          if (i > 0) {
            rows.push(rowCol);
            rowCol = {};
          }
          rowCol['date'] = new Date(startDate).toLocaleDateString();
        }
        rowCol[String(colPosition)] = String(percentage);
      }
      // if last row is not full, add it
      if (rowCol && Object.keys(rowCol).length > 0) {
        rows.push(rowCol);
      }
    }
  }
  return (
    <>
      <h2 className="pt-5 pb-1 text-xl font-bold text-slate-900">Heat Map</h2>
      <p>
        The darker shade of blue, the highest percentage of concurrent users for that hour. Red indicates that there
        were concurrency request errors. Note that NetSuite rounds up in 25% increments.
      </p>
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
