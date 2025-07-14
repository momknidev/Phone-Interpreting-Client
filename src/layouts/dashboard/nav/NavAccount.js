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

  if (!user || !user.type) {
    return null;
  }
  let link = '';
  const type = user?.type;

  if (type === 'admin') {
    link = PATH_DASHBOARD.adminDashboard;
  } else if (type === 'client') {
    link = PATH_DASHBOARD.clientProfile;
  }

  if (!link) {
    return null;
  }

  return (
    <Link component={RouterLink} to={link} underline="none" color="inherit">
      <StyledRoot>
        <CustomAvatar
          src={user?.photoURL}
          alt={`${user?.firstName || ' '}   ${user?.lastName || ''}`}
          name={`${user?.firstName || ' '}   ${user?.lastName || ''}`}
        />

        <Box sx={{ ml: 2, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {`${user?.firstName || ' '}   ${user?.lastName || ''}`}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
            {user?.role}
          </Typography>
        </Box>
      </StyledRoot>
    </Link>
  );
}
