import { getData } from '../../../api/api';
import type { NotFound } from '../../../api/types';
import type { CriteriaFields } from '../../shared/criteria/types';
import { JobBundle } from '@suiteworks/suitetools-shared';
import type { Jobs } from '@suiteworks/suitetools-shared';

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
    result = response.data;
  }

  return result;
}
