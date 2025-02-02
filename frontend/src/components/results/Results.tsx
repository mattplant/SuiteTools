import { useEffect, useState } from 'react';
import { Modal } from 'flowbite-react';
import { DynamicResultsRenderer } from './DynamicResultsRenderer.tsx';
import { NotFound } from '../../api/types';
import { ModalResult, ResultsTypes } from './types.ts';
import { ResultsModal } from './ResultsModal.tsx';

type Props = {
  type: ResultsTypes;
  lines: unknown[];
  getModalData: (id: number, lines?: unknown[]) => Promise<ModalResult | NotFound>;
};

export function Results({ type, lines, getModalData }: Props) {
  console.log('Results() initiated with', { type, lines, getModalData });
  const [openModal, setOpenModal] = useState(false);
  const [id, setId] = useState<number>(0);
  const [data, setData] = useState<ModalResult>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getModalData(id, lines);
        if ('id' in data) {
          setData(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }
    fetchData();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // determine modal title based on modal type
  let modalTitle = '';
  switch (type) {
    case ResultsTypes.FILE:
      modalTitle = 'File';
      break;
    case ResultsTypes.INTEGRATION:
      modalTitle = 'Integration';
      break;
    case ResultsTypes.JOB:
      modalTitle = 'Job';
      break;
    case ResultsTypes.LOGIN:
      modalTitle = 'Login';
      break;
    case ResultsTypes.ROLE:
      modalTitle = 'Role';
      break;
    case ResultsTypes.SCRIPT:
      modalTitle = 'Script';
      break;
    case ResultsTypes.SCRIPTLOG:
      modalTitle = 'Script Log Details';
      break;
    case ResultsTypes.SOAPLOG:
      modalTitle = 'SOAP Log Details';
      break;
    case ResultsTypes.TOKEN:
      modalTitle = 'Token';
      break;
    case ResultsTypes.USER:
      modalTitle = 'User';
      break;
    default:
      console.error('Results type not found:', type);
      break;
  }

  return (
    <div className="grid">
      <DynamicResultsRenderer type={type} rows={lines} setId={setId} setOpenModal={setOpenModal} />
      <Modal dismissible show={openModal} size="6xl" onClose={() => setOpenModal(false)}>
        <Modal.Header>{modalTitle}</Modal.Header>
        <Modal.Body>
          <div className="space-y-6 p-6">
            <ResultsModal type={type} loading={loading} data={data} />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
