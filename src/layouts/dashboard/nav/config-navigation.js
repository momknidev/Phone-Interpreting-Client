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
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    items: [
      // Client Items
      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.clientDashboard,
        icon: ICONS.dashboard,
        roles: ['client'],
        type: 'client',
      },

      {
        title: 'Dashboard',
        path: PATH_DASHBOARD.adminDashboard,
        icon: ICONS.dashboard,
        roles: ['admin'],
        type: 'admin',
      },
    ],
  },
];

export default navConfig;
