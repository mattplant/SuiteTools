import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getSettings } from '../../features/settings/getSettings';
import type { Settings } from '../../features/settings/types';

type AppContextSettingsType = {
  settings: undefined | Settings;
  loading: boolean;
};

const initialState: AppContextSettingsType = {
  settings: undefined,
  loading: true,
};

export const AppSettingsContext = createContext<AppContextSettingsType>({ ...initialState });

type Props = {
  children: ReactNode;
};

/**
 * Provides application settings context to its children.
 * @param root0 - The props object.
 * @param root0.children - The child components.
 * @returns The provider component wrapping its children.
 */
export function AppSettingsProvider({ children }: Props): JSX.Element {
  const [settings, setSettings] = useState<Settings | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async (): Promise<void> => {
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
