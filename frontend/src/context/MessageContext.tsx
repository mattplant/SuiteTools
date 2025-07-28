import { createContext, useContext, useState } from 'react';

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

const InlineMessageContext = createContext<InlineMessageContextType>({
  message: null,
  setMessage: () => {},
  clearMessage: () => {},
});

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [message, setMessage] = useState<InlineMessage | null>(null);

  const clearMessage = () => setMessage(null);

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
