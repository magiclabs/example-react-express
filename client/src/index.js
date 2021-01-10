import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '@magiclabs/ui/dist/cjs/index.css';
import { ThemeProvider, ToastProvider } from '@magiclabs/ui';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider root>
      <ToastProvider position={'top-end'}>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
