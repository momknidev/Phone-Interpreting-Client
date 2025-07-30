import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
// @mui
import { Container, Skeleton } from '@mui/material';
import { useQuery } from '@apollo/client';

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
// components
import { useSettingsContext } from '../../components/settings';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
// sections
import MediatorNewEditForm from '../../sections/@dashboard/client/interpreter/MediatorNewEditForm';
import { MEDIATOR_BY_ID } from '../../graphQL/queries';

// ----------------------------------------------------------------------

export default function MediatorEditPage() {
  const { themeStretch } = useSettingsContext();
  const { id } = useParams();
  const { data, loading, error } = useQuery(MEDIATOR_BY_ID, {
    variables: { id },
    fetchPolicy: 'no-cache',
  });
  if (error) {
    return `Error: ${error?.message}`;
  }
  return (
    <>
      <Helmet>
        <title> Interpreters: Edit Interpreters | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Edit Interpreters"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.clientDashboard,
            },
            {
              name: 'Interpreters',
              href: PATH_DASHBOARD.interpreter.list,
            },
            { name: data?.mediatorById?.first_name },
          ]}
        />
        {loading && !data && !error && <Skeleton height={300} width="100%" />}
        {!loading && data && !error && (
          <MediatorNewEditForm isEdit currentMediator={data?.mediatorById} />
        )}
      </Container>
    </>
  );
}
