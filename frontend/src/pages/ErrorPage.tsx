import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import Header from '../components/layout/Header';
import { SuiteError } from '@suiteworks/suitetools-shared';
import { DevSuiteErrorOverlay } from '../components/shared/errors/DevSuiteErrorOverlay';
import { DefaultFallback } from '../components/shared/errors/DefaultFallback';

/**
 * ErrorPage component displays error information based on the error type.
 * @returns The rendered error page component.
 */
export default function ErrorPage(): JSX.Element {
  const error = useRouteError();
  console.error(error);

  const isDev = true; // TODO: implement from settings

  if (isDev && error instanceof SuiteError) {
    return <DevSuiteErrorOverlay error={error} />;
  }

  // React Router `Response` errors (e.g., thrown in loaders)
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <Header />
        <div className="text-center p-4">
          <h2 className="text-xl font-bold">Oops! HTTP Error</h2>
          <p>
            {error.status} {error.statusText}
          </p>
        </div>
      </>
    );
  }

  // Generic Error
  if (error instanceof Error) {
    return (
      <>
        <Header />
        <div id="error-page" className="text-center p-4">
          <h2 className="text-xl text-slate-900">Oops! Unexpected Error</h2>
          <p>Something went wrong.</p>
          <p>
            <i>{error.message}</i>
          </p>
        </div>
      </>
    );
  }

  // Unknown fallback
  return <DefaultFallback />;
}
