import { getData } from '../../../../api/api';
import type { NotFound } from '../../../../api/types';
import { JobRunBundle } from '@suiteworks/suitetools-shared';
import type { JobRun } from '@suiteworks/suitetools-shared';

export async function getJobRun(id: number): Promise<JobRun | NotFound> {
  let result;
  const localTestData = {
    data: {
      id: 1,
      name: 'task 1',
    },
  };
  const response = await getData(localTestData, 'jobRun', { id: id });
  if (response.message) {
    result = { message: response.message };
  } else {
    JobRunBundle.assert(response.data);
    // build additional properties
    response.data.urlDetail = `#/jobRun/${response.data.id}`;
    response.data.urlJob = `#/job/${response.data.jobid}`;
    result = response.data;
  }

  return result;
}
