import { useMemo } from 'react';
import 'react-data-grid/lib/styles.css';
import DataGrid from 'react-data-grid';
import { ResultsProps, SummaryRow } from '../results/types.ts';
import { assertIsLogins } from './types.ts';

const columns = [
  {
    key: 'date',
    name: 'Date',
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'status',
    name: 'status',
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  { key: 'oauthappname', name: 'OAuth Application' },
  { key: 'oauthaccesstokenname', name: 'OAuth Access Token' },
  { key: 'username', name: 'User' },
  { key: 'rolename', name: 'Role' },
];

export function RecordsResults({ rows, setId, setOpenModal }: ResultsProps) {
  console.log('RecordsResults() initiated with', { rows, setId, setOpenModal });
  assertIsLogins(rows);

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
