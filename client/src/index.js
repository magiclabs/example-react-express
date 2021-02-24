import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import '@magiclabs/ui/dist/cjs/index.css';
import { ThemeProvider } from '@magiclabs/ui';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider root>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
