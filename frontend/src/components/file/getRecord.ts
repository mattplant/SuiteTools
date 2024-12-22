import { getData } from '../../api/api';
import { NotFound } from '../../api/types';
import { File, assertIsFile } from './types';

export async function getFile(id: number): Promise<File | NotFound> {
  let result;
  const localTestData = {
    data: {
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
  };
  const response = await getData(localTestData, 'file', { id: id });
  if (response.message) {
    result = { message: response.message };
  } else {
    assertIsFile(response.data);
    // build additional properties
    response.data.urlNs = `/app/common/media/mediaitem.nl?id=${response.data.id}`;
    response.data.urlDetail = `#/file/${response.data.id}`;
    result = response.data;
  }

  return result;
}
