import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { getSettings } from '../../features/settings/getSettings.ts';
import { Settings } from '../../features/settings/types.ts';

type AppContextSettingsType = {
  settings: undefined | Settings;
  loading: boolean;
};
const initialState: AppContextSettingsType = {
  settings: undefined,
  loading: true,
};
const AppSettingsContext = createContext<AppContextSettingsType>({ ...initialState });

type Props = {
  children: ReactNode;
};
export function AppSettingsProvider({ children }: Props) {
  const [settings, setSettings] = useState(Object);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return <AppSettingsContext.Provider value={{ settings, loading }}>{children}</AppSettingsContext.Provider>;
}

export const useAppSettingsContext = () => useContext(AppSettingsContext);
