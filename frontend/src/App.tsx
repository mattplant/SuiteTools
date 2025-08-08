import { RouterProvider } from 'react-router-dom';
import { Flowbite } from 'flowbite-react';
import { AppSettingsProvider } from './components/shared/context/AppSettingsContext';
import { MessageProvider } from './components/shared/context/MessageContext';
// import { MessageAutoClear } from './components/shared/messages/MessageAutoClear';
import { InlineMessage } from './components/shared/messages/InlineMessage';
import { router } from './router.tsx';
import customTheme from './theme/customTheme.ts';

export default function App() {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <div className="min-w-[1280px] w-full mx-auto px-4">
        <AppSettingsProvider>
          <MessageProvider>
            {/* <MessageAutoClear /> */}
            <InlineMessage />
            <RouterProvider router={router} />
          </MessageProvider>
        </AppSettingsProvider>
      </div>
    </Flowbite>
  );
}
