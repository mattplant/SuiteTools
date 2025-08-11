import { getData } from '../../../../api/api';
import { NotFound } from '../../../../api/types';
import { JobRun } from 'shared';
import { CriteriaFields } from '../../../shared/criteria/types';

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
    job: fields.job,
    completed: fields.completed,
  };
  const response = await getData(localTestData, 'jobRuns', urlParams);
  if (response.message) {
    result = { message: response.message };
  } else {
    JobRun.array.assert(response.data);
    result = response.data;
  }

  return result;
}
