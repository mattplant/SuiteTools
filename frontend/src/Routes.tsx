import { createHashRouter, RouterProvider, defer } from 'react-router-dom';
import App from './components/App.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import HomePage from './pages/HomePage.tsx';
import { FilesPage } from './pages/files/FilesPage.tsx';
// scripts
import { getScript } from './pages/scripts/getScript.ts';
import { ScriptPage } from './pages/scripts/ScriptPage.tsx';
import { ScriptsPage } from './pages/scripts/ScriptsPage.tsx';
// script logs
import { ScriptLogsPage } from './pages/scriptLogs/ScriptLogsPage.tsx';
// users
import { UsersPage } from './pages/users/UsersPage.tsx';
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

    // TODO - do I still need to load the system data here?
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
        path: 'scripts',
        element: <ScriptsPage />,
      },
      {
        path: 'script/:id',
        element: <ScriptPage />,
        loader: async ({ params }) => {
          // TODO either use the defer like above or the await getScript() to get the script data
          const { id } = params;
          console.log('id =', id);
          // defer({ script: getScript(Number(id)) });
          const script = await getScript(Number(id));
          return { script };
        },
      },
      {
        path: 'scriptLogs',
        element: <ScriptLogsPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
