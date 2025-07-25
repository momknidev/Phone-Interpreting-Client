import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import MediatorNewEditForm from '../../sections/@dashboard/client/mediator/MediatorNewEditForm';

// ----------------------------------------------------------------------

export default function MediatorCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Helmet>
        <title> Mediator: Register New Mediator | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Mediator Account"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.clientDashboard,
            },
            {
              name: 'Mediators',
              href: PATH_DASHBOARD.mediator.list,
            },
            { name: 'New' },
          ]}
        />
        <MediatorNewEditForm />
      </Container>
    </>
  );
}
