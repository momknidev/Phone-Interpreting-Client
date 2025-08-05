import { Helmet } from 'react-helmet-async';
// @mui
import { Button, Container, Typography } from '@mui/material';
// import { useQuery } from '@apollo/client';
// import { useNavigate, useParams } from 'react-router';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';

// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

export default function CallRoutingSetting() {
  const { themeStretch } = useSettingsContext();
  // const navigate = useNavigate();

  // const { id } = useParams();
  // console.log({ id });
  // const { data, loading, error } = useQuery(MEDIATOR_BY_ID, {
  //   variables: { id },
  //   fetchPolicy: 'no-cache',
  // });

  // if (error) {
  //   return `Error: ${error?.message}`;
  // }

  return (
    <>
      <Helmet>
        <title> Account Setting Page | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Interpreter Profile"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Interpreters',
              href: PATH_DASHBOARD.interpreter.list,
            },
          ]}
        />
        <Typography>Call Routing</Typography>
      </Container>
    </>
  );
}
