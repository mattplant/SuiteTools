import { NotFound } from '../../api/types';
import { Login, assertIsLogins } from './types';

export async function getLoginFromResults(id: number, lines?: unknown[]): Promise<Login | NotFound> {
  let result;
  if (lines) {
    assertIsLogins(lines);
    const record = lines.find((line) => line.id === id);
    console.log('getLoginFromResults() record', record);
    result = record ? record : { message: `Login record with id ${id} not found` };
  } else {
    result = { message: 'No login records found' };
  }

  return result;
}
