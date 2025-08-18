import { Button, ButtonGroup } from 'flowbite-react';
import type { File } from '@suiteworks/suitetools-shared';
import { useAppSettingsContext } from '../../shared/context/AppSettingsContext';

type Props = {
  data: File;
  modal?: boolean;
};

export function FileResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;

  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Folder</b>: {data.folder}
      </p>
      <p>
        <b>Created Date</b>: {data.createddate.toLocaleString()}
      </p>
      <p>
        <b>Lastmodified Date</b>:{data.lastmodifieddate.toLocaleString()}
      </p>
      <p>
        <b>Type</b>: {data.filetypename}
      </p>
      <p>
        <b>Name</b>: {data.name}
      </p>
      <p>
        <b>File Size</b>: {data.filesize}
      </p>
      <p>
        <b>Description</b>: {data.description}
      </p>
      <p>
        <b>URL</b>: {data.url}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => window.open(data.urlNs, '_blank')}>View File Record</Button>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View File Details
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}
