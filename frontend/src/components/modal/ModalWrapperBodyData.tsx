import { Button } from 'flowbite-react';
import { ModalTypes } from './types';
import { assertIsFile } from '../file/types';
import { assertIsIntegration } from '../integration/types';
import { assertIsScript } from '../script/types';
import { assertIsScriptLog } from '../scriptLog/types';
import { assertIsToken } from '../token/types';
import { assertIsUser } from '../user/types';
import { useAppSettingsContext } from '../AppSettingsContext';

type Props = {
  type: ModalTypes;
  loading: boolean;
  data: unknown;
};

export function ModalWrapperBodyData({ type, loading, data }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appScriptUrl;

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
            <Button.Group>
              <Button onClick={() => window.open(data.urlNs, '_blank')}>View File Record</Button>
              <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
                View File Details
              </Button>
            </Button.Group>
          </>
        );
      case ModalTypes.INTEGRATION:
        assertIsIntegration(data);
        return (
          <>
            <p>
              <b>ID</b>: {data.id}
            </p>
            <p>
              <b>Name</b>: {data.name}
            </p>
            <p>
              <b>Application ID</b>: {data.applicationId}
            </p>
            <p>
              <b>State</b>: {data.state}
            </p>
            <p>
              <b>Date Created</b>: {data.dateCreated}
            </p>
            <Button.Group>
              <Button onClick={() => window.open(data.urlNs, '_blank')}>View Integration Record</Button>
              <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
                View Integration Details
              </Button>
            </Button.Group>
          </>
        );
      case ModalTypes.SCRIPT:
        assertIsScript(data);
        return (
          <>
            <p>API Version: {data.apiversion}</p>
            <p>{data.isinactive ? 'Inactive' : <b>Active</b>}</p>
            <p>Script Type: {data.scripttype}</p>
            <p>Name: {data.name}</p>
            <p>
              ID: {data.scriptid} ({data.id})
            </p>
            <p>Owner: {data.owner}</p>
            <p>File: {data.scriptfile}</p>
            <p>Notify Emails: {data.notifyemails}</p>
            <p>Description: {data.description}</p>
            <Button.Group>
              <Button onClick={() => window.open(data.urlNs, '_blank')}>View Script Record</Button>
              <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
                View Script Details
              </Button>
              <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlScriptLogs, '_blank')}>
                View Script Logs
              </Button>
            </Button.Group>
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
            <Button.Group>
              <Button onClick={() => window.open(data.urlNs, '_blank')}>View Script Log Record</Button>
              <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
                View Script Log Details
              </Button>
            </Button.Group>
          </>
        );
      case ModalTypes.TOKEN:
        assertIsToken(data);
        return (
          <>
            <p>
              <b>ID</b>: {data.id}
            </p>
            <p>
              <b>Name</b>: {data.name}
            </p>
            <p>
              <b>User</b>: {data.user}
            </p>
            <p>
              <b>Role</b>: {data.role}
            </p>
            <p>
              <b>Application</b>: {data.application}
            </p>
            <p>
              <b>State</b>: {data.state}
            </p>
            <p>
              <b>Date Created</b>: {data.dateCreated}
            </p>
            <p>
              <b>Created By</b>: {data.createdBy}
            </p>{' '}
            <Button.Group>
              <Button onClick={() => window.open(data.urlNs, '_blank')}>View Token Record</Button>
              <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
                View Token Details
              </Button>
            </Button.Group>
          </>
        );
      case ModalTypes.USER:
        assertIsUser(data);
        return (
          <>
            <p>
              <b>ID</b>: {data.id}
            </p>
            <p>
              <b>Name</b>: {data.name}
            </p>
            <p>
              <b>Active</b>: {data.isinactive}
            </p>
            <p>
              <b>Email</b>: {data.email}
            </p>
            <p>
              <b>Supervisor</b>: {data.supervisor}
            </p>
            <p>
              <b>Title</b>: {data.title}
            </p>
            <Button.Group>
              <Button onClick={() => window.open(data.urlNs, '_blank')}>View User Record</Button>
              <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
                View User Details
              </Button>
            </Button.Group>
          </>
        );
      default:
        console.error('ModalWrapperBodyData type not found:', type);
        break;
    }
  }
}
