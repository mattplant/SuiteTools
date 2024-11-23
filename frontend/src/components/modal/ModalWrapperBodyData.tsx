import { ModalTypes } from './types';
import { assertIsFile } from '../../pages/files/types';
import { assertIsScript } from '../../pages/scripts/types';
import { assertIsScriptLog } from '../../pages/scriptLogs/types';

type Props = {
  type: ModalTypes;
  loading: boolean;
  data: unknown;
};

export function ModalWrapperBodyData({ type, loading, data }: Props) {
  if (loading) {
    return 'Loading...';
  } else if (!data) {
    return 'No records found.';
  } else {
    // determine modal details based on modal type
    switch (type) {
      case ModalTypes.FILE:
        assertIsFile(data);
        return (
          <>
            <p>
              <b>ID</b>: {data.id}
            </p>
            <p>
              <b>Folder</b>: {data.folder}
            </p>
            <p>
              <b>Created Date</b>: {data.createddate}
            </p>
            <p>
              <b>Lastmodified Date</b>: {data.lastmodifieddate}
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
            {/* <p>
              <b>Description</b>: {data.description}
            </p> */}
            <p>
              <b>URL</b>: {data.url}
            </p>
          </>
        );
      case ModalTypes.SCRIPT:
        assertIsScript(data);
        return (
          <>
            <p>
              <b>ID</b>: {data.id}
            </p>
            <p>
              <b>API Version</b>: {data.apiversion}
            </p>
            <p>
              <b>Is Inactive?</b>: {data.isinactive}
            </p>
            <p>
              <b>Script Type</b>: {data.scripttype}
            </p>
            <p>
              <b>Name</b>: {data.name}
            </p>
            <p>
              <b>Id</b>: {data.scriptid}
            </p>
            <p>
              <b>Owner</b>: {data.owner}
            </p>
            <p>
              <b>Script File</b>: {data.scriptfile}
            </p>
            <p>
              <b>Notify Emails</b>: {data.notifyemails}
            </p>
            <p>
              <b>Description</b>: {data.description}
            </p>
          </>
        );
      case ModalTypes.SCRIPTLOG:
        assertIsScriptLog(data);
        return (
          <>
            <p>
              <b>ID</b>: {data.id}
            </p>
            <p>
              <b>Timestamp</b>: {data.timestamp}
            </p>
            <p>
              <b>Type</b>: {data.type}
            </p>
            <p>
              <b>Script Type</b>: {data.scripttype}
            </p>
            <p>
              <b>Owner</b>: {data.owner}
            </p>
            <p>
              <b>Name</b>: {data.scriptname}
            </p>
            <p>
              <b>Title</b>: {data.title}
            </p>
            <p>
              <b>Detail</b>: {data.detail}
            </p>
          </>
        );
      default:
        console.error('ModalWrapperBodyData type not found:', type);
        break;
    }
  }
}
