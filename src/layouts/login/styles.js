// @mui
import { styled, alpha } from '@mui/material/styles';
// utils

// ----------------------------------------------------------------------

export const StyledRoot = styled('main')(({ theme }) => ({
  height: '100%',
  display: 'flex',
  position: 'relative',
  backgroundImage: `url('/assets/background/overlay_3.jpg')`,
  backgroundAttachment: 'fixed',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

export const StyledContent = styled('div')(({ theme }) => ({
  width: 420,
  margin: 'auto',
  display: 'flex',
  backgroundColor: alpha(theme.palette.background.paper, 0.85),
  borderRadius: Number(theme.shape.borderRadius) * 2,
  border: `solid 1px ${alpha(theme.palette.grey[500], 0.32)}`,
  boxShadow: theme.customShadows.z24,
  justifyContent: 'center',
  padding: theme.spacing(5, 4),
}));
