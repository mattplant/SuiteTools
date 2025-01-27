import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../results/Export.tsx';
import { ResultsProps, SummaryRow } from '../results/types.ts';
import { assertIsFiles } from './types.ts';

const columns = [
  {
    key: 'id',
    name: 'ID',
    renderSummaryCell() {
      return <strong>Total</strong>;
    },
  },
  {
    key: 'folder',
    name: 'Folder',
    renderSummaryCell({ row }: { row: SummaryRow }) {
      return `${row.totalCount} records`;
    },
  },
  { key: 'createddate', name: 'Created Date' },
  { key: 'lastmodifieddate', name: 'Last Modified Date' },
  { key: 'filetypename', name: 'Type' },
  { key: 'name', name: 'Name' },
  { key: 'filesize', name: 'File Size' },
  { key: 'description', name: 'Description' },
  { key: 'url', name: 'URL' },
];

export function RecordsResults({ rows, setId, setOpenModal }: ResultsProps) {
  assertIsFiles(rows);
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
          setId(cell.row.id);
          setOpenModal(true);
        }}
        className="fill-grid"
      />
    </>
  );
}
