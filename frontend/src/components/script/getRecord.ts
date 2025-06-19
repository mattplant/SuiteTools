import { getData } from '../../api/api';
import { NotFound } from '../../api/types';
import { Script, assertIsScript } from './types';

export async function getScript(id: number): Promise<Script | NotFound> {
  let result;
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
    },
  };
  const response = await getData(localTestData, 'script', { id: id });
  if (response.message) {
    result = { message: response.message };
  } else {
    assertIsScript(response.data);
    // build additional properties
    response.data.urlNs = `/app/common/scripting/script.nl?id=${response.data.id}`;
    response.data.urlDetail = `#/script/${response.data.id}`;
    response.data.urlScriptLogs = `#/scriptLogs/${response.data.id}`;
    result = response.data;
  }

  return result;
}
