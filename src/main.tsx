import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { initTracking } from './tracking/init';
import './site.css';
import './matriz.css';
import './campinas.css';

initTracking();

const rootEl = document.getElementById('root')!;
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
if (rootEl.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootEl, app);
} else {
  ReactDOM.createRoot(rootEl).render(app);
}
