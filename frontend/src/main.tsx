import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './index.css';
import TestPage from './pages/TestPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TestPage />
  </React.StrictMode>,
); 