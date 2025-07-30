import { getData } from '../../api/api';
import { NotFound } from '../../api/types';
import { ScriptLog } from './scriptLogs.types';
import { parseScriptLog } from './scriptLogs.parse';

export async function getScriptLog(id: number): Promise<ScriptLog | NotFound> {
  let result;
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
  if (response.message) {
    result = { message: response.message };
  } else {
    const data = parseScriptLog(response.data);
    // build additional properties
    data.urlNs = `/app/common/scripting/scriptnote.nl?id=${data.id}`;
    data.urlDetail = `#/scriptLog/${data.id}`;
    result = data;
  }

  return result;
}
