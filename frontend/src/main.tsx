import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AppErrorBoundary } from "./components/shared/errors/AppErrorBoundary";
import { handleError, setErrorDevMode } from "@suiteworks/suitetools-shared";
import "./index.css";

// Vite build flag; AppSettingsProvider may also enable via settings.devMode.
setErrorDevMode(import.meta.env.DEV);

try {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  );
} catch (err) {
  handleError(err);
}
