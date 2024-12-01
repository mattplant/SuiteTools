import { getData } from '../../api/api';
import { ScriptLogsLine, assertIsScriptLog } from './types';

export async function getScriptLog(id: number): Promise<ScriptLogsLine> {
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

  return response.data;
}
