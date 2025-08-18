import { getData } from '../../../api/api';
import type { NotFound } from '../../../api/types';
import { JobBundle } from '@suiteworks/suitetools-shared';
import type { Job } from '@suiteworks/suitetools-shared';

export async function getJob(id: number): Promise<Job | NotFound> {
  let result;
  const localTestData = {
    data: {
      id: 1,
      name: 'Recent Script Errors',
      isinactive: false,
      description:
        'The job notifies user of recent errors (Error, Emergency, System) across all script execution logs.',
      config: '',
    },
  };
  const response = await getData(localTestData, 'job', { id: id });
  if (response.message) {
    result = { message: response.message };
  } else {
    JobBundle.assert(response.data);
    // build additional properties
    response.data.urlDetail = `#/job/${response.data.id}`;
    result = response.data;
  }

  return result;
}
