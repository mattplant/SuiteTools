import { putData } from '../../api/api';
import { PutEndpoint, HttpResponse } from '../../api/types';
import { NewSettings } from './types';

export async function saveSettings(data: NewSettings): Promise<HttpResponse> {
  const responseData = await putData(PutEndpoint.SETTINGS, data);

  return responseData;
}
