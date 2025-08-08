import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Grid, Stack } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';

// components
import { useSettingsContext } from '../../components/settings';
// sections
import { AppWelcome } from '../../sections/@dashboard/client/dashboard';
// assets
import PhonePopover from '../../layouts/dashboard/header/PhonePopover';
import { NoPhoneSelected } from './CallReportPage';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  const { user } = useAuthContext();

  const { themeStretch, phone } = useSettingsContext();
  if (!phone) {
    return <NoPhoneSelected />;
  }
  return (
    <>
      <Helmet>
        <title>Client Dashboard | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <AppWelcome
              title={`Welcome! \n ${user?.first_name || ' '} ${user?.last_name || ''}`}
              action={
                <Stack sx={{ height: 40, py: 4, px: 3 }}>
                  <PhonePopover />
                </Stack>
              }
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
