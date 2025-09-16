import { Helmet } from 'react-helmet-async';
// @mui
import {
  Container,
  Typography,
  Alert,
  Skeleton,
  Grid,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { useParams } from 'react-router';
import { useQuery } from '@apollo/client';
import { Box } from '@mui/system';

// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { PATH_DASHBOARD } from '../../routes/paths';
import { CLIENT_BY_ID } from '../../graphQL/queries';
import Iconify from '../../components/iconify';
import PhoneList from '../../sections/@dashboard/admin/client/PhoneList';

// ----------------------------------------------------------------------

export default function ClientDetailPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();

  const { data, loading, error } = useQuery(CLIENT_BY_ID, {
    variables: { id },
    fetchPolicy: 'no-cache',
  });

  const client = data?.clientByID;

  return (
    <>
      <Helmet>
        <title>Client Detail Page | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.adminDashboard },
            { name: 'Clients', href: PATH_DASHBOARD.adminClients.list },
            { name: 'Client Detail' },
          ]}
          action={
            <Button
              disabled={!client}
              variant="contained"
              href={PATH_DASHBOARD.adminClients.edit(client?.id)}
              startIcon={<Iconify icon="eva:edit-fill" />}
            >
              Edit Client
            </Button>
          }
        />

        <Box sx={{ mt: 3 }}>
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

          {client && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography variant="h4" gutterBottom>
                      {client.first_name} {client.last_name}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Email:</strong> {client.email}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Personal Phone:</strong> {client.phone}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Status:</strong> {client.status}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1 }}>
                      <strong>Created:</strong>{' '}
                      {new Date(Number(client.created_at)).toLocaleString()}
                    </Typography>{' '}
                    <PhoneList />
                  </CardContent>
                </Card>{' '}
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>
    </>
  );
}
