import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// components
import LoadingScreen from '../components/loading-screen';
//
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const { isAuthenticated, isInitialized, user } = useAuthContext();
  if (isAuthenticated) {
    let redirectPath = '/';

    if (user?.role === 'admin') {
      redirectPath = PATH_DASHBOARD.adminDashboard;
    } else if (user?.role === 'client') {
      redirectPath = PATH_DASHBOARD.clientDashboard;
    }

    return <Navigate to={redirectPath} />;
  }

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  return <> {children} </>;
}
