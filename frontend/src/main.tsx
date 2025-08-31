import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppErrorBoundary } from './components/shared/errors/AppErrorBoundary';
import { handleError } from '@suiteworks/suitetools-shared';
import './index.css';

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <AppErrorBoundary>
        <App />
      </AppErrorBoundary>
    </StrictMode>,
  );
} catch (err) {
  handleError(err);
}
