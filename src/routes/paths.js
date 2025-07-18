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
  mediator: {
    root: path(CLIENT_DASHBOARD, '/mediator'),
    new: path(CLIENT_DASHBOARD, '/mediator/new'),
    list: path(CLIENT_DASHBOARD, '/mediator/list'),
    group: path(CLIENT_DASHBOARD, '/mediator/group'),
    edit: (id) => path(CLIENT_DASHBOARD, `/mediator/${id}/edit`),
    view: (id) => path(CLIENT_DASHBOARD, `/mediator/${id}`),
  },
  languageList: path(CLIENT_DASHBOARD, '/language'),
  userCodeList: path(CLIENT_DASHBOARD, '/user-code'),

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
