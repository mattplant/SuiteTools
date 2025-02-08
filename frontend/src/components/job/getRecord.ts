import { getData } from '../../api/api';
import { NotFound } from '../../api/types';
import { Job, assertIsJob } from './types';

export async function getJob(id: number): Promise<Job | NotFound> {
  let result;
  const localTestData = {
    data: {
      id: 1,
      name: 'task 1',
    },
  };
  const response = await getData(localTestData, 'job', { id: id });
  if (response.message) {
    result = { message: response.message };
  } else {
    assertIsJob(response.data);
    // build additional properties
    response.data.urlDetail = `#/job/${response.data.id}`;
    result = response.data;
  }

  return result;
}
