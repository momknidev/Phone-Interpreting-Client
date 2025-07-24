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
export const MediatorListPage = Loadable(lazy(() => import('../pages/client/MediatorListPage')));
export const MediatorGroupPage = Loadable(lazy(() => import('../pages/client/MediatorGroupPage')));
export const MediatorGroupDetailPage = Loadable(
  lazy(() => import('../pages/client/MediatorGroupDetailPage'))
);
export const MediatorViewPage = Loadable(lazy(() => import('../pages/client/MediatorViewPage')));
export const MediatorCreatePage = Loadable(
  lazy(() => import('../pages/client/MediatorCreatePage'))
);
export const MediatorEditPage = Loadable(lazy(() => import('../pages/client/MediatorEditPage')));
export const LanguageListPage = Loadable(lazy(() => import('../pages/client/LanguageListPage')));
export const UserCodeListPage = Loadable(lazy(() => import('../pages/client/UserCodeListPage')));
// DASHBOARD: COMMON

// MAIN

export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
export const ComingSoonPage = Loadable(lazy(() => import('../pages/ComingSoonPage')));
