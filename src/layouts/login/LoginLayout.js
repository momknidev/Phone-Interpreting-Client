import PropTypes from 'prop-types';
// @mui
import { Stack } from '@mui/material';
// components
import Logo from '../../components/logo';
//
import { StyledRoot, StyledContent } from './styles';
import Image from '../../components/image';
import { width } from '@mui/system';

// ----------------------------------------------------------------------

LoginLayout.propTypes = {
  children: PropTypes.node,
};

export default function LoginLayout({ children }) {
  return (
    <StyledRoot>
      <Logo
        sx={{
          zIndex: 9,
          position: 'absolute',
          mt: { xs: 1.5, md: 5 },
          ml: { xs: 2, md: 5 },
        }}
      />
      <StyledContent>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{
            minWidth: '100%',
          }}
        >
          <Image
            disabledEffect
            alt="empty content"
            src="/logo/logo_full.svg"
            style={{ height: '64%', mb: 0, width: '100%', objectFit: 'contain' }}
          />

          <Stack sx={{ width: 1 }}> {children} </Stack>
        </Stack>
      </StyledContent>
    </StyledRoot>
  );
}
