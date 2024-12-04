import { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
import { assertIsSettings } from './getSettingsData';
import { SettingsData, NewSettingsData } from './types';
import { SettingsShow } from './SettingsShow';
import { saveSettings } from './saveSettings';
import { NewSettingsForm } from './NewSettingsForm';

export function SettingsPage() {
  const data = useLoaderData();
  assertIsData(data);
  async function handleSave(newSettingsData: NewSettingsData) {
    await saveSettings(newSettingsData);
  }

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Settings</h2>
      <NewSettingsForm onSave={handleSave} />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.settings}>
          {(settings) => {
            assertIsSettings(settings);
            return <SettingsShow settings={settings} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  settings: SettingsData;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('settings' in data)) {
    throw new Error('Data does not contain settings');
  }
}
