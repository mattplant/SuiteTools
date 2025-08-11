import { getData } from '../../../api/api';
import { NotFound } from '../../../api/types';
import { CriteriaFields } from '../../shared/criteria/types';
import { JobBundle } from 'shared';
import type { Jobs } from 'shared';

export async function getJobs(fields: CriteriaFields): Promise<Jobs | NotFound> {
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
    active: fields.active,
  };
  const response = await getData(localTestData, 'jobs', urlParams);
  if (response.message) {
    result = { message: response.message };
  } else {
    JobBundle.assertMany(response.data);
    // assertValidJobs(response.data);
    result = response.data;
  }
  return result;
}
