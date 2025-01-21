import { useMemo } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { ResultsProps, SummaryRow } from '../results/types.ts';
import { assertIsUsers } from './types.ts';

const columns = [
  {
    key: 'id',
    name: 'ID',
    width: 100,
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'isinactive',
    name: 'Active',
    width: 25,
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  {
    key: 'name',
    name: 'Name',
  },
  { key: 'email', name: 'Email' },
  { key: 'supervisor', name: 'Supervisor' },
  { key: 'title', name: 'Title' },
  { key: 'lastLogin', name: 'Last Login' },
  { key: 'role_names', name: 'Role(s)' },
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
      className="fill-grid"
    />
  );
}
