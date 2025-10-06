// src/components/shared/messages/MessageAutoClear.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInlineMessage } from '../../../hooks/useInlineMessage';

export function MessageAutoClear() {
  const { clearMessage } = useInlineMessage();
  const location = useLocation();

  // Debugging: Log the current message context
  // This can help ensure that the context is being used correctly
  const ctx = useInlineMessage();
  console.log('MessageAutoClear message context:', ctx);

  useEffect(() => {
    // Clear any existing inline message on every route change
    // if (currentMessage?.type !== 'error') {
    clearMessage();
    // }
  }, [location.pathname, clearMessage]);

  return null;
}
