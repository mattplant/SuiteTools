// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { SuiteError } from "@suiteworks/suitetools-shared";

interface DevSuiteErrorOverlayProps {
  error: SuiteError;
  /** Called when the user dismisses the overlay (e.g. navigate back). */
  onDismiss?: () => void;
}

/**
 * True floating developer error overlay: fixed portal above the current page
 * (header/chrome remain visible underneath the dimmed backdrop).
 */
export function DevSuiteErrorOverlay({ error, onDismiss }: DevSuiteErrorOverlayProps): React.JSX.Element {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onDismiss?.();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return (): void => window.removeEventListener("keydown", onKeyDown);
  }, [onDismiss]);

  const panel = (
    // Permanent by design, not deferred work: the rule reports the backdrop's `onClick`
    // because a `div` is not an interactive element. Keyboard dismissal is not missing — an
    // Escape listener is registered on `window` in the effect above, which dismisses from
    // anywhere rather than only when the backdrop holds focus. Adding `onKeyDown` here to
    // satisfy the rule would duplicate that listener as dead code, and restructuring was
    // tested and is worse — see #89.
    // biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click only dismisses; keyboard dismissal is handled by the window-level Escape listener registered above
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dev-error-overlay-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        background: "rgba(15, 23, 42, 0.45)",
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onDismiss?.();
        }
      }}
    >
      <div
        style={{
          width: "min(48rem, 100%)",
          maxHeight: "calc(100vh - 6rem)",
          overflow: "auto",
          padding: "1.5rem",
          borderRadius: "0.5rem",
          background: "#fee2e2",
          color: "#991b1b",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "start" }}>
          <h2 id="dev-error-overlay-title" style={{ margin: 0, fontSize: "1.25rem", fontWeight: 700 }}>
            Dev Error Overlay
          </h2>
          {onDismiss ? (
            <button
              type="button"
              // Permanent by design, not deferred work: moving focus into a modal dialog on
              // open is what the WAI-ARIA authoring practices call for, and the dismiss control
              // is the correct target. The rule cannot distinguish a dialog's initial focus from
              // an unsolicited autofocus on page load. Dev-only overlay — see #89.
              // biome-ignore lint/a11y/noAutofocus: moving focus into a modal dialog on open follows the WAI-ARIA authoring practices; the dismiss control is the correct target
              autoFocus
              onClick={onDismiss}
              style={{
                border: "1px solid #7f1d1d",
                background: "#991b1b",
                color: "#fff",
                borderRadius: "0.25rem",
                padding: "0.375rem 1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Close
            </button>
          ) : null}
        </div>
        <p style={{ marginTop: "0.5rem", fontSize: "0.875rem", opacity: 0.85 }}>
          {error.code} · {error.severity}
        </p>
        <pre style={{ whiteSpace: "pre-wrap", marginTop: "1rem" }}>{error.message}</pre>
        {error.context ? (
          <details style={{ marginTop: "1rem" }} open>
            <summary>Context</summary>
            <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(error.context, null, 2)}</pre>
          </details>
        ) : null}
        {error.stack ? (
          <details style={{ marginTop: "1rem" }}>
            <summary>Stack trace</summary>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {/* Production bundles minify class names (`Ja:`); prefer stable taxonomy code. */}
              {error.stack.replace(/^[^\n:]+:/, `${error.code}:`)}
            </pre>
          </details>
        ) : null}
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
