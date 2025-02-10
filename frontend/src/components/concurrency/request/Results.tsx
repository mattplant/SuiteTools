import { useRef } from 'react';
import DataGrid, { type DataGridHandle } from 'react-data-grid';
import 'react-data-grid/lib/styles.css';
import { Export } from '../../results/Export.tsx';
import { ConcurrencyRequestData, ConcurrencyRequestRows } from './types';
import { formatDate } from '../../../utils/dates';

type Props = {
  data: ConcurrencyRequestData | undefined;
};

const columns = [
  { key: 'date', name: 'Date and Time' },
  { key: 'email', name: 'Email' },
  { key: 'executionTime', name: 'Execution Time' },
  { key: 'totalRecords', name: 'Total Records' },
  { key: 'status', name: 'Status' },
  { key: 'operationId', name: 'Profiler Details' },
  { key: 'frhtId', name: 'FRHT ID' },
];

export function ConcurrencyRequestResults({ data }: Props) {
  const gridRef = useRef<DataGridHandle>(null);
  const formattedResults: ConcurrencyRequestRows = [];
  if (data) {
    const results = data;
    if (results && results.length > 0) {
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const formattedResult = {
          date: formatDate(result.date), // Date and Time
          email: result.email, // Email Address
          executionTime: result.executionTime, // Execution Time
          totalRecords: result.totalRecords, // Total Records
          status: result.status, // Status
          operationId: result.operationId, // Profiler Operation ID
          frhtId: result.frhtId,
        };
        formattedResults.push(formattedResult);
      }
    }
  }

  return (
    <>
      <h2 className="pt-5 pb-1 text-xl font-bold text-slate-900">Request Table</h2>
      <Export gridRef={gridRef} />
      <div style={{ height: '600px', overflowY: 'auto' }}>
        <DataGrid
          ref={gridRef}
          columns={columns}
          rows={formattedResults}
          defaultColumnOptions={{
            sortable: true,
            resizable: true,
          }}
          className="fill-grid"
        />
      </div>
    </>
  );
}
