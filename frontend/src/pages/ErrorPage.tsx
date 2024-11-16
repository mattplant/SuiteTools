import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
// import Header from "../components/Header.tsx";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return (
        <>
          {/* <Header /> */}
          <div id="error-page" className="text-center p-4">
            <h2 className="text-xl text-slate-900">Oops! Not Found</h2>
            <p>The page you are looking for does not exist.</p>
          </div>
        </>
      );
    }
    return (
      <>
        {/* <Header /> */}
        <div id="error-page" className="text-center p-4">
          <h2 className="text-xl text-slate-900">Oops! {error.status}</h2>
          <p>{error.statusText}</p>
          {error.data?.message && (
            <p>
              <i>{error.data.message}</i>
            </p>
          )}
        </div>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <>
        {/* <Header /> */}
        <div id="error-page" className="text-center p-4">
          <h2 className="text-xl text-slate-900">Oops! Unexpected Error</h2>
          <p>Something went wrong.</p>
          <p>
            <i>{error.message}</i>
          </p>
        </div>
      </>
    );
  } else {
    return <></>;
  }
}
