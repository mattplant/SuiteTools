import { useMemo } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { ResultsProps, SummaryRow } from '../results/types.ts';
import { assertIsUsers } from './types.ts';

const columns = [
  {
    key: 'isinactive',
    name: 'Active',
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'name',
    name: 'Name',
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  { key: 'email', name: 'Email' },
  { key: 'role', name: 'Role' },
  { key: 'title', name: 'Title' },
  { key: 'supervisor', name: 'Supervisor' },
];

export function RecordsResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsUsers(rows);

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
      defaultColumnOptions={{
        sortable: true,
        resizable: true,
      }}
      bottomSummaryRows={summaryRows}
      onCellClick={(cell) => {
        setId(cell.row.id);
        setOpenModal(true);
      }}
    />
  );
}
