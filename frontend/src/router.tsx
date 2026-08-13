// SPDX-License-Identifier: GPL-3.0-or-later

import { createHashRouter, RouterProvider } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import ErrorPage from './pages/ErrorPage';
import HomePage from './pages/HomePage';
// concurrency
import { ConcurrencySummaryPage } from './pages/ConcurrencySummaryPage';
import { ConcurrencyDetailPage } from './pages/ConcurrencyDetailPage';
import { ConcurrencyRequestPage } from './pages/ConcurrencyRequestPage';
// files
import { fileLoader } from './routes/fileLoader';
import { FilePage } from './pages/FilePage';
import { FilesPage } from './pages/FilesPage';
// integrations
import { integrationLoader } from './routes/integrationLoader';
import { IntegrationPage } from './pages/IntegrationPage';
import { IntegrationsPage } from './pages/IntegrationsPage';
// jobs
import { jobLoader } from './routes/jobLoader';
import { JobPage } from './pages/JobPage';
import { JobsPage } from './pages/JobsPage';
// jobRuns
import { jobRunLoader } from './routes/jobRunLoader';
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
import { scriptLoader } from './routes/scriptLoader';
import { ScriptPage } from './pages/ScriptPage';
import { ScriptsPage } from './pages/ScriptsPage';
// script logs
import { scriptLogLoader } from './routes/scriptLogLoader';
import { ScriptLogPage } from './pages/ScriptLogPage';
import { ScriptLogsPage } from './pages/ScriptLogsPage';
// SOAP logs
import { soapLogLoader } from './routes/soapLogLoader';
import { SoapLogPage } from './pages/SoapLogPage';
import { SoapLogsPage } from './pages/SoapLogsPage';
// settings
import { settingsLoader } from './routes/settingsLoader';
import { SettingsPage } from './pages/SettingsPage';
// tokens
import { tokenLoader } from './routes/tokenLoader';
import { TokenPage } from './pages/TokenPage';
import { TokensPage } from './pages/TokensPage';
// users
import { userLoader } from './routes/userLoader';
import { UserPage } from './pages/UserPage';
import { UsersPage } from './pages/UsersPage';

export const router = createHashRouter([
  {
    path: '/',
    // Layout stays mounted on child route errors so header/footer remain visible
    // under the floating DevSuiteErrorOverlay (see ErrorPage).
    element: <AppLayout />,
    children: [
      {
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
            loader: fileLoader,
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
            loader: integrationLoader,
          },
          {
            path: 'integrations',
            element: <IntegrationsPage />,
          },
          {
            path: 'job/:id',
            element: <JobPage />,
            loader: jobLoader,
          },
          {
            path: 'jobs',
            element: <JobsPage />,
          },
          {
            path: 'jobRun/:id',
            element: <JobRunPage />,
            loader: jobRunLoader,
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
            loader: scriptLoader,
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
            loader: soapLogLoader,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
            loader: settingsLoader,
          },
          {
            path: 'token/:id',
            element: <TokenPage />,
            loader: tokenLoader,
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
    ],
  },
]);

/**
 * Provides the application's router.
 * @returns The router provider component.
 */
export default function Routes(): React.JSX.Element {
  return <RouterProvider router={router} />;
}
