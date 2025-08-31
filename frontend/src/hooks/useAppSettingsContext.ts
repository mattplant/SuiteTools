import { useContext } from 'react';
import { AppSettingsContext } from '../components/shared/context/AppSettingsContext';

/**
 * Custom hook to access the AppSettingsContext.
 * @returns The current value of AppSettingsContext.
 */
export function useAppSettingsContext(): React.ContextType<typeof AppSettingsContext> {
  return useContext(AppSettingsContext);
}
