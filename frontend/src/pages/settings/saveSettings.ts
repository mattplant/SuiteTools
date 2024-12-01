import { saveData } from '../../api/api';
import { SavedEndpoint, SavedData, SaveMethod } from '../../api/types';
import { NewSettingsData } from './types';

export async function saveSettings(data: NewSettingsData): Promise<SavedData> {
  console.log('saveSettings', data);

  // TODO - I should probably use POST instead of PUT
  const responseData = await saveData(SavedEndpoint.SETTINGS, SaveMethod.PUT, data);

  return responseData;
}
