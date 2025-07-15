// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  cart: icon('ic_cart'),
  user: icon('ic_user'),
  booking: icon('ic_booking'),
  dashboard: icon('ic_dashboard'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  language: icon('ic_language'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      // Admin Items
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.adminDashboard,
        icon: ICONS.dashboard,
        roles: ['admin'],
        type: 'admin',
      },
      {
        title: 'Client',
        path: PATH_DASHBOARD.adminClients.list,
        icon: ICONS.user,
        roles: ['admin'],
        type: 'admin',
      },
      // Client Items
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.clientDashboard,
        icon: ICONS.dashboard,
        roles: ['client'],
        type: 'client',
      },
      {
        title: 'Language',
        path: PATH_DASHBOARD.languageList,
        icon: ICONS.language,
        roles: ['client'],
        type: 'client',
      },
      {
        title: 'Mediator',
        path: PATH_DASHBOARD.mediator.root,
        icon: ICONS.user,
        roles: ['client'],
        type: 'client',
        children: [
          { title: 'list', path: PATH_DASHBOARD.mediator.list },
          { title: 'group', path: PATH_DASHBOARD.mediator.group },
        ],
      },
    ],
  },
];

export default navConfig;
