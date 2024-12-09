import { useState } from 'react';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import { ModalWrapper } from '../modal/ModalWrapper.tsx';
import { ModalTypes } from '../modal/types.ts';
import { User } from './types.ts';
import { getUser } from './getRecord.ts';

type Props = {
  lines: User[];
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
            title: 'Active',
            field: 'isinactive',
            hozAlign: 'center',
            sorter: 'string',
          },
          {
            title: 'Name',
            field: 'name',
            cellClick: function (_e, cell) {
              const row = cell.getRow();
              const id = row.getData().id;
              setId(id);
              setShowModal(true);
            },
            sorter: 'string',
          },
          {
            title: 'Email',
            field: 'email',
            sorter: 'string',
          },
          {
            title: 'Role',
            field: 'role',
            sorter: 'string',
          },
          {
            title: 'Title',
            field: 'title',
            sorter: 'string',
          },
          {
            title: 'Supervisor',
            field: 'supervisor',
            sorter: 'string',
          },
        ]}
        data={lines}
        options={options}
      />
      {showModal && <ModalWrapper getData={getUser} setShowModal={setShowModal} type={ModalTypes.USER} id={id} />}
    </>
  );
}
