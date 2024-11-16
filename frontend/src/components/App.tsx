import { Suspense } from 'react';
import { useLoaderData, Await } from 'react-router-dom';
import { assertIsSystemData, assertIsData } from '../pages/system/types';

import { Outlet } from 'react-router-dom';
import Header from './Header.tsx';

type State = {
  user: undefined | string;
};
const initialState: State = {
  user: undefined,
};

export default function App() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <Suspense fallback={<Header user={initialState.user} />}>
        <Await resolve={data.system}>
          {(system) => {
            assertIsSystemData(system);
            return <Header user={system.userName} />;
          }}
        </Await>
      </Suspense>
      <Outlet />
    </div>
  );
}
