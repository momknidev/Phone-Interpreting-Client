import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
// components
import LoadingScreen from '../components/loading-screen';
//
import ClientLogin from '../pages/auth/LoginPage';
// import IntranetLogin from '../pages/auth/intranet/LoginPage';
// import MediatorLogin from '../pages/auth/mediator/LoginPage';
import { useAuthContext } from './useAuthContext';
import RoleBasedGuard from './RoleBasedGuard';

// ----------------------------------------------------------------------

AuthGuard.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  roles: PropTypes.array,
};

export default function AuthGuard({ children, type, roles }) {
  const { isAuthenticated, isInitialized } = useAuthContext();

  const { pathname } = useLocation();

  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <ClientLogin />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return (
    <>
      <RoleBasedGuard roles={roles} type={type} hasContent>
        {children}
      </RoleBasedGuard>{' '}
    </>
  );
}
