import { lazy, StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const DashboardScreen = lazy(() => import('./screens/DashboardScreen.tsx'));

const isDashboard = typeof window !== 'undefined' &&
  (window.location.pathname === '/dashboard' || window.location.pathname.startsWith('/dashboard/'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDashboard ? (
      <Suspense fallback={null}>
        <DashboardScreen />
      </Suspense>
    ) : <App />}
  </StrictMode>
);
