import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';

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
  ClientListPage,
  ClientCreatePage,
  ClientDetailPage,
  ClientEditPage,
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
            <RoleBasedGuard roles={['admin']} hasContent>
              <DashboardPage />
            </RoleBasedGuard>
          ),
        },
        {
          path: 'client',
          children: [
            {
              path: 'list',
              element: (
                <RoleBasedGuard roles={['admin']} hasContent>
                  <ClientListPage />
                </RoleBasedGuard>
              ),
            },
            {
              path: 'new',
              element: (
                <RoleBasedGuard roles={['admin']} hasContent>
                  <ClientCreatePage />
                </RoleBasedGuard>
              ),
            },
            {
              path: ':id',
              element: (
                <RoleBasedGuard roles={['admin']} hasContent>
                  <ClientDetailPage />
                </RoleBasedGuard>
              ),
            },
            {
              path: ':id/edit',
              element: (
                <RoleBasedGuard roles={['admin']} hasContent>
                  <ClientEditPage />
                </RoleBasedGuard>
              ),
            },
          ],
        },
        {
          path: 'profile',
          element: (
            <RoleBasedGuard roles={['admin']} hasContent>
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
            <RoleBasedGuard hasContent roles={['client']}>
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
