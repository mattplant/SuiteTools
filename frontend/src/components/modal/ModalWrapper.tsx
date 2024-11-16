import { useEffect, useState } from 'react';
import { ModalWrapperHeading } from './ModalWrapperHeading';
import { ModalWrapperBody } from './ModalWrapperBody';
import { ModalTypes, ModalResult } from './types';

type Props = {
  getData: (id: number) => Promise<ModalResult>;
  setShowModal: (showModal: boolean) => void;
  type: ModalTypes;
  id: number;
};

export function ModalWrapper({ getData, setShowModal, type, id }: Props) {
  console.log('ModalWrapper inititiated', { getData, setShowModal, type, id });
  const [data, setData] = useState<ModalResult>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ModalWrapper useEffect()');

    async function fetchData() {
      try {
        const data = await getData(id);
        setData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }

    fetchData();

    return () => {
      console.log('ModalWrapper useEffect() cleanup');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // determine modal title based on modal type
  let title = '';
  switch (type) {
    case ModalTypes.SCRIPT:
      title = 'Script';
      break;
    case ModalTypes.SCRIPTLOG:
      title = 'Script Log Details';
      break;
    default:
      console.error('ModalWrapper type not found:', type);
      break;
  }

  return (
    <div
      id="script-modal"
      className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full justify-center items-center flex"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full h-full max-w-4xl md:h-auto">
        <div className="relative bg-white rounded-lg shadow">
          <ModalWrapperHeading setShowModal={setShowModal} title={title} />
          <ModalWrapperBody type={type} loading={loading} data={data} />
        </div>
      </div>
    </div>
  );
}
