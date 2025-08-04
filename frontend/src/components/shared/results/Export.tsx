import { Button } from 'flowbite-react';
import { exportToCsv } from '../ui/exportUtils.tsx';
import 'react-data-grid/lib/styles.css';
import { type DataGridHandle } from 'react-data-grid';

type Props = {
  gridRef: React.RefObject<DataGridHandle>;
  modal?: boolean;
};

export function Export({ gridRef }: Props) {
  const handleExportToCsv = () => {
    exportToCsv(gridRef.current!.element!, 'export.csv');
  };

  return <Button onClick={() => handleExportToCsv()}>Export to CSV</Button>;
}
