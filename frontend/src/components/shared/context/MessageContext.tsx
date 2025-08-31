import { createContext, useState, useEffect, ReactNode } from 'react';

type MessageType = 'success' | 'error' | 'info' | 'warning';

type InlineMessage = {
  text: string;
  type?: MessageType;
};

type InlineMessageContextType = {
  message: InlineMessage | null;
  setMessage: (msg: InlineMessage | null) => void;
  clearMessage: () => void;
};

export const InlineMessageContext = createContext<InlineMessageContextType | undefined>(undefined);

export const messageTypeIcon: Record<MessageType, React.ReactNode> = {
  success: (
    <span role="img" aria-label="success">
      ✅
    </span>
  ),
  error: (
    <span role="img" aria-label="error">
      ❌
    </span>
  ),
  info: (
    <span role="img" aria-label="info">
      ℹ️
    </span>
  ),
  warning: (
    <span role="img" aria-label="warning">
      ⚠️
    </span>
  ),
};

type Props = {
  children: ReactNode;
};

export function InlineMessageProvider({ children }: Props) {
  const [message, setMessage] = useState<InlineMessage | null>(null);

  const clearMessage = () => setMessage(null);
  const MESSAGE_TIMEOUT_MS = 4000;

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, MESSAGE_TIMEOUT_MS);
      return (): void => clearTimeout(timer);
    }
  }, [message]);

  return (
    <InlineMessageContext.Provider value={{ message, setMessage, clearMessage }}>
      {children}
    </InlineMessageContext.Provider>
  );
}
