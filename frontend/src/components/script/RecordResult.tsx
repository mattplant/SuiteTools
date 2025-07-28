import { Button, ButtonGroup } from 'flowbite-react';
import { Script } from './types';
import { useAppSettingsContext } from '../../context/AppSettingsContext';

type Props = {
  data: Script;
  modal?: boolean;
};

export function ScriptResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;

  return (
    <>
      <p>
        <b>API Version:</b> {data.apiversion}
      </p>
      <p>
        <b>{data.isinactive}</b>
      </p>
      <p>
        <b>Script Type:</b> {data.scripttype}
      </p>
      <p>
        <b>Name:</b> {data.name}
      </p>
      <p>
        <b>ID:</b> {data.scriptid} ({data.id})
      </p>
      <p>
        <b>Owner:</b> {data.owner}
      </p>
      <p>
        <b>File:</b> {data.scriptfile}
      </p>
      <p>
        <b>Notify Emails:</b> {data.notifyemails}
      </p>
      <p>
        <b>Description:</b> {data.description}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => window.open(data.urlNs, '_blank')}>View Script Record</Button>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View Script Details
          </Button>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlScriptLogs, '_blank')}>
            View Script Logs
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}
