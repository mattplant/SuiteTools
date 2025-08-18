// TODO: change this file to getRecord unless there is a reason to keep it as getRecordFromResults

import { NotFound } from '../../../api/types';
import { LoginBundle } from '@suiteworks/suitetools-shared';
import type { Login } from '@suiteworks/suitetools-shared';

export async function getLoginFromResults(id: number, lines?: readonly unknown[]): Promise<Login | NotFound> {
  let result;
  if (lines) {
    LoginBundle.assertMany(lines);
    const record = lines.find((line) => line.id === id);
    console.log('getLoginFromResults() record', record);
    result = record ? record : { message: `Login record with id ${id} not found` };
  } else {
    result = { message: 'No login records found' };
  }

  return result;
}
