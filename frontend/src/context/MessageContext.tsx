import { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';

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

const InlineMessageContext = createContext<InlineMessageContextType>({
  message: null,
  setMessage: () => {},
  clearMessage: () => {},
});

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<InlineMessage | null>(null);

  const clearMessage = () => setMessage(null);
  const MESSAGE_TIMEOUT_MS = 4000;

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, MESSAGE_TIMEOUT_MS);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <InlineMessageContext.Provider value={{ message, setMessage, clearMessage }}>
      {children}
    </InlineMessageContext.Provider>
  );
};

export const useInlineMessage = () => {
  const context = useContext(InlineMessageContext);
  if (!context) {
    throw new Error('useInlineMessage must be used within a MessageProvider');
  }
  return context;
};
