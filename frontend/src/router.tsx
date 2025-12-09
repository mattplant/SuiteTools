// SPDX-License-Identifier: GPL-3.0-or-later

import { createHashRouter, RouterProvider, defer } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
// concurrency
import { ConcurrencySummaryPage } from './pages/ConcurrencySummaryPage';
import { ConcurrencyDetailPage } from './pages/ConcurrencyDetailPage';
import { ConcurrencyRequestPage } from './pages/ConcurrencyRequestPage';
// files
import { getFile } from './components/features/file/getRecord';
import { FilePage } from './pages/FilePage';
import { FilesPage } from './pages/FilesPage';
// integrations
import { getIntegration } from './components/features/integration/getRecord';
import { IntegrationPage } from './pages/IntegrationPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
// jobs
import { getJob } from './components/features/job/getRecord';
import { JobPage } from './pages/JobPage';
import { JobsPage } from './pages/JobsPage';
// jobRuns
import { getJobRun } from './components/features/job/run/getRecord';
import { JobRunPage } from './pages/JobRunPage';
import { JobRunsPage } from './pages/JobRunsPage';
// license
import License from './pages/License';
// logins
import { LoginsPage } from './pages/LoginsPage';
// roles
import { roleLoader } from './routes/roleLoader';
import { RolePage } from './pages/RolePage';
import { RolesPage } from './pages/RolesPage';
// scripts
import { getScript } from './components/features/script/getRecord';
import { ScriptPage } from './pages/ScriptPage';
import { ScriptsPage } from './pages/ScriptsPage';
// script logs
import { scriptLogLoader } from './routes/scriptLogLoader';
import { ScriptLogPage } from './pages/ScriptLogPage';
import { ScriptLogsPage } from './pages/ScriptLogsPage';
// SOAP logs
import { getSoapLog } from './components/features/soapLog/getRecord';
import { SoapLogPage } from './pages/SoapLogPage';
import { SoapLogsPage } from './pages/SoapLogsPage';
// settings
import { getSettings } from './components/features/settings/getSettings';
import { SettingsPage } from './pages/SettingsPage';
// tokens
import { getToken } from './components/features/token/getRecord';
import { TokenPage } from './pages/TokenPage';
import { TokensPage } from './pages/TokensPage';
// users
import { userLoader } from './routes/userLoader';
import { UserPage } from './pages/UserPage';
import { UsersPage } from './pages/UsersPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
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
        path: 'concurrencyRequest/:startDate/:endDate/:peakConcurrency?/:peakConcurrencyTime?',
        element: <ConcurrencyRequestPage />,
      },
      {
        path: 'file/:id',
        element: <FilePage />,
        loader: async ({ params }): Promise<ReturnType<typeof defer>> => defer({ file: getFile(Number(params.id)) }),
      },
      {
        path: 'files',
        element: <FilesPage />,
      },
      {
        path: 'licenses',
        element: <License />,
      },
      {
        path: 'integration/:id',
        element: <IntegrationPage />,
        loader: async ({ params }): Promise<ReturnType<typeof defer>> =>
          defer({ integration: getIntegration(Number(params.id)) }),
      },
      {
        path: 'integrations',
        element: <IntegrationsPage />,
      },
      {
        path: 'job/:id',
        element: <JobPage />,
        loader: async ({ params }): Promise<Awaited<ReturnType<typeof getJob>>> => await getJob(Number(params.id)),
      },
      {
        path: 'jobs',
        element: <JobsPage />,
      },
      {
        path: 'jobRun/:id',
        element: <JobRunPage />,
        loader: async ({ params }): Promise<ReturnType<typeof defer>> =>
          defer({ jobRun: getJobRun(Number(params.id)) }),
      },
      {
        path: 'jobRuns',
        element: <JobRunsPage />,
      },
      {
        path: 'logins',
        element: <LoginsPage />,
      },
      {
        path: 'role/:id',
        element: <RolePage />,
        loader: roleLoader,
      },
      {
        path: 'roles',
        element: <RolesPage />,
      },
      {
        path: 'script/:id',
        element: <ScriptPage />,
        loader: async ({ params }): Promise<ReturnType<typeof defer>> =>
          defer({ script: getScript(Number(params.id)) }),
      },
      {
        path: 'scripts',
        element: <ScriptsPage />,
      },
      {
        path: 'scriptLog/:id',
        element: <ScriptLogPage />,
        loader: scriptLogLoader,
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
        loader: async ({ params }): Promise<ReturnType<typeof defer>> =>
          defer({ soapLog: getSoapLog(Number(params.id)) }),
      },
      {
        path: 'settings',
        element: <SettingsPage />,
        loader: async (): Promise<ReturnType<typeof defer>> => defer({ settings: getSettings() }),
      },
      {
        path: 'token/:id',
        element: <TokenPage />,
        loader: async ({ params }): Promise<ReturnType<typeof defer>> => defer({ token: getToken(Number(params.id)) }),
      },
      {
        path: 'tokens',
        element: <TokensPage />,
      },
      {
        path: 'user/:id',
        element: <UserPage />,
        loader: userLoader,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
    ],
  },
]);

/**
 * Provides the application's router.
 * @returns The router provider component.
 */
export default function Routes(): JSX.Element {
  return <RouterProvider router={router} />;
}
