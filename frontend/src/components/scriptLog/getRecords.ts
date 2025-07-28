import { getData } from '../../api/api';
import { ScriptLog, assertIsScriptLogs } from './types';
import { CriteriaFields } from '../criteria/types';
import { normalizeArrayResponse } from '../../utils/normalize';

export async function getScriptLogs(fields: CriteriaFields): Promise<ScriptLog[]> {
  let result: ScriptLog[] = [];

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
    levels: fields.levels,
    // user: fields.user,
    scripttypes: fields.scripttypes,
    scriptnames: fields.scriptnames,
    owners: fields.owners,
    createddate: fields.createddate,
    title: fields.title,
    detail: fields.detail,
    timemode: fields.timemode,
    customdatetime: fields.customdatetime ? fields.customdatetime : undefined,
    customduration: fields.customduration ? fields.customduration : undefined,
  };
  const response = await getData(localTestData, 'scriptLogs', urlParams);
  if (response.message) {
    result = [];
  } else {
    result = normalizeArrayResponse(response.data, assertIsScriptLogs);
  }

  return result;
}
