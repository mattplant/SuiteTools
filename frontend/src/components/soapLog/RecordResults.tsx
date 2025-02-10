import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../results/Export.tsx';
import { ResultsProps, SummaryRow } from '../results/types.ts';
import { assertIsSoapLogs } from './types.ts';

const columns = [
  {
    key: 'startDate',
    name: 'Start Time',
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'duration',
    name: 'Duration',
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  { key: 'status', name: 'Status' },
  { key: 'integration', name: 'Integration' },
  { key: 'action', name: 'Action' },
  { key: 'recordType', name: 'Record Type' },
  { key: 'user', name: 'User' },
  { key: 'records', name: 'Records' },
  { key: 'recordsFinished', name: 'Finished' },
  { key: 'recordsFailed', name: 'Failed' },
  { key: 'recordsReturned', name: 'Returned' },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsSoapLogs(rows);
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
      <div style={{ height: '600px', overflowY: 'auto' }}>
        <DataGrid
          ref={gridRef}
          columns={columns}
          rows={rows}
          bottomSummaryRows={summaryRows}
          onCellClick={(cell) => {
            setId(cell.row.id);
            setOpenModal(true);
          }}
          defaultColumnOptions={{
            minWidth: 110,
          }}
          className="fill-grid"
        />
      </div>
    </>
  );
}
