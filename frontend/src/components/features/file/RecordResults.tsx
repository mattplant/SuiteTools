import { useMemo, useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../../shared/results/Export';
import type { ResultsProps, SummaryRow } from '../../shared/results/types';
import { FileBundle, type File } from '@suiteworks/suitetools-shared';

function formatFileDate(value: Date | string | undefined): string {
  if (value instanceof Date) {
    return value.toLocaleString();
  }
  return value ? String(value) : '';
}

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
  {
    key: 'createddate',
    name: 'Created Date',
    renderCell({ row }: { row: File }) {
      return formatFileDate(row.createddate);
    },
  },
  {
    key: 'lastmodifieddate',
    name: 'Last Modified Date',
    renderCell({ row }: { row: File }) {
      return formatFileDate(row.lastmodifieddate);
    },
  },
  { key: 'filetypename', name: 'Type' },
  { key: 'name', name: 'Name' },
  { key: 'filesize', name: 'File Size' },
  { key: 'description', name: 'Description' },
  { key: 'url', name: 'URL' },
];

export function RecordResults({ rows, setId, setOpenModal }: ResultsProps) {
  FileBundle.assertMany(rows);
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
      </div>
    </>
  );
}
