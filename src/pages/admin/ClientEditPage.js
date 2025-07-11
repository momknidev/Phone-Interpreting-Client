import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Grid } from '@mui/material';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import ClientCreateEditForm from '../../sections/@dashboard/admin/client/ClientCreateEditForm';

// ----------------------------------------------------------------------

export default function ClientEditPage() {
  const { themeStretch } = useSettingsContext();
  // const theme = useTheme();

  return (
    <>
      <Helmet>
        <title> Client Edit Page | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.intranetDashboard },
            { name: 'Account Settings' },
          ]}
        />
        <ClientCreateEditForm />
      </Container>
    </>
  );
}
