// SPDX-License-Identifier: GPL-3.0-or-later

import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { getSettings } from '../../../adapters/api/settings';
import { setErrorDevMode, type Settings } from '@suiteworks/suitetools-shared';

type AppContextSettingsType = {
  settings: undefined | Settings;
  loading: boolean;
  /** Apply settings locally (e.g. after save) and sync error-dev mode. */
  applySettings: (next: Settings) => void;
  /** Re-fetch settings from the API. */
  refreshSettings: () => Promise<void>;
};

const noopApply = (): void => undefined;
const noopRefresh = async (): Promise<void> => undefined;

const initialState: AppContextSettingsType = {
  settings: undefined,
  loading: true,
  applySettings: noopApply,
  refreshSettings: noopRefresh,
};

export const AppSettingsContext = createContext<AppContextSettingsType>({ ...initialState });

type Props = {
  children: ReactNode;
};

function syncErrorDevMode(devMode: boolean): void {
  // Vite DEV always enables overlays locally; account setting controls Sandbox/prod builds.
  setErrorDevMode(Boolean(import.meta.env.DEV || devMode));
}

/**
 * Provides application settings context to its children.
 * @param root0 - The props object.
 * @param root0.children - The child components.
 * @returns The provider component wrapping its children.
 */
export function AppSettingsProvider({ children }: Props): React.JSX.Element {
  const [settings, setSettings] = useState<Settings | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const applySettings = useCallback((next: Settings) => {
    setSettings(next);
    syncErrorDevMode(next.devMode);
  }, []);

  const refreshSettings = useCallback(async () => {
    const data = await getSettings();
    applySettings(data);
  }, [applySettings]);

  useEffect(() => {
    let ignore = false;

    const fetchSettings = async (): Promise<void> => {
      try {
        const data = await getSettings();
        if (!ignore) {
          applySettings(data);
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    fetchSettings();
    return (): void => {
      ignore = true;
    };
  }, [applySettings]);

  const value = useMemo(
    () => ({ settings, loading, applySettings, refreshSettings }),
    [settings, loading, applySettings, refreshSettings],
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}
