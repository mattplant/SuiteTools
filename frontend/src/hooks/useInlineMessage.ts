import { useContext } from 'react';
import type { InlineMessageContextType } from '../components/shared/context/MessageContext';
import { InlineMessageContext } from '../components/shared/context/MessageContext';

/** Access the inline message context; must be used under InlineMessageProvider. */
export function useInlineMessage(): InlineMessageContextType {
  const context = useContext(InlineMessageContext);
  if (!context) {
    throw new Error('useInlineMessage must be used within an InlineMessageProvider');
  }
  return context;
}
