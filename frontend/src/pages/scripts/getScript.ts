import { getData } from '../../utils/api/api';
import { Script, assertIsScript } from './types';

// TODO: set dynamically instead of hardcoding
const appScriptUrl = '/app/site/hosting/scriptlet.nl?script=1285&deploy=1';

export async function getScript(id: number): Promise<Script> {
  const localTestData = {
    data: {
      id: 1,
      apiversion: '2.1',
      isinactive: 'F',
      scripttype: 'SCHEDULED',
      name: 'TEST SCRIPT (1)',
      scriptid: 'customscript_idev_test',
      owner: 'Matt Plant (12345)',
      scriptfile: 'idev_SCH_test.js (45678)',
      notifyemails: null,
      description: null,
      urlNs: '/', // not able to access NetSuite from localhost
      urlScript: '/#/script/1', // &action=scripts&id=1',
      urlScriptLogs: '/#/scriptLogs/1', // + '&action=scriptLogs&scriptId=1',
    },
  };
  const response = await getData(localTestData, 'script', { id: id });
  assertIsScript(response.data);

  // build additional properties
  response.data.urlNs = `/app/common/scripting/script.nl?id=${response.data.id}`;
  response.data.urlScript = `${appScriptUrl}#/script/${response.data.id}`;
  response.data.urlScriptLogs = `${appScriptUrl}#/scriptLogs`; //&scriptId=${response.data.id}`;

  return response.data;
}
