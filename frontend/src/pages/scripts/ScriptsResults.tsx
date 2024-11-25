import { useState } from 'react';
import { ModalWrapper } from '../../components/modal/ModalWrapper.tsx';
import { ModalTypes } from '../../components/modal/types.ts';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import { Script } from './types.ts';
import { getScript } from './getScript.ts';

type Props = {
  lines: Script[];
};

//           { title: "Script", field:"scriptname", cellClick:function(e, cell, value, data){
//               showModal(scriptUrl, ModalType.Script, cell.getValue()) }, sorter: "string" },
//           { title: "Owner", field: "owner", cellClick:function(e, cell, value, data){
//               showModal(scriptUrl, ModalType.User, cell.getValue()) }, sorter: "string" },

const options: ReactTabulatorOptions = {
  // headerSortElement: '<span className="inline-block"><i className="fas fa-arrow-up text-gray-500"></i><i className="fas fa-arrow-down text-gray-500"></i></span>',
  // headerSort: true,
  layout: 'fitData',
};

export function ScriptsResults({ lines }: Props) {
  console.log('ScriptsResults inititiated with lines =', lines);
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
              console.log("Scripts component's column id =", id);
            },
            sorter: 'number',
            headerSort: true,
          },
          {
            title: 'Active',
            field: 'isinactive',
            hozAlign: 'center',
            sorter: 'string',
          },
          {
            title: 'API',
            field: 'apiversion',
            hozAlign: 'center',
            sorter: 'string',
          },
          {
            title: 'Script Type',
            field: 'scripttype',
            sorter: 'string',
          },
          {
            title: 'Script',
            field: 'name',
            cellClick: function (_e, cell) {
              const row = cell.getRow();
              const id = row.getData().id;
              setId(id);
              setShowModal(true);
              console.log("ScriptsResults component's row id =", id);
            },
            sorter: 'string',
          },
          {
            title: 'Id',
            field: 'scriptid',
            sorter: 'string',
          },
          {
            title: 'Owner',
            field: 'owner',
            sorter: 'string',
          },
          {
            title: 'File',
            field: 'scriptfile',
          },
          {
            title: 'Notify Emails',
            field: 'notifyemails',
            sorter: 'string',
          },
          {
            title: 'Description',
            field: 'description',
            sorter: 'string',
          },
        ]}
        data={lines}
        options={options}
      />
      {showModal && <ModalWrapper getData={getScript} setShowModal={setShowModal} type={ModalTypes.SCRIPT} id={id} />}
      {/* {showModal && (
        <ModalWrapper getData={getScript} setShowModal={setShowModal} type={ModalTypes.USER} id={14671395} />
      )} */}
    </>
  );
}
