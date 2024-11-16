import { SettingsData } from './types';

type Props = {
  settings: SettingsData;
};

export function SettingsShow({ settings }: Props) {
  return (
    <div id="settings">
      <h2 className="text-xl font-bold text-slate-600">Settings</h2>
      <p>Settings data</p>
      <pre>{JSON.stringify(settings, null, 2)}</pre>
    </div>
  );
}
