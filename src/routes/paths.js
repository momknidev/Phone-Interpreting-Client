// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '';
const CLIENT_DASHBOARD = '/client';
const ADMIN_DASHBOARD = '/admin';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: '/',
  login: path(ROOTS_AUTH, '/login'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  page404: '/404',
};

export const PATH_DASHBOARD = {
  root: CLIENT_DASHBOARD,
  // client paths
  clientDashboard: path(CLIENT_DASHBOARD, '/app'),
  clientProfile: path(CLIENT_DASHBOARD, '/profile'),
  // admin paths
  adminDashboard: path(ADMIN_DASHBOARD, '/app'),
  intranetProfile: path(ADMIN_DASHBOARD, '/profile'),
};
