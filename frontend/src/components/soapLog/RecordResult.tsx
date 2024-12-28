import { SoapLog } from './types';

type Props = {
  data: SoapLog;
};

export function SoapLogResult({ data }: Props) {
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
        <b>Request</b>:{' '}
        <a href={data.request} target="_blank" rel="noopener noreferrer">
          request
        </a>
      </p>
      <p>
        <b>Response</b>:{' '}
        <a href={data.response} target="_blank" rel="noopener noreferrer">
          response
        </a>
      </p>
    </>
  );
}
