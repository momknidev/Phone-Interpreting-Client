import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// auth

// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import ClientCreateEditForm from '../../sections/@dashboard/admin/client/ClientCreateEditForm';

// ----------------------------------------------------------------------

export default function ClientCreatePage() {
  const { themeStretch } = useSettingsContext();
  return (
    <>
      <Helmet>
        <title> Client Create Page | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.adminDashboard },
            { name: 'New Client Account' },
          ]}
        />
        <ClientCreateEditForm />
      </Container>
    </>
  );
}
