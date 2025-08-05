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
  interpreter: {
    root: path(CLIENT_DASHBOARD, '/interpreter'),
    new: path(CLIENT_DASHBOARD, '/interpreter/new'),
    list: path(CLIENT_DASHBOARD, '/interpreter/list'),
    group: path(CLIENT_DASHBOARD, '/interpreter/group'),
    groupDetail: (id) => path(CLIENT_DASHBOARD, `/interpreter/group/${id}`),
    edit: (id) => path(CLIENT_DASHBOARD, `/interpreter/${id}/edit`),
    view: (id) => path(CLIENT_DASHBOARD, `/interpreter/${id}`),
  },
  languageList: path(CLIENT_DASHBOARD, '/language'),
  callRouting: path(CLIENT_DASHBOARD, '/call-routing'),
  clientCodeList: path(CLIENT_DASHBOARD, '/user-code'),
  callReports: path(CLIENT_DASHBOARD, '/call-reports'),

  // admin paths
  adminDashboard: path(ADMIN_DASHBOARD, '/app'),
  intranetProfile: path(ADMIN_DASHBOARD, '/profile'),

  adminClients: {
    root: path(ADMIN_DASHBOARD, '/client'),
    new: path(ADMIN_DASHBOARD, '/client/new'),
    list: path(ADMIN_DASHBOARD, '/client/list'),
    edit: (id) => path(ADMIN_DASHBOARD, `/client/${id}/edit`),
    detail: (id) => path(ADMIN_DASHBOARD, `/client/${id}`),
  },
};
