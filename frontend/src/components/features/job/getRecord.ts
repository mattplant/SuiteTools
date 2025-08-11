import { getData } from '../../../api/api';
import { NotFound } from '../../../api/types';
import { JobBundle } from 'shared';
import type { Job } from 'shared';

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
    // try {
    //   const base = JobBundle.parse(response.data); // or JobBundle.assert(response.data) then use response.data
    //   // build additional properties
    //   // const job: Job = { ...base, urlDetail: `#/job/${base.id}` };

    //   let job: Job = { ...base, urlDetail: `#/job/${base.id}` };
    //   job.urlDetail = `#/job/${base.id}`;
    //   result = job;
    // } catch {
    //   return { message: 'Invalid job payload' };
    // }
  }

  return result;
}
