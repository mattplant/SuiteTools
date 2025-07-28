import { Alert } from 'flowbite-react';
import { useInlineMessage } from '../../context/MessageContext.tsx';

export function InlineMessage() {
  const { message, clearMessage } = useInlineMessage();

  if (!message) return null;

  return (
    <Alert color={message.type || 'info'} className="fixed top-4 right-4 z-50 w-96" onDismiss={clearMessage}>
      <div className="flex items-center">
        <span className="ml-3">{message.text}</span>
        <button
          className="ml-auto text-gray-500 hover:text-gray-700"
          onClick={clearMessage}
          aria-label="Close"
        ></button>
      </div>
    </Alert>
  );
}
