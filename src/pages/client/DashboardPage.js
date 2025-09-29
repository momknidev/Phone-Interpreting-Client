import { Helmet } from 'react-helmet-async';
import { Stack, Container, Grid } from '@mui/material';
import { useAuthContext } from '../../auth/useAuthContext';
import { useSettingsContext } from '../../components/settings';

import {
  AppWelcome,
  PhonePopover,
  MonthlyCallsChart,
  CallStatsChart,
  Stats,
} from '../../sections/@dashboard/client/dashboard';
// assets
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
                <Stack sx={{ py: 3 }}>
                  <PhonePopover />
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Stats />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <CallStatsChart />
          </Grid>
          <Grid item xs={12}>
            <MonthlyCallsChart />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
