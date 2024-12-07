import { createHashRouter, RouterProvider, defer } from 'react-router-dom';
import App from './App.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import HomePage from './pages/HomePage.tsx';
// files
import { getFile } from './pages/files/getFile.ts';
import { FilePage } from './pages/files/FilePage.tsx';
import { FilesPage } from './pages/files/FilesPage.tsx';
// integrations
import { getIntegration } from './pages/integrations/getIntegration.ts';
import { IntegrationPage } from './pages/integrations/IntegrationPage.tsx';
import { IntegrationsPage } from './pages/integrations/IntegrationsPage.tsx';
// scripts
import { getScript } from './pages/scripts/getScript.ts';
import { ScriptPage } from './pages/scripts/ScriptPage.tsx';
import { ScriptsPage } from './pages/scripts/ScriptsPage.tsx';
// script logs
import { getScriptLog } from './pages/scriptLogs/getScriptLog.ts';
import { ScriptLogPage } from './pages/scriptLogs/ScriptLogPage.tsx';
import { ScriptLogsPage } from './pages/scriptLogs/ScriptLogsPage.tsx';
// settings
import { getSettingsData } from './pages/settings/getSettingsData.ts';
import { SettingsPage } from './pages/settings/SettingsPage.tsx';
// users
import { getUser } from './pages/users/getUser.ts';
import { UserPage } from './pages/users/UserPage.tsx';
import { UsersPage } from './pages/users/UsersPage.tsx';

const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'file/:id',
        element: <FilePage />,
        loader: async ({ params }) => defer({ file: getFile(Number(params.id)) }),
      },
      {
        path: 'files',
        element: <FilesPage />,
      },
      {
        path: 'integration/:id',
        element: <IntegrationPage />,
        loader: async ({ params }) => defer({ integration: getIntegration(Number(params.id)) }),
      },
      {
        path: 'integrations',
        element: <IntegrationsPage />,
      },
      {
        path: 'script/:id',
        element: <ScriptPage />,
        loader: async ({ params }) => defer({ script: getScript(Number(params.id)) }),
      },
      {
        path: 'scripts',
        element: <ScriptsPage />,
      },
      {
        path: 'scriptLog/:id',
        element: <ScriptLogPage />,
        loader: async ({ params }) => defer({ scriptLog: getScriptLog(Number(params.id)) }),
      },
      {
        path: 'scriptLogs/:script?',
        element: <ScriptLogsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        loader: async () => defer({ settings: getSettingsData() }),
      },
      {
        path: 'user/:id',
        element: <UserPage />,
        loader: async ({ params }) => defer({ user: getUser(Number(params.id)) }),
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
