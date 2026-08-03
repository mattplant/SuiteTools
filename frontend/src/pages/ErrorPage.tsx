import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import Header from '../components/layout/Header';
import {
  isErrorDevMode,
  isNotFoundError,
  SuiteError,
} from '@suiteworks/suitetools-shared';
import { DevSuiteErrorOverlay } from '../components/shared/errors/DevSuiteErrorOverlay';
import { DefaultFallback } from '../components/shared/errors/DefaultFallback';
import { useAppSettingsContext } from '../hooks/useAppSettingsContext';

/**
 * Normalize loader / Await failures that surface as HTTP-style responses.
 *
 * React Router unwraps `throw new Response(...)` from loaders into an
 * ErrorResponse (`isRouteErrorResponse`). Deferred `<Await>` rejections can
 * still deliver a bare `Response`, so handle both.
 */
function statusTextFor(status: number, statusText: string): string {
  if (statusText) return statusText;
  if (status === 404) return 'Not Found';
  if (status === 400) return 'Bad Request';
  if (status === 500) return 'Internal Server Error';
  return 'Error';
}

/** True for RR ErrorResponse or a Response-like object (avoids fragile instanceof). */
function isResponseLike(error: unknown): error is { status: number; statusText?: string; ok?: boolean } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as { status: unknown }).status === 'number' &&
    ('ok' in error || 'headers' in error || error instanceof Response)
  );
}

function getHttpError(error: unknown): { status: number; statusText: string; detail?: string } | null {
  if (isRouteErrorResponse(error)) {
    const result: { status: number; statusText: string; detail?: string } = {
      status: error.status,
      statusText: statusTextFor(error.status, error.statusText),
    };
    if (typeof error.data === 'string') {
      result.detail = error.data;
    }
    return result;
  }
  if (isResponseLike(error)) {
    return {
      status: error.status,
      statusText: statusTextFor(error.status, error.statusText ?? ''),
    };
  }
  return null;
}

/**
 * ErrorPage component displays error information based on the error type.
 * @returns The rendered error page component.
 */
export default function ErrorPage(): JSX.Element {
  const error = useRouteError();
  const { settings, loading: settingsLoading } = useAppSettingsContext();
  console.error(error);

  // Prefer React state from settings so overlay appears after settings resolve
  // (module flag alone can race the first navigation).
  const showDevOverlay = Boolean(import.meta.env.DEV || settings?.devMode || isErrorDevMode());

  if (error instanceof SuiteError) {
    if (settingsLoading && !showDevOverlay) {
      return (
        <>
          <Header />
          <div className="text-center p-4 text-slate-600">Loading…</div>
        </>
      );
    }

    if (showDevOverlay) {
      return <DevSuiteErrorOverlay error={error} />;
    }

    if (isNotFoundError(error)) {
      return (
        <>
          <Header />
          <div className="text-center p-4">
            <h2 className="text-xl font-bold">Oops! HTTP Error</h2>
            <p>404 Not Found</p>
            <p className="mt-2 text-slate-700">{error.message}</p>
          </div>
        </>
      );
    }
  }

  const httpError = getHttpError(error);
  if (httpError) {
    return (
      <>
        <Header />
        <div className="text-center p-4">
          <h2 className="text-xl font-bold">Oops! HTTP Error</h2>
          <p>
            {httpError.status} {httpError.statusText}
          </p>
          {httpError.detail ? <p className="mt-2 text-slate-700">{httpError.detail}</p> : null}
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
