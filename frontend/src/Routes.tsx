import { createHashRouter, RouterProvider, defer } from 'react-router-dom';
import App from './components/App.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import HomePage from './pages/HomePage.tsx';
import { FilesPage } from './pages/files/FilesPage.tsx';
import { ScriptLogsPage } from './pages/scriptLogs/ScriptLogsPage.tsx';
import { ScriptsPage } from './pages/scripts/ScriptsPage.tsx';
// settings
import { SettingsPage } from './pages/settings/SettingsPage.tsx';
import { getSettingsData } from './pages/settings/getSettingsData.ts';
// system
import { SystemPage } from './pages/system/SystemPage.tsx';
import { getSystemData } from './pages/system/getSystemData.ts';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    loader: async () => defer({ system: getSystemData() }),
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'files',
        element: <FilesPage />,
      },
      {
        path: 'system',
        element: <SystemPage />,
        loader: async () => defer({ system: getSystemData() }),
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        loader: async () => defer({ settings: getSettingsData() }),
      },
      {
        path: 'scriptLogs',
        element: <ScriptLogsPage />,
      },
      {
        path: 'scripts',
        element: <ScriptsPage />,
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
