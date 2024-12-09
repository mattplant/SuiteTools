import { useState } from 'react';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import { ModalWrapper } from '../modal/ModalWrapper.tsx';
import { ModalTypes } from '../modal/types.ts';
import { ScriptLog } from './types.ts';
import { getScriptLog } from './getRecord.ts';

type Props = {
  lines: ScriptLog[];
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
