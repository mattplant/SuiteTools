import { useRouteError } from 'react-router-dom';
import Header from '../components/layout/Header.tsx';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

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
  } else {
    return <></>;
  }
}
