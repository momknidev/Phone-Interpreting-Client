import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));

// DASHBOARD: ADMIN
export const DashboardPage = Loadable(lazy(() => import('../pages/admin/DashboardPage')));
export const ClientCreatePage = Loadable(lazy(() => import('../pages/admin/ClientCreatePage')));
export const ClientEditPage = Loadable(lazy(() => import('../pages/admin/ClientEditPage')));
export const ClientListPage = Loadable(lazy(() => import('../pages/admin/ClientListPage')));
export const ClientDetailPage = Loadable(lazy(() => import('../pages/admin/ClientDetailPage')));
export const AdminAccountPage = Loadable(lazy(() => import('../pages/admin/UserAccountPage')));

// DASHBOARD: CLIENT
export const ClientDashboardPage = Loadable(lazy(() => import('../pages/client/DashboardPage')));
export const ClientAccountPage = Loadable(lazy(() => import('../pages/client/UserAccountPage')));

// MAIN

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
export const ComingSoonPage = Loadable(lazy(() => import('../pages/ComingSoonPage')));
