import { getData } from '../../../api/api';
import { ScriptLog } from 'shared';
import { CriteriaFields } from '../../shared/criteria/types';
import { ScriptLogs } from 'shared';

export async function getScriptLogs(fields: CriteriaFields): Promise<ScriptLogs> {
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

  try {
    const response = await getData(localTestData, 'scriptLogs', urlParams);
    // const { validLogs, errorCount, errorDetails } = parseScriptLogsWithErrors(response.data);

    // if (errorCount > 0) {
    //   console.warn(`Skipped ${errorCount} invalid script log entries`);
    //   errorDetails.forEach((msg) => console.warn(msg));
    // }

    // return validLogs;
    return ScriptLog.array.parse(response.data);
  } catch (err) {
    console.error('Failed to fetch or parse script logs:', err);
    return [];
  }
}
