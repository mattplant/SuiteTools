import { RouterProvider } from 'react-router-dom';
import { Flowbite } from 'flowbite-react';
import { AppSettingsProvider } from './components/shared/context/AppSettingsContext';
import { InlineMessageProvider } from './components/shared/context/MessageContext';
// import { MessageAutoClear } from './components/shared/messages/MessageAutoClear';
import { InlineMessage } from './components/shared/messages/InlineMessage';
import { router } from './router';
import customTheme from './theme/customTheme';

/**
 * The root application component.
 * @returns The rendered app.
 */
export default function App(): React.ReactElement {
  return (
    <Flowbite theme={{ theme: customTheme }}>
      <div className="min-w-[1280px] w-full mx-auto px-4">
        <AppSettingsProvider>
          <InlineMessageProvider>
            {/* <MessageAutoClear /> */}
            <InlineMessage />
            <RouterProvider router={router} />
          </InlineMessageProvider>
        </AppSettingsProvider>
      </div>
    </Flowbite>
  );
}
