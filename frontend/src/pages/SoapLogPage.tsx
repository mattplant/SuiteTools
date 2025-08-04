import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertValidSoapLog, SoapLog } from 'shared';
import { SoapLogResult } from '../components/features/soapLog/RecordResult';

export function SoapLogPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">SOAP Log</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.soapLog}>
          {(record) => {
            assertValidSoapLog(record);
            return (
              <>
                <SoapLogResult data={record} />
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  soapLog: SoapLog;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('soapLog' in data)) {
    throw new Error('Data does not contain integration');
  }
}
