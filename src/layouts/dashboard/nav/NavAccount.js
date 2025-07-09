import { Link as RouterLink } from 'react-router-dom';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Box, Link, Typography } from '@mui/material';
// auth
import { useAuthContext } from '../../../auth/useAuthContext';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { CustomAvatar } from '../../../components/custom-avatar';

// ----------------------------------------------------------------------
const roleTranslation = {
  client: 'Cliente',
  mediator: 'Mediatore',
  intranet: 'Intranet',
  admin: 'Admin',
  user: 'User',
};
const StyledRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[500], 0.12),
}));

// ----------------------------------------------------------------------

export default function NavAccount() {
  const { user } = useAuthContext();

  // Check if the user exists and has a valid type
  if (!user || !user.type) {
    return null; // You can return null or render a fallback UI if needed
  }

  // Dynamically set the link based on the user type
  let link = '';
  const type = user?.type;

  if (type === 'mediator') {
    link = PATH_DASHBOARD.mediatorProfile;
  } else if (type === 'client') {
    link = PATH_DASHBOARD.clientProfile;
  } else if (type === 'intranet') {
    link = PATH_DASHBOARD.intranetProfile;
  }

  if (!link) {
    return null;
  }

  return (
    <Link component={RouterLink} to={link} underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar src={user?.photoURL} alt={user?.displayName} name={user?.displayName} />

        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.displayName}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {roleTranslation[user?.role]}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}
