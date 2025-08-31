import { useContext } from 'react';
import { InlineMessageContext } from '../components/shared/context/MessageContext';

export function useInlineMessage() {
  const context = useContext(InlineMessageContext);
  if (!context) {
    throw new Error('useInlineMessage must be used within an InlineMessageProvider');
  }
  return context;
}
