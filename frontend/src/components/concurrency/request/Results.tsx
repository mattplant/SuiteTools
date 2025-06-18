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
  { key: 'startDate', name: 'Start Date' }, // Start Date and Time
  { key: 'endDate', name: 'End Date' }, // End Date and Time
  { key: 'type', name: 'Type' }, // Script Type
  // { key: 'integrationId', name: 'IntegrationId' },
  { key: 'integration', name: 'Integration' },
  { key: 'operation', name: 'Operation' }, // Operation Type
  // { key: 'scriptId', name: 'Script ID' },
  { key: 'scriptName', name: 'Script Name' },
  { key: 'status', name: 'Status' },
  // { key: 'wouldBeRejected', name: 'Would Be Rejected' },

  // ALTERNATIVE COLUMNS
  // { key: 'date', name: 'Date and Time' },
  // { key: 'email', name: 'Email' },
  // { key: 'executionTime', name: 'Execution Time' },
  // { key: 'totalRecords', name: 'Total Records' },
  // { key: 'status', name: 'Status' },
  // { key: 'operationId', name: 'Profiler Details' },
  // { key: 'frhtId', name: 'FRHT ID' },
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
          startDate: formatDate(result.startDate), // Start Date and Time
          endDate: formatDate(result.endDate), // End Date and Time
          type: result.type, // Script Type
          integration: result.integration, // Integration Name
          operation: result.operation, // Operation Type
          scriptName: result.scriptName, // Script Name
          status: result.status, // Request Status
          // wouldBeRejected: result.wouldBeRejected, // Would Be Rejected
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
