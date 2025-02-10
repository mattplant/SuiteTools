import { Button } from 'flowbite-react';
import { Settings } from './types';
import { saveData } from '../../api/api';
import { SavedEndpoint, SavedData, SaveMethod } from '../../api/types';
import { getOptionValues as getIntegrationOptionValues } from '../integration/getOptionValues';
import { getOptionValues as getTokenOptionValues } from '../token/getOptionValues';

type Props = {
  settings: Settings;
};

export function SettingsResult({ settings }: Props) {
  const lastLoginClick = async () => {
    const entityRecords: { type: string; name: string }[] = [];
    // get integrations
    const integrationOptions = await getIntegrationOptionValues(true);
    integrationOptions.forEach((option) => {
      entityRecords.push({
        type: 'integration',
        name: option.text,
      });
    });
    // get tokens
    const tokenOptions = await getTokenOptionValues(true);
    tokenOptions.forEach((option) => {
      entityRecords.push({
        type: 'token',
        name: option.text,
      });
    });
    // make API call
    const responseData: SavedData = await saveData(SavedEndpoint.LASTLOGIN, SaveMethod.POST, entityRecords);
    console.log('lastLoginClick() response', responseData);
  };

  return (
    <>
      <div id="settings">
        <h2 className="text-xl font-bold text-slate-600">Settings</h2>
        <Button onClick={lastLoginClick}>Get Last Login Data</Button>
        {settings.lastLogins && settings.lastLogins.finished ? (
          <p>Last login data fetched at {settings.lastLogins.finished}</p>
        ) : null}
        <p>Settings data</p>
        <pre>{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </>
  );
}
