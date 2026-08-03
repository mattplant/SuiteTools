// SPDX-License-Identifier: GPL-3.0-or-later

import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { isNotFoundError, SuiteError } from '@suiteworks/suitetools-shared';
import { DevSuiteErrorOverlay } from '../components/shared/errors/DevSuiteErrorOverlay';
import { DefaultFallback } from '../components/shared/errors/DefaultFallback';
import { useShowDevErrorOverlay } from '../hooks/useShowDevErrorOverlay';

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
 * Route-level error UI rendered inside {@link AppLayout} (header/footer stay mounted).
 * In error-dev mode, SuiteErrors use a floating {@link DevSuiteErrorOverlay} portal.
 */
export default function ErrorPage(): JSX.Element {
  const error = useRouteError();
  const navigate = useNavigate();
  const showDevOverlay = useShowDevErrorOverlay();
  console.error(error);

  const dismissOverlay = (): void => {
    // Prefer back to the previous screen (e.g. jobs list); fall back to home.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (error instanceof SuiteError) {
    if (showDevOverlay) {
      return (
        <>
          <div className="mx-auto mt-6 max-w-xl text-center text-slate-600">
            <p className="text-lg font-medium text-slate-800">Developer error</p>
            <p className="mt-2">Details are in the overlay. Close it to go back.</p>
          </div>
          <DevSuiteErrorOverlay error={error} onDismiss={dismissOverlay} />
        </>
      );
    }

    if (isNotFoundError(error)) {
      return (
        <div className="text-center p-4">
          <h2 className="text-xl font-bold">Oops! HTTP Error</h2>
          <p>404 Not Found</p>
          <p className="mt-2 text-slate-700">{error.message}</p>
        </div>
      );
    }
  }

  const httpError = getHttpError(error);
  if (httpError) {
    return (
      <div className="text-center p-4">
        <h2 className="text-xl font-bold">Oops! HTTP Error</h2>
        <p>
          {httpError.status} {httpError.statusText}
        </p>
        {httpError.detail ? <p className="mt-2 text-slate-700">{httpError.detail}</p> : null}
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div id="error-page" className="text-center p-4">
        <h2 className="text-xl text-slate-900">Oops! Unexpected Error</h2>
        <p>Something went wrong.</p>
        <p>
          <i>{error.message}</i>
        </p>
      </div>
    );
  }

  return <DefaultFallback />;
}
