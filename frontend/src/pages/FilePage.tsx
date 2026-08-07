// SPDX-License-Identifier: GPL-3.0-or-later

import { useLoaderData } from 'react-router-dom';
import { FileResult } from '../components/features/file/RecordResult';
import type { FileLoaderData } from '../routes/fileLoader';

/**
 * Renders the file page with file details.
 * @returns The rendered file page component.
 */
export function FilePage(): JSX.Element {
  const { file } = useLoaderData() as FileLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">File</h2>
      <br />
      <FileResult data={file} />
    </div>
  );
}
