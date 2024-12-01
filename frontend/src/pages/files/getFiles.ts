import { getData } from '../../api/api';
import { File, assertIsFiles } from './types';
import { CriteriaFields } from '../../components/search/criteria/types';

export async function getFiles(fields: CriteriaFields): Promise<File[]> {
  const localTestData = {
    data: [
      {
        id: 1,
        folder: 1329248,
        createddate: '11/19/2024',
        lastmodifieddate: '11/22/2024',
        filetype: 'JAVASCRIPT',
        filetypename: 'JavaScript File',
        name: 'example.js (12345)',
        filesize: 1024,
        description: '',
        url: '/core/media.n.?id=123&c=...',
      },
    ],
  };

  const urlParams = {
    rows: fields.rows,
    filetype: fields.filetype,
    createddate: fields.createddate,
    lastmodifieddate: fields.lastmodifieddate,
  };

  const response = await getData(localTestData, 'files', urlParams);
  assertIsFiles(response.data);

  return response.data;
}
