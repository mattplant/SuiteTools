// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Context for the transient inline message shown above a screen's content.
 *
 * @fileoverview
 * Carries one message at a time — the "saved", "nothing found" or "scrape was partial" banner —
 * along with the icon set that renders each type. Four modules consume it.
 *
 * @remarks
 * The context defaults to `undefined` rather than a no-op value, so a consumer rendered outside
 * the provider fails loudly instead of silently swallowing messages. Holding a single message
 * rather than a queue is intentional: a second message replaces the first, since these are
 * screen-level status, not notifications.
 *
 * @see ../messages – the components that render this
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { ReactNode } from "react";
import { createContext, useCallback, useState, useEffect } from "react";

type MessageType = "success" | "error" | "info" | "warning";

type InlineMessage = { text: string; type?: MessageType };

export type InlineMessageContextType = {
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

type Props = { children: ReactNode };

export function InlineMessageProvider({ children }: Props) {
  const [message, setMessage] = useState<InlineMessage | null>(null);

  // Memoised so the auto-clear effect can depend on it without restarting the timer each render.
  const clearMessage = useCallback(() => setMessage(null), []);
  const MESSAGE_TIMEOUT_MS = 4000;

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, MESSAGE_TIMEOUT_MS);
      return (): void => clearTimeout(timer);
    }
  }, [message, clearMessage]);

  return (
    <InlineMessageContext.Provider value={{ message, setMessage, clearMessage }}>
      {children}
    </InlineMessageContext.Provider>
  );
}
