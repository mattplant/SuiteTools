import { Button, ButtonGroup } from 'flowbite-react';
import type { File } from '@suiteworks/suitetools-shared';
import { openAppPage, openNetSuitePage } from '../../../utils/navigation';

type Props = {
  data: File;
  modal?: boolean;
};

export function FileResult({ data, modal }: Props) {
  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Folder</b>: {data.folder}
      </p>
      <p>
        <b>Created Date</b>: {data.dateCreated.toLocaleString()}
      </p>
      <p>
        <b>Last Modified Date</b>: {data.lastModifiedDate.toLocaleString()}
      </p>
      <p>
        <b>Type</b>: {data.fileTypeName}
      </p>
      <p>
        <b>Name</b>: {data.name}
      </p>
      <p>
        <b>File Size</b>: {data.fileSize}
      </p>
      <p>
        <b>Description</b>: {data.description}
      </p>
      <p>
        <b>URL</b>: {data.url}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => data.urlNs && openNetSuitePage(data.urlNs)}>View File Record</Button>
          <Button onClick={() => data.urlDetail && openAppPage(data.urlDetail)}>View File Details</Button>
        </ButtonGroup>
      )}
    </>
  );
}
