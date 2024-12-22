import { Button } from 'flowbite-react';
import { ResultsTypes } from './types';
import { assertIsFile } from '../file/types';
import { assertIsIntegration } from '../integration/types';
import { assertIsRole } from '../role/types';
import { assertIsScript } from '../script/types';
import { assertIsScriptLog } from '../scriptLog/types';
import { assertIsToken } from '../token/types';
import { assertIsUser } from '../user/types';
import { useAppSettingsContext } from '../AppSettingsContext';

type Props = {
  type: ResultsTypes;
  loading: boolean;
  data: unknown;
};

export function ResultsModal({ type, loading, data }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;

  if (loading) {
    return 'Loading...';
  } else if (!data) {
    return 'No records found.';
  } else {
    // determine modal details based on modal type
    switch (type) {
      case ResultsTypes.FILE:
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
      case ResultsTypes.INTEGRATION:
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
      case ResultsTypes.ROLE:
        assertIsRole(data);
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
              <b>Center Type</b>: {data.centertype}
            </p>
            <p>
              <b>Sales Role</b>: {data.issalesrole}
            </p>
            <p>
              <b>Support Role</b>: {data.issupportrole}
            </p>
            <p>
              <b>Web Service Only</b>: {data.iswebserviceonlyrole}
            </p>
            <Button.Group>
              <Button onClick={() => window.open(data.urlNs, '_blank')}>View Role Record</Button>
              <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
                View Role Details
              </Button>
            </Button.Group>
          </>
        );
      case ResultsTypes.SCRIPT:
        assertIsScript(data);
        return (
          <>
            <p>API Version: {data.apiversion}</p>
            <p>{data.isinactive}</p>
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
      case ResultsTypes.SCRIPTLOG:
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
      case ResultsTypes.TOKEN:
        assertIsToken(data);
        return (
          <>
            <p>
              <b>ID</b>: {data.id}
            </p>
            <p>
              <b>Token Name</b>: {data.name}
            </p>
            <p>
              <b>Integration</b>: {data.application}
            </p>
            <p>
              <b>User</b>: {data.user}
            </p>
            <p>
              <b>Role</b>: {data.role}
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
      case ResultsTypes.USER:
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
        console.error('ResultsModal type not found:', type);
        break;
    }
  }
}
