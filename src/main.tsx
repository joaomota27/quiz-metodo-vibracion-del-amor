import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import DashboardScreen from './screens/DashboardScreen.tsx';

const isDashboard = typeof window !== 'undefined' &&
  (window.location.pathname === '/dashboard' || window.location.pathname.startsWith('/dashboard/'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDashboard ? <DashboardScreen /> : <App />}
  </StrictMode>
);
