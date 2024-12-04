import { createContext, ReactNode, useState, useEffect, useContext } from 'react';
import { getSettingsData } from './pages/settings/getSettingsData.ts';
import { SettingsData } from './pages/settings/types';

type AppContextSettingsType = {
  settings: undefined | SettingsData;
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
        const data = await getSettingsData();
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
