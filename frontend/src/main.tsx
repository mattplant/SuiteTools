import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import Routes from './Routes.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>,
);
