import { saveData } from '../../api/api';
import { SavedEndpoint, SavedData, SaveMethod } from '../../api/types';
import { NewSettings } from './types';

export async function saveSettings(data: NewSettings): Promise<SavedData> {
  const responseData = await saveData(SavedEndpoint.SETTINGS, SaveMethod.PUT, data);

  return responseData;
}
