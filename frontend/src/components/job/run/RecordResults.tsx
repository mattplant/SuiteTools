import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../../results/Export.tsx';
import { ResultsProps, SummaryRow } from '../../results/types.ts';
import { assertIsJobRuns } from './types.ts';

const columns = [
  {
    key: 'id',
    name: 'Id',
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'jobname',
    name: 'Job Name',
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  {
    key: 'created',
    name: 'Created At',
  },
  {
    key: 'completed',
    name: 'Completed',
  },
  {
    key: 'results',
    name: 'Results',
  },
];

export function RecordsResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsJobRuns(rows);
  const gridRef = useRef<DataGridHandle>(null);
  const summaryRows = useMemo((): readonly SummaryRow[] => {
    return [
      {
        id: 'total_0',
        totalCount: rows.length,
      },
    ];
  }, [rows]);

  return (
    <>
      <Export gridRef={gridRef} />
      <DataGrid
        ref={gridRef}
        columns={columns}
        rows={rows}
        defaultColumnOptions={{
          sortable: true,
          resizable: true,
        }}
        bottomSummaryRows={summaryRows}
        onCellClick={(cell) => {
          setId(cell.row.id); //
          setOpenModal(true);
        }}
        className="fill-grid"
      />
    </>
  );
}
