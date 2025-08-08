import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertValidFile, File } from 'shared';
import { FileResult } from '../components/features/file/RecordResult';

export function FilePage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">File</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.file}>
          {(file) => {
            assertValidFile(file);
            return <FileResult data={file} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  file: File;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('file' in data)) {
    throw new Error('Data does not contain file');
  }
}
