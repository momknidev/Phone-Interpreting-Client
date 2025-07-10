import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { m } from 'framer-motion';
import { useLocation } from 'react-router-dom';
// @mui
import { Button, Container, Link, Typography } from '@mui/material';
// components
import { MotionContainer, varBounce } from '../components/animate';
// assets
import { ForbiddenIllustration } from '../assets/illustrations';
//
import { useAuthContext } from './useAuthContext';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  children: PropTypes.node,
  hasContent: PropTypes.bool,
  type: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.string),
};

export default function RoleBasedGuard({ hasContent, roles, type, children }) {
  const { user, logout } = useAuthContext();
  const currentRole = user?.role; // admin;
  const location = useLocation();
  useEffect(() => {
    if (hasContent && user) {
      if (location.pathname.includes(user?.type)) {
        return;
      }
      console.log('Invalid access attempt by user type:', user?.type);
      // logout();
    }
  }, [hasContent, user, logout, location.pathname]);
  if (
    (typeof roles !== 'undefined' && !roles.includes(currentRole)) ||
    (typeof type !== 'undefined' && type !== user?.type) ||
    (location.pathname && !location.pathname.includes(user?.type))
  ) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center', pt: 4 }}>
        <m.div variants={varBounce().in}>
          <Typography
            variant="h3"
            paragraph
            sx={{
              maxWidth: 480,
              mx: 'auto',
              color: 'text.primary',
            }}
          >
            This route is not accessible to you.
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <ForbiddenIllustration sx={{ height: 260, my: { xs: 5, sm: 10 } }} />
        </m.div>
        <m.div variants={varBounce().in}>
          <Button variant="contained" size="large" component={Link} href="/">
            Go to Home
          </Button>
        </m.div>
      </Container>
    ) : null;
  }

  return <>{children}</>;
}
