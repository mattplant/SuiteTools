import { useState } from 'react';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import { ModalWrapper } from '../modal/ModalWrapper.tsx';
import { ModalTypes } from '../modal/types.ts';
import { Integration } from './types.ts';
import { getIntegration } from './getRecord.ts';

type Props = {
  lines: Integration[];
};

const options: ReactTabulatorOptions = {
  // headerSortElement: '<span className="inline-block"><i className="fas fa-arrow-up text-gray-500"></i><i className="fas fa-arrow-down text-gray-500"></i></span>',
  // headerSort: true,
  layout: 'fitData',
};

export function RecordsResults({ lines }: Props) {
  console.log('RecordsResults inititiated with lines =', lines);
  const [id, setId] = useState<number>(0);
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <ReactTabulator
        columns={[
          {
            title: 'ID',
            field: 'id',
            cellClick: function (_e, cell) {
              const id = cell.getValue();
              setId(id);
              setShowModal(true);
            },
            sorter: 'number',
          },
          { title: 'Name', field: 'name', sorter: 'string' },
          { title: 'Application ID', field: 'applicationId', sorter: 'string' },
          { title: 'State', field: 'state', sorter: 'string' },
          { title: 'Created', field: 'dateCreated', sorter: 'date' },
        ]}
        data={lines}
        options={options}
      />
      {showModal && (
        <ModalWrapper getData={getIntegration} setShowModal={setShowModal} type={ModalTypes.INTEGRATION} id={id} />
      )}
    </>
  );
}
