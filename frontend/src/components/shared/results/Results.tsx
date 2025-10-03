// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from 'react';
import { Modal } from 'flowbite-react';
import { DynamicResultsRenderer } from './DynamicResultsRenderer';
import type { NotFound } from '../../../api/types';
import { ResultsTypes } from './types';
import type { ModalResult } from './types';
import { ResultsModal } from './ResultsModal';

type Props = {
  type: ResultsTypes;
  lines: readonly unknown[];
  getModalData: (id: number, lines?: readonly unknown[]) => Promise<ModalResult | NotFound>;
};

/**
 * Renders the results table and modal for the given type and data.
 * @param root0 - The props object.
 * @param root0.type - The type of results to render (e.g. role, user, job).
 * @param root0.lines - The data rows to display in the results table.
 * @param root0.getModalData - Async function to fetch modal data for a given record id.
 * @returns The rendered Results component.
 */
export function Results({ type, lines, getModalData }: Props): JSX.Element {
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState<number | null>(null);
  const [data, setData] = useState<ModalResult>();
  // const [data, setData] = useState<ModalResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id === null) return; // skip since no record selected

    setLoading(true);
    const selectedId = id;

    async function fetchData(): Promise<void> {
      try {
        const data = await getModalData(selectedId, lines);
        if ('id' in data) setData(data);
      } catch (error) {
        // TODO: handle error state properly
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();

    return (): void => {};
  }, [id, lines, getModalData]);

  // determine modal title based on modal type
  const modalTitles: Record<ResultsTypes, string> = {
    [ResultsTypes.FILE]: 'File',
    [ResultsTypes.INTEGRATION]: 'Integration',
    [ResultsTypes.JOB]: 'Job',
    [ResultsTypes.JOBRUN]: 'Job Execution',
    [ResultsTypes.LOGIN]: 'Login',
    [ResultsTypes.ROLE]: 'Role',
    [ResultsTypes.SCRIPT]: 'Script',
    [ResultsTypes.SCRIPTLOG]: 'Script Log Details',
    [ResultsTypes.SOAPLOG]: 'SOAP Log Details',
    [ResultsTypes.TOKEN]: 'Token',
    [ResultsTypes.USER]: 'User',
  };

  const modalTitle = modalTitles[type] ?? 'Unknown';

  return (
    <div>
      <DynamicResultsRenderer type={type} rows={lines} setId={setId} setOpenModal={setOpenModal} />
      <Modal
        dismissible
        show={openModal}
        size="6xl"
        onClose={() => {
          setOpenModal(false);
          setId(null);
          setData(undefined);
        }}
      >
        <div className="px-6 pt-6 text-2xl font-semibold">{modalTitle}</div>
        <div className="space-y-6 p-6">
          {loading ? <div>Loading...</div> : <ResultsModal type={type} loading={loading} data={data} />}
        </div>
      </Modal>
    </div>
  );
}
