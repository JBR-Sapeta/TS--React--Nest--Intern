import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '@App/App';

import '@Styles/index.css';
import '@Styles/variables.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
