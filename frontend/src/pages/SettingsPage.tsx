// SPDX-License-Identifier: GPL-3.0-or-later

import { useLoaderData } from 'react-router-dom';
import type { NewSettings } from '@suiteworks/suitetools-shared';
import { SettingsResult } from '../components/features/settings/SettingsResult';
import { getSettings, saveSettings } from '../adapters/api/settings';
import { NewSettingsForm } from '../components/features/settings/NewSettingsForm';
import type { SettingsLoaderData } from '../routes/settingsLoader';
import { useAppSettingsContext } from '../hooks/useAppSettingsContext';

/**
 * Renders the settings page with the current settings payload and save form.
 * @returns The rendered settings page component.
 */
export function SettingsPage(): JSX.Element {
  const { settings: loaderSettings } = useLoaderData() as SettingsLoaderData;
  const { settings: contextSettings, applySettings } = useAppSettingsContext();
  // Prefer live context after save; fall back to loader data on first paint.
  const settings = contextSettings ?? loaderSettings;

  async function handleSave(newSettingsData: NewSettings): Promise<void> {
    const devMode = Boolean(newSettingsData.devMode);
    await saveSettings({ ...newSettingsData, devMode });

    // Form values win over a follow-up GET: NetSuite can briefly return stale
    // settings and was wiping the just-saved devMode (forcing a hard refresh).
    let next = {
      ...settings,
      cssUrl: newSettingsData.cssUrl ?? settings.cssUrl,
      jsUrl: newSettingsData.jsUrl ?? settings.jsUrl,
      devMode,
    };
    applySettings(next);

    try {
      const refreshed = await getSettings();
      next = {
        ...refreshed,
        cssUrl: newSettingsData.cssUrl ?? refreshed.cssUrl,
        jsUrl: newSettingsData.jsUrl ?? refreshed.jsUrl,
        devMode,
      };
      applySettings(next);
    } catch (error) {
      console.error('Failed to refresh settings after save:', error);
    }
  }

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Settings</h2>
      <NewSettingsForm
        key={`settings-form-${settings.devMode}-${settings.cssUrl}-${settings.jsUrl}`}
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
