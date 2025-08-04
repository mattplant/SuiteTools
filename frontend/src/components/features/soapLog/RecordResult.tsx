import { Button, ButtonGroup } from 'flowbite-react';
import { SoapLog } from 'shared';
import { useAppSettingsContext } from '../../shared/context/AppSettingsContext';

type Props = {
  data: SoapLog;
  modal?: boolean;
};

export function SoapLogResult({ data, modal }: Props) {
  const { settings } = useAppSettingsContext();
  const appScriptUrl = settings?.appUrl;

  return (
    <>
      <p>
        <b>ID</b>: {data.id}
      </p>
      <p>
        <b>Start Date</b>: {data.startDate}
      </p>
      <p>
        <b>Duration</b>: {data.duration}
      </p>
      <p>
        <b>Integration</b>: {data.integration}
      </p>
      <p>
        <b>Integration Id</b>: {data.integrationId}
      </p>
      <p>
        <b>Action</b>: {data.action}
      </p>
      <p>
        <b>Record Type</b>: {data.recordType}
      </p>
      <p>
        <b>User</b>: {data.user}
      </p>
      <p>
        <b>Status</b>: {data.status}
      </p>
      <p>
        <b>Records</b>: {data.records}
      </p>
      <p>
        <b>Records Finished</b>: {data.recordsFinished}
      </p>
      <p>
        <b>Records Failed</b>: {data.recordsFailed}
      </p>
      <p>
        <b>Records Returned</b>: {data.recordsReturned}
      </p>
      <p>
        <b>Request</b>: {data.request}
      </p>
      <p>
        <b>Response</b>: {data.response}
      </p>
      {modal && (
        <ButtonGroup>
          <Button onClick={() => appScriptUrl && window.open(appScriptUrl + data.urlDetail, '_blank')}>
            View SOAP Log Details
          </Button>
        </ButtonGroup>
      )}
    </>
  );
}
