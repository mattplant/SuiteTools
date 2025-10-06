import { Alert } from 'flowbite-react';
import { messageTypeIcon } from '../context/MessageContext';
import { useInlineMessage } from '../../../hooks/useInlineMessage';

export function InlineMessage() {
  const { message, clearMessage } = useInlineMessage();

  if (!message) return null;

  const { text, type = 'info' } = message;
  const icon = messageTypeIcon[type];

  return (
    <Alert color={type} className="fixed top-4 right-4 z-50 w-96" onDismiss={clearMessage}>
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>
        <span className="flex-1">{text}</span>
        <button
          className="ml-auto text-gray-500 hover:text-gray-700"
          onClick={clearMessage}
          aria-label="Close"
        ></button>
      </div>
    </Alert>
  );
}
