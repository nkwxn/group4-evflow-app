import React from 'react';
import ReactDOM from 'react-dom/client';
import { HomeScreen } from '@evflow/features';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HomeScreen />
  </React.StrictMode>
);

