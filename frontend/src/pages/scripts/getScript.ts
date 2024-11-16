import { getData } from '../../utils/api';
import { Script, assertIsScript } from './types';

export async function getScript(id: number): Promise<Script> {
  const localTestData = {
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
  };
  const data = await getData(localTestData, 'script', { id: id });
  assertIsScript(data);

  return data;
}
