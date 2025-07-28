import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Grid, Button } from '@mui/material';
// auth
// import { useTheme } from '@mui/material/styles';
import { useAuthContext } from '../../auth/useAuthContext';

// components
import { useSettingsContext } from '../../components/settings';
// sections
import { AppWelcome } from '../../sections/@dashboard/client/dashboard';
// assets
import { SeoIllustration } from '../../assets/illustrations';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  const { user } = useAuthContext();

  const { themeStretch } = useSettingsContext();
  // const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Admin Dashboard | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <AppWelcome
              title={`Welcome! \n ${user?.first_name || ' '} ${user?.last_name || ''}`}
              description="Welcome To admin portal"
              img={
                <SeoIllustration
                  sx={{
                    p: 3,
                    width: 360,
                    margin: { xs: 'auto', md: 'inherit' },
                  }}
                />
              }
              action={<Button variant="contained">Hello</Button>}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
