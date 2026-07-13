import { useLoaderData } from 'react-router-dom';
import type { NewSettings } from '@suiteworks/suitetools-shared';
import { SettingsResult } from '../components/features/settings/SettingsResult';
import { saveSettings } from '../adapters/api/settings';
import { NewSettingsForm } from '../components/features/settings/NewSettingsForm';
import type { SettingsLoaderData } from '../routes/settingsLoader';

/**
 * Renders the settings page with the current settings payload and save form.
 * @returns The rendered settings page component.
 */
export function SettingsPage(): JSX.Element {
  const { settings } = useLoaderData() as SettingsLoaderData;

  async function handleSave(newSettingsData: NewSettings): Promise<void> {
    await saveSettings(newSettingsData);
  }

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Settings</h2>
      <NewSettingsForm
        defaultValues={{
          devMode: settings.devMode,
          cssUrl: settings.cssUrl,
          jsUrl: settings.jsUrl,
        }}
        onSave={handleSave}
      />
      <SettingsResult settings={settings} />
    </div>
  );
}
