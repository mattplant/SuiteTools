import { useMemo } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
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

export function RecordsResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsSoapLogs(rows);

  const summaryRows = useMemo((): readonly SummaryRow[] => {
    return [
      {
        id: 'total_0',
        totalCount: rows.length,
      },
    ];
  }, [rows]);

  return (
    <DataGrid
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
  );
}
