import { useState } from 'react';
import { ModalWrapper } from '../../components/modal/ModalWrapper.tsx';
import { ModalTypes } from '../../components/modal/types.ts';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import { ScriptLog } from './types.ts';
import { getScriptLog } from './getScriptLog.ts';

type Props = {
  lines: ScriptLog[];
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

export function ScriptLogsResults({ lines }: Props) {
  console.log('ScriptLogsResults inititiated with lines =', lines);
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
              console.log("ScriptLogsResults component's column id =", id);
            },
            sorter: 'number',
            headerSort: true,
          },
          { title: 'Timestamp', field: 'timestamp', sorter: 'string' },
          { title: 'Type', field: 'type', sorter: 'string' },
          { title: 'Script Type', field: 'scripttype', sorter: 'string' },
          {
            title: 'Script',
            field: 'scriptname',
            cellClick: function (_e, cell) {
              const row = cell.getRow();
              const id = row.getData().id;
              setId(id);
              setShowModal(true);
              console.log("ScriptLogsResults component's row id =", id);
            },
            sorter: 'string',
          },
          { title: 'Owner', field: 'owner', sorter: 'string', headerSort: true },
          { title: 'Title', field: 'title', sorter: 'string', headerSort: true },
          { title: 'Detail', field: 'detail', sorter: 'string', headerSort: true },
        ]}
        data={lines}
        options={options}
      />
      {showModal && (
        <ModalWrapper getData={getScriptLog} setShowModal={setShowModal} type={ModalTypes.SCRIPTLOG} id={id} />
      )}
    </>
  );
}
