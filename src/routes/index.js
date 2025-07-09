import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/ClientGuard';

// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_CLIENT_LOGIN, PATH_AFTER_ADMIN_LOGIN } from '../config-global';
//
import {
  DashboardPage,
  Page404,
  ComingSoonPage,
  LoginPage,
  ClientDashboardPage,
  AdminAccountPage,
  ClientAccountPage,
} from './elements';
import RoleBasedGuard from '../auth/RoleBasedGuard';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: (
        <GuestGuard>
          <LoginPage />
        </GuestGuard>
      ),
    },

    // Client Dashboard

    {
      path: 'admin',
      element: (
        <AuthGuard type="admin">
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_ADMIN_LOGIN} replace />, index: true },
        {
          path: 'app',
          element: (
            <RoleBasedGuard roles={['admin', 'user']} hasContent>
              <DashboardPage />{' '}
            </RoleBasedGuard>
          ),
        },

        {
          path: 'profile',
          element: (
            <RoleBasedGuard roles={['admin', 'user']} hasContent>
              <AdminAccountPage />
            </RoleBasedGuard>
          ),
        },
      ],
    },
    // Client Dashboard
    {
      path: 'client',
      element: (
        <AuthGuard type="client">
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_CLIENT_LOGIN} replace />, index: true },
        {
          path: 'app',
          element: (
            <RoleBasedGuard hasContent roles={['admin', 'user']}>
              <ClientDashboardPage />
            </RoleBasedGuard>
          ),
        },

        { path: 'profile', element: <ClientAccountPage /> },
      ],
    },

    {
      element: <CompactLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoonPage /> },
        { path: '404', element: <Page404 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
