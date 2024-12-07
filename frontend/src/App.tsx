// TODO move to src/components/App.tsx

import { Outlet } from 'react-router-dom';
import { AppSettingsProvider } from './AppSettingsContext.tsx';
import Header from './components/Header.tsx';

export default function App() {
  return (
    <div className="max-w-7xl mx-auto px-4">
      <AppSettingsProvider>
        <Header />
        <Outlet />
      </AppSettingsProvider>
    </div>
  );
}
