import { getData } from '../../../../api/api';
import { NotFound } from '../../../../api/types';
import { JobRun } from 'shared';

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
    JobRun.assert(response.data);
    // build additional properties
    response.data.urlDetail = `#/jobRun/${response.data.id}`;
    response.data.urlJob = `#/job/${response.data.jobid}`;
    result = response.data;
  }

  return result;
}
