import { Outlet } from 'react-router-dom';
// @mui
import { Stack, Container } from '@mui/material';
// hooks
import useOffSetTop from '../../hooks/useOffSetTop';
// config
import { HEADER } from '../../config-global';
//
import Header from './Header';

// ----------------------------------------------------------------------

export default function CompactLayout() {
  const isOffset = useOffSetTop(HEADER.H_MAIN_DESKTOP);

  return (
    <>
      <Header isOffset={isOffset} />

      <Container component="main">
        <Stack
          sx={{
            pt: 12,
            m: 'auto',
            maxWidth: '100vw',
            minHeight: '100vh',
            textAlign: 'center',
            justifyContent: 'center',
            width: 1,
          }}
        >
          <Outlet />
        </Stack>
      </Container>
    </>
  );
}
