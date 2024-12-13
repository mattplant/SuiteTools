import { useMemo } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { ResultsProps, SummaryRow } from '../results/types.ts';
import { assertIsTokens } from './types.ts';

const columns = [
  {
    key: 'id',
    name: 'ID',
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
  { key: 'user', name: 'User' },
  { key: 'role', name: 'Role' },
  { key: 'application', name: 'Application' },
  { key: 'state', name: 'State' },
  { key: 'dateCreated', name: 'Date Created' },
  { key: 'createdBy', name: 'Created By' },
];

export function RecordsResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsTokens(rows);

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
