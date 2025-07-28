import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Container, Skeleton } from '@mui/material';
import { useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';

import { MEDIATOR_BY_ID } from '../../graphQL/queries';
import { Profile } from '../../sections/@dashboard/client/mediator/profile';

// ----------------------------------------------------------------------

export default function MediatorViewPage() {
  const { themeStretch } = useSettingsContext();
  const navigate = useNavigate();

  const { id } = useParams();
  console.log({ id });
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
        <title> Mediator: Profile | Arca di Noè Healthcare Mediation Management</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Mediator Profile"
          action={
            <Button
              variant="contained"
              startIcon={<i className="fas fa-edit" />}
              onClick={() => navigate(PATH_DASHBOARD.mediator.edit(data?.mediatorById?.id))}
            >
              Edit
            </Button>
          }
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Mediators',
              href: PATH_DASHBOARD.mediator.list,
            },
            { name: data?.mediatorById?.first_name },
          ]}
        />
        {loading && !data && !error && <Skeleton height={300} width="100%" />}
        {!loading && data && !error && <Profile mediatorData={data?.mediatorById} />}
      </Container>
    </>
  );
}
