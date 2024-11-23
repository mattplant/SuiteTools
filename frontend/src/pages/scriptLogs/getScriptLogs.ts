import { getData } from '../../utils/api/api';
import { ScriptLogsLine, assertIsScriptLogs } from './types';
import { CriteriaFields } from '../../components/search/criteria/types';

export async function getScriptLogs(fields: CriteriaFields): Promise<ScriptLogsLine[]> {
  console.log('getScriptLogs', fields);

  const localTestData = {
    data: [
      {
        id: 1,
        timestamp: '2021-09-16T14:00:01',
        type: 'DEBUG',
        scripttype: 'RESTLET',
        owner: 'owner',
        scriptname: 'scriptname1',
        title: 'title1',
        detail: 'detail1',
      },
      {
        id: 2,
        timestamp: '2021-09-16T14:00:02',
        type: 'DEBUG',
        scripttype: 'RESTLET',
        owner: 'owner',
        scriptname: 'scriptname2',
        title: 'title2',
        detail: 'detail2',
      },
    ],
  };
  const urlParams = {
    rows: fields.rows,
    level: fields.level,
    // user: fields.user,
    scripttype: fields.scripttype,
    scriptname: fields.scriptname,
    owner: fields.owner,
    createddate: fields.createddate,
    title: fields.title,
    detail: fields.detail,
  };
  const response = await getData(localTestData, 'scriptLogs', urlParams);
  assertIsScriptLogs(response.data);

  return response.data;
}
