import { useState } from 'react';
import { ModalWrapper } from '../../components/modal/ModalWrapper.tsx';
import { ModalTypes } from '../../components/modal/types.ts';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import { Integration } from './types.ts';
import { getIntegration } from './getIntegration.ts';

type Props = {
  lines: Integration[];
};

const options: ReactTabulatorOptions = {
  // headerSortElement: '<span className="inline-block"><i className="fas fa-arrow-up text-gray-500"></i><i className="fas fa-arrow-down text-gray-500"></i></span>',
  // headerSort: true,
  layout: 'fitData',
};

export function IntegrationsResults({ lines }: Props) {
  console.log('IntegrationsResults inititiated with lines =', lines);
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
              console.log("Integrations component's column id =", id);
            },
            sorter: 'number',
            headerSort: true,
          },
          {
            title: 'Name',
            field: 'name',
            cellClick: function (_e, cell) {
              const row = cell.getRow();
              const id = row.getData().id;
              setId(id);
              setShowModal(true);
              console.log("IntegrationsResults component's row id =", id);
            },
            sorter: 'string',
          },
          { title: 'Application ID', field: 'applicationId', sorter: 'string' },
          { title: 'State', field: 'state', sorter: 'string' },
          { title: 'Date Created', field: 'dateCreated', sorter: 'date' },
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
