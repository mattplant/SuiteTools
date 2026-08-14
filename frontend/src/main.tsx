import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AppErrorBoundary } from "./components/shared/errors/AppErrorBoundary";
import { handleError, setErrorDevMode } from "@suiteworks/suitetools-shared";
import "./index.css";

// Vite build flag; AppSettingsProvider may also enable via settings.devMode.
setErrorDevMode(import.meta.env.DEV);

try {
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    throw new Error('Cannot mount SuiteTools: no element with id "root" in the document.');
  }

  createRoot(rootElement).render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  );
} catch (err) {
  handleError(err);
}
