import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { FileResult } from '../components/features/file/RecordResult';
import type { FileLoaderData } from '../routes/fileLoader';

/**
 * Renders the file page with file details.
 * @returns The rendered file page component.
 */
export function FilePage(): JSX.Element {
  const data = useLoaderData() as FileLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">File</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.file}>
          {(record) => {
            return <FileResult data={record} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
