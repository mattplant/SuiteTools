import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../../../shared/results/Export.tsx';
import { SummaryRow } from '../../../shared/results/types.ts';
import { ConcurrencySummaryData } from './types.ts';

type Props = {
  data: ConcurrencySummaryData | undefined;
};

export function ConcurrencySummaryViolations({ data }: Props) {
  console.log('ConcurrencySummaryOverview() initiated', { data });
  const gridRef = useRef<DataGridHandle>(null);
  const violations = useMemo(() => {
    if (!data) return [];
    const violationData = data.violations.series.violation;
    return Object.keys(violationData).map((key) => {
      return {
        key: Number(key),
        value: violationData[Number(key)],
      };
    });
  }, [data]);
  console.log('violations', violations);

  const summaryRows = useMemo((): readonly SummaryRow[] => {
    return [
      {
        id: 'total_0',
        totalCount: violations.length,
      },
    ];
  }, [violations]);

  if (!data) {
    return null;
  }

  const columns = [
    {
      key: 'key',
      name: 'Date',
      renderSummaryCell() {
        return <strong>Total</strong>;
      },
    },
    {
      key: 'value',
      name: 'Error Rate %',
      renderSummaryCell({ row }: { row: SummaryRow }) {
        return `${row.totalCount} records`;
      },
    },
  ];

  return (
    <>
      <h3 className="text-lg font-bold text-slate-900">Concurrency Violations</h3>
      <p className="text-sm text-gray-500">Below are the violations for the selected date range.</p>
      <p className="text-sm text-gray-500">Click on a row to view the violation details.</p>
      <Export gridRef={gridRef} />
      <div style={{ height: '600px', overflowY: 'auto' }}>
        <DataGrid
          ref={gridRef}
          columns={columns}
          rows={violations}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          bottomSummaryRows={summaryRows}
          // onCellClick={(cell) => {
          //   setId(cell.row.id);
          //   setOpenModal(true);
          // }}
          className="fill-grid"
        />
      </div>
    </>
  );
}
