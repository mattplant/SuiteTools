import { createHashRouter, RouterProvider, defer } from 'react-router-dom';
import App from './components/App.tsx';
import ErrorPage from './pages/ErrorPage.tsx';
import HomePage from './pages/HomePage.tsx';
// concurrency
import { ConcurrencySummaryPage } from './pages/ConcurrencySummaryPage.tsx';
import { ConcurrencyDetailPage } from './pages/ConcurrencyDetailPage.tsx';
import { ConcurrencyRequestPage } from './pages/ConcurrencyRequestPage.tsx';
// files
import { getFile } from './components/file/getRecord.ts';
import { FilePage } from './pages/FilePage.tsx';
import { FilesPage } from './pages/FilesPage.tsx';
// integrations
import { getIntegration } from './components/integration/getRecord.ts';
import { IntegrationPage } from './pages/IntegrationPage.tsx';
import { IntegrationsPage } from './pages/IntegrationsPage.tsx';
// logins
import { LoginsPage } from './pages/LoginsPage.tsx';
// roles
import { getRole } from './components/role/getRecord.ts';
import { RolePage } from './pages/RolePage.tsx';
import { RolesPage } from './pages/RolesPage.tsx';
// scripts
import { getScript } from './components/script/getRecord.ts';
import { ScriptPage } from './pages/ScriptPage.tsx';
import { ScriptsPage } from './pages/ScriptsPage.tsx';
// script logs
import { getScriptLog } from './components/scriptLog/getRecord.ts';
import { ScriptLogPage } from './pages/ScriptLogPage.tsx';
import { ScriptLogsPage } from './pages/ScriptLogsPage.tsx';
// SOAP logs
import { getSoapLog } from './components/soapLog/getRecord.ts';
import { SoapLogPage } from './pages/SoapLogPage.tsx';
import { SoapLogsPage } from './pages/SoapLogsPage.tsx';
// settings
import { getSettings } from './components/settings/getSettings.ts';
import { SettingsPage } from './pages/SettingsPage.tsx';
// tokens
import { getToken } from './components/token/getRecord.ts';
import { TokenPage } from './pages/TokenPage.tsx';
import { TokensPage } from './pages/TokensPage.tsx';
// users
import { getUser } from './components/user/getRecord.ts';
import { UserPage } from './pages/UserPage.tsx';
import { UsersPage } from './pages/UsersPage.tsx';

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
        path: 'concurrency',
        element: <ConcurrencySummaryPage />,
      },
      {
        path: 'concurrencyDetail/:startDate/:endDate',
        element: <ConcurrencyDetailPage />,
      },
      {
        path: 'concurrencyRequest/:startDate/:endDate',
        element: <ConcurrencyRequestPage />,
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
        path: 'logins',
        element: <LoginsPage />,
      },
      {
        path: 'role/:id',
        element: <RolePage />,
        loader: async ({ params }) => defer({ role: getRole(Number(params.id)) }),
      },
      {
        path: 'roles',
        element: <RolesPage />,
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
        path: 'soapLogs',
        element: <SoapLogsPage />,
      },
      {
        path: 'soapLog/:id',
        element: <SoapLogPage />,
        loader: async ({ params }) => defer({ soapLog: getSoapLog(Number(params.id)) }),
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        loader: async () => defer({ settings: getSettings() }),
      },
      {
        path: 'token/:id',
        element: <TokenPage />,
        loader: async ({ params }) => defer({ token: getToken(Number(params.id)) }),
      },
      {
        path: 'tokens',
        element: <TokensPage />,
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
