import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { Stack, Container, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  if (!phone) {
    return <NoPhoneSelected />;
  }

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

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
                <Stack direction="row" spacing={2} sx={{ py: 3 }}>
                  <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel>Year</InputLabel>
                    <Select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      label="Year"
                    >
                      {years.map((year) => (
                        <MenuItem key={year} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <PhonePopover />
                </Stack>
              }
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Stats year={selectedYear} phoneNumberId={phone.id} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <CallStatsChart year={selectedYear} phoneNumberId={phone.id} />
          </Grid>
          <Grid item xs={12}>
            <MonthlyCallsChart year={selectedYear} phoneNumberId={phone.id} />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

// ----------------------------------------------------------------------
