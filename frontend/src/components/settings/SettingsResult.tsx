import { Settings } from './types';

type Props = {
  settings: Settings;
};

export function SettingsResult({ settings }: Props) {
  // const getLastLoginData = async () => {
  //   console.log('getLastLoginData() iniitiated');

  //   // TODO update this to handle the get last login data

  // };

  return (
    <>
      {/* <button onClick={getLastLoginData}>Get Last Login Data</button>; */}
      <div id="settings">
        <h2 className="text-xl font-bold text-slate-600">Settings</h2>
        <p>Settings data</p>
        <pre>{JSON.stringify(settings, null, 2)}</pre>
      </div>
    </>
  );
}
