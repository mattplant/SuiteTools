import { getData } from '../../api/api';
import { NotFound } from '../../api/types';
import { Job, assertIsJobs } from './types';
import { CriteriaFields } from '../criteria/types';

export async function getJobs(fields: CriteriaFields): Promise<Job[] | NotFound> {
  let result;
  const localTestData = {
    data: [
      {
        id: 1,
        name: 'task 1',
      },
    ],
  };

  const urlParams = {
    rows: fields.rows,
  };
  const response = await getData(localTestData, 'jobs', urlParams);
  if (response.message) {
    result = { message: response.message };
  } else {
    assertIsJobs(response.data);
    result = response.data;
  }
  return result;
}
