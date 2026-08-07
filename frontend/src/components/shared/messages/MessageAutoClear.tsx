// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useInlineMessage } from '../../../hooks/useInlineMessage';

/**
 * Clears inline messages on route changes.
 * @returns null (side-effect only).
 */
export function MessageAutoClear(): null {
  const { clearMessage } = useInlineMessage();
  const location = useLocation();

  useEffect(() => {
    clearMessage();
  }, [location.pathname, clearMessage]);

  return null;
}
