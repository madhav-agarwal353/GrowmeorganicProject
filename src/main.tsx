import React from 'react';
import ReactDOM from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import App from './App';

import 'primereact/resources/themes/bootstrap4-dark-purple/theme.css';
import 'primereact/resources/primereact.min.css';
// import 'primeicons/primeicons.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <App />
    </PrimeReactProvider>
  </React.StrictMode>
);
