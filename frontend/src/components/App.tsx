import { Outlet } from 'react-router-dom';
import { AppSettingsProvider } from './AppSettingsContext.tsx';
import Header from './Header.tsx';

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
