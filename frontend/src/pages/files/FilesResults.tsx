import { useState } from 'react';
import { ModalWrapper } from '../../components/modal/ModalWrapper.tsx';
import { ModalTypes } from '../../components/modal/types.ts';
import { ReactTabulator, ReactTabulatorOptions } from 'react-tabulator';
import { File } from './types.ts';
import { getFile } from './getFile.ts';

type Props = {
  lines: File[];
};

const options: ReactTabulatorOptions = {
  // headerSortElement: '<span className="inline-block"><i className="fas fa-arrow-up text-gray-500"></i><i className="fas fa-arrow-down text-gray-500"></i></span>',
  // headerSort: true,
  layout: 'fitData',
};

export function FilesResults({ lines }: Props) {
  console.log('FilesResults inititiated with lines =', lines);
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
              console.log("Files component's column id =", id);
            },
            sorter: 'number',
            headerSort: true,
          },
          {
            title: 'Folder',
            field: 'folder',
            hozAlign: 'center',
            sorter: 'string',
          },
          {
            title: 'Created Date',
            field: 'createddate',
            hozAlign: 'center',
            sorter: 'string',
          },
          {
            title: 'Last Modified Date',
            field: 'lastmodifieddate',
            sorter: 'string',
          },
          {
            title: 'Type',
            field: 'filetypename',
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
              console.log("FilesResults component's row id =", id);
            },
            sorter: 'string',
          },
          {
            title: 'File Size',
            field: 'filesize',
            sorter: 'string',
          },
          {
            title: 'Description',
            field: 'description',
            sorter: 'string',
            // formatter:function(cell, formatterParams, onRendered){
            //     if (cell.getValue() != "null") {
            //         return cell.getValue();
            //     }
            // }
          },
          {
            title: 'URL',
            field: 'url',
          },
        ]}
        data={lines}
        options={options}
      />
      {showModal && <ModalWrapper getData={getFile} setShowModal={setShowModal} type={ModalTypes.FILE} id={id} />}
    </>
  );
}
