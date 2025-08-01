import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInlineMessage } from '../../context/MessageContext.tsx';

export function MessageAutoClear() {
  const location = useLocation();
  const { clearMessage } = useInlineMessage();

  useEffect(() => {
    clearMessage();
  }, [location.pathname, clearMessage]);

  return null;
}
