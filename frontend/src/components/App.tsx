import { Outlet } from 'react-router-dom';
import { Flowbite } from 'flowbite-react';
import { AppSettingsProvider } from './AppSettingsContext.tsx';
import Header from './Header.tsx';
import customTheme from '../theme/customTheme';

export default function App() {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <div className="max-w-7xl mx-auto px-4">
        <AppSettingsProvider>
          <Header />
          <Outlet />
        </AppSettingsProvider>
      </div>
    </Flowbite>
  );
}
