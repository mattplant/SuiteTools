import { Button } from 'flowbite-react';
import { ScriptLog } from './types';
import { useAppSettingsContext } from '../AppSettingsContext';

type Props = {
  data: ScriptLog;
  modal?: boolean;
};

export function ScriptLogResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;

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
      {modal && (
        <Button.Group>
          <Button onClick={() => window.open(data.urlNs, '_blank')}>View Script Log Record</Button>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View Script Log Details
          </Button>
        </Button.Group>
      )}
    </>
  );
}
