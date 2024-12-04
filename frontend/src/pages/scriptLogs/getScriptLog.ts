import { getData } from '../../api/api';
import { ScriptLog, assertIsScriptLog } from './types';

export async function getScriptLog(id: number): Promise<ScriptLog> {
  const localTestData = {
    data: {
      id: 1,
      timestamp: '2021-09-16T14:00:01',
      type: 'DEBUG',
      scripttype: 'RESTLET',
      owner: 'owner',
      scriptname: 'scriptname1',
      title: 'title1',
      detail: 'detail1',
    },
  };
  const response = await getData(localTestData, 'scriptLog', { id: id });
  assertIsScriptLog(response.data);

  // build additional properties
  response.data.urlNs = `/app/common/scripting/scriptnote.nl?id=${response.data.id}`;
  response.data.urlScriptLog = `#/scriptLog/${response.data.id}`;

  return response.data;
}
