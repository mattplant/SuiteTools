import { Settings } from './types';

type Props = {
  settings: Settings;
};

export function SettingsResult({ settings }: Props) {
  return (
    <>
      <div id="settings">
        <h2 className="text-xl font-bold text-slate-600">Settings</h2>
        {settings.lastLogins && settings.lastLogins.finished ? (
          <p>Last login data fetched at {settings.lastLogins.finished}</p>
        ) : null}
        <p>Settings data</p>
        <pre>{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </>
  );
}
