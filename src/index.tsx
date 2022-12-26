import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './app';
import DefaultErrorBoundary from './default-error-boundary';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <DefaultErrorBoundary>
      <App />
    </DefaultErrorBoundary>
  </React.StrictMode>
);
