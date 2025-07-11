import { Helmet } from 'react-helmet-async';
// @mui
import { Container, Typography, Alert, Skeleton } from '@mui/material';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/system';

// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import { CLIENT_BY_ID } from '../../graphQL/queries';

// ----------------------------------------------------------------------

export default function ClientDetailPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { data, loading, error } = useQuery(CLIENT_BY_ID, {
    variables: { id },
    fetchPolicy: 'no-cache',
  });

  return (
    <>
      <Helmet>
        <title> Client Detail Page | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.adminDashboard },
            { name: 'Clients', href: PATH_DASHBOARD.adminClients.list },
            { name: 'Client Detail' },
          ]}
        />

        <Box sx={{ mb: 3, maxWidth: 700 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
              <Skeleton width="100%" height={300} />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error.message || 'Failed to load client data'}
            </Alert>
          )}

          {data && data.clientByID && (
            <>
              <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                {data.clientByID.firstName} {data.clientByID.lastName}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Email:</strong> {data.clientByID.email}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Phone:</strong> {data.clientByID.phone}
              </Typography>

              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Created:</strong> {new Date(data.clientByID.createdAt).toLocaleString()}
              </Typography>
            </>
          )}
        </Box>
      </Container>
    </>
  );
}
