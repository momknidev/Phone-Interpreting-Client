import { Helmet } from 'react-helmet-async';
// @mui
import { Container } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import MediatorNewEditForm from '../../sections/@dashboard/client/interpreter/MediatorNewEditForm';
import { NoPhoneSelected } from './CallReportPage';

// ----------------------------------------------------------------------

export default function MediatorCreatePage() {
  const { themeStretch, phone } = useSettingsContext();
  if (!phone) {
    return <NoPhoneSelected />;
  }
  return (
    <>
      <Helmet>
        <title> Interpreter: Register New Interpreter | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="New Interpreter Account"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.clientDashboard,
            },
            {
              name: 'Interpreters',
              href: PATH_DASHBOARD.interpreter.list,
            },
            { name: 'New' },
          ]}
        />
        <MediatorNewEditForm />
      </Container>
    </>
  );
}
