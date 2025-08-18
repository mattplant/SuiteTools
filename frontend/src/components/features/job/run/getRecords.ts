import { getData } from '../../../../api/api';
import type { NotFound } from '../../../../api/types';
import type { CriteriaFields } from '../../../shared/criteria/types';
import { JobRunBundle } from '@suiteworks/suitetools-shared';
import type { JobRuns } from '@suiteworks/suitetools-shared';

export async function getJobRuns(fields: CriteriaFields): Promise<JobRuns | NotFound> {
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
    JobRunBundle.assertMany(response.data);
    result = response.data;
  }

  return result;
}
