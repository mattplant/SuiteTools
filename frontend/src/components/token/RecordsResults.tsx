import { useState } from 'react';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import { ModalWrapper } from '../modal/ModalWrapper.tsx';
import { ModalTypes } from '../modal/types.ts';
import { Token } from './types.ts';
import { getToken } from './getRecord.ts';

type Props = {
  lines: Token[];
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
            headerSort: true,
          },
          { title: 'Name', field: 'name', sorter: 'string' },
          { title: 'User', field: 'user', sorter: 'string' },
          { title: 'Role', field: 'role', sorter: 'string' },
          { title: 'Application', field: 'application', sorter: 'string' },
          { title: 'State', field: 'state', sorter: 'string' },
          { title: 'Date Created', field: 'dateCreated', sorter: 'string' },
          { title: 'Created By', field: 'createdBy', sorter: 'string' },
        ]}
        data={lines}
        options={options}
      />
      {showModal && <ModalWrapper getData={getToken} setShowModal={setShowModal} type={ModalTypes.TOKEN} id={id} />}
    </>
  );
}
