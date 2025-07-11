import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
// @mui
import { Container, Tab, Tabs, Box, Skeleton } from '@mui/material';
import { useQuery } from '@apollo/client';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// _mock_
// components
import Iconify from '../../components/iconify';
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
// sections
import {
  AccountGeneral,
  AccountChangePassword,
} from '../../sections/@dashboard/admin/profile/account';
import { CLIENT_BY_ID } from '../../graphQL/queries';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function UserAccountPage() {
  const { themeStretch } = useSettingsContext();
  const { user } = useAuthContext();
  const { data, loading, error } = useQuery(CLIENT_BY_ID, {
    variables: { id: user?.id },
    fetchPolicy: 'no-cache',
  });

  const [currentTab, setCurrentTab] = useState('personal');

  const TABS = [
    {
      value: 'personal',
      label: 'Personal',
      icon: <Iconify icon="ic:round-account-box" />,
      component: <AccountGeneral isEdit currentUser={data?.clientByID} />,
    },
    {
      value: 'change_password',
      label: 'Change password',
      icon: <Iconify icon="ic:round-vpn-key" />,
      component: <AccountChangePassword />,
    },
  ];
  if (error) {
    return `Error: ${error?.message}`;
  }
  if (loading && !data && !error) {
    return <Skeleton height={300} width="100%" />;
  }
  return (
    <>
      <Helmet>
        <title> User: Account Settings | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.intranetDashboard },
            { name: 'Account Settings' },
          ]}
        />

        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
          {TABS.map((tab) => (
            <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map(
          (tab) =>
            tab.value === currentTab && (
              <Box key={tab.value} sx={{ mt: 5 }}>
                {tab.component}
              </Box>
            )
        )}
      </Container>
    </>
  );
}
