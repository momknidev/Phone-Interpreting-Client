import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Skeleton, Alert, Stack } from '@mui/material';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import ClientCreateEditForm from '../../sections/@dashboard/admin/client/ClientCreateEditForm';
import { CLIENT_BY_ID } from '../../graphQL/queries';

// ----------------------------------------------------------------------

export default function ClientEditPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { data, loading, error } = useQuery(CLIENT_BY_ID, {
    variables: { id },
    fetchPolicy: 'no-cache',
  });

  if (loading) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="rectangular" height={300} />
      </Stack>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading client data: {error.message}</Alert>;
  }
  return (
    <>
      <Helmet>
        <title> Client Edit Page | Telephone Mediation App</title>
      </Helmet>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.adminDashboard },
            { name: 'Clients', href: PATH_DASHBOARD.adminClients.list },
            { name: 'Edit Client' },
          ]}
        />
        <ClientCreateEditForm isEdit currentUser={data.clientByID} />
      </Container>
    </>
  );
}
