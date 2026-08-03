import { RouterProvider } from 'react-router-dom';
import { Flowbite } from 'flowbite-react';
import { AppSettingsProvider } from './components/shared/context/AppSettingsContext';
import { DevErrorOverlayProvider } from './components/shared/context/DevErrorOverlayContext';
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
      <AppSettingsProvider>
        <DevErrorOverlayProvider>
          <InlineMessageProvider>
            {/* <MessageAutoClear /> */}
            <InlineMessage />
            <RouterProvider router={router} />
          </InlineMessageProvider>
        </DevErrorOverlayProvider>
      </AppSettingsProvider>
    </Flowbite>
  );
}
