import { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
import { assertIsSettings, assertIsData } from './types';

import { NewSettingsData } from './types';

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
