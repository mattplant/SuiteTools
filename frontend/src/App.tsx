import { RouterProvider } from 'react-router-dom';
import { Flowbite } from 'flowbite-react';
import { AppSettingsProvider } from './components/shared/context/AppSettingsContext.tsx';
import { MessageProvider } from './components/shared/context/MessageContext.tsx';
import { router } from './router.tsx';
import customTheme from './theme/customTheme.ts';

export default function App() {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <div className="min-w-[1280px] w-full mx-auto px-4">
        <AppSettingsProvider>
          <MessageProvider>
            <RouterProvider router={router} />
          </MessageProvider>
        </AppSettingsProvider>
      </div>
    </Flowbite>
  );
}
