import { getData } from '../../../api/api';
import { NotFound } from '../../../api/types';
import { JobRun, assertIsJobRuns } from './types';
import { CriteriaFields } from '../../criteria/types';

export async function getJobRuns(fields: CriteriaFields): Promise<JobRun[] | NotFound> {
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
  const response = await getData(localTestData, 'jobRuns', urlParams);
  if (response.message) {
    result = { message: response.message };
  } else {
    assertIsJobRuns(response.data);
    result = response.data;
  }

  return result;
}
