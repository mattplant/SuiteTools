import { ModalTypes } from './types';
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
        console.error('ModalWrapper type not found:', type);
        break;
    }
  }
}
