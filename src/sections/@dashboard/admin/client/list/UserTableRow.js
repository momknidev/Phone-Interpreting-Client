/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
// @mui
import { Stack, Avatar, TableRow, TableCell, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// components
import Iconify from '../../../../../components/iconify';
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onResetPassword: PropTypes.func,
};

export default function UserTableRow({ row, onViewRow, onEditRow, onResetPassword }) {
  const { email, avatarUrl, phone, firstName, lastName } = row;

  return (
    <TableRow hover>
      <TableCell sx={{ px: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={firstName} src={avatarUrl} />
          {/* <Link
            component={RouterLink}
            to={PATH_DASHBOARD.adminClients.detail(id)}
            sx={{
              color: 'text.blue',
              textDecoration: 'none',
              '&:hover': { color: 'text.primary', textDecoration: 'underline' },
              '&:active': { color: 'text.primary', textDecoration: 'underline' },
            }}
          > */}
          <Typography variant="subtitle2" noWrap>
            {`${firstName} ${lastName}`}
          </Typography>
          {/* </Link> */}
        </Stack>
      </TableCell>

      <TableCell sx={{ px: 1 }} align="left">
        {email}
      </TableCell>

      <TableCell sx={{ px: 1 }} align="left">
        {phone}
      </TableCell>
      <TableCell sx={{ px: 1 }} align="left">
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={onEditRow}>
            <Iconify icon="eva:edit-fill" />
          </IconButton>
        </Stack>
      </TableCell>
    </TableRow>
  );
}
