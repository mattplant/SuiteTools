import { useState } from 'react';
import { ModalWrapper } from '../../components/modal/ModalWrapper.tsx';
import { ModalTypes } from '../../components/modal/types.ts';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import { User } from './types.ts';
import { getUser } from './getUser.ts';

type Props = {
  lines: User[];
};

//           { title: "User", field:"scriptname", cellClick:function(e, cell, value, data){
//               showModal(scriptUrl, ModalType.User, cell.getValue()) }, sorter: "string" },
//           { title: "Owner", field: "owner", cellClick:function(e, cell, value, data){
//               showModal(scriptUrl, ModalType.User, cell.getValue()) }, sorter: "string" },

const options: ReactTabulatorOptions = {
  // headerSortElement: '<span className="inline-block"><i className="fas fa-arrow-up text-gray-500"></i><i className="fas fa-arrow-down text-gray-500"></i></span>',
  // headerSort: true,
  layout: 'fitData',
};

export function UsersResults({ lines }: Props) {
  console.log('UsersResults inititiated with lines =', lines);
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
              console.log("UsersResults component's row id =", id);
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
