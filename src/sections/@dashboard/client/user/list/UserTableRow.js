import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// components
import Iconify from '../../../../../components/iconify';
import MenuPopover from '../../../../../components/menu-popover';
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
};

export default function UserTableRow({ row, onViewRow, onEditRow }) {
  const { id, displayName, email, avatar_url, role } = row;

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ px: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={displayName} src={avatar_url} />
            <Link
              component={RouterLink}
              to={PATH_DASHBOARD.clientUser.view(id)}
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': { color: 'text.primary', textDecoration: 'underline' },
                '&:active': { color: 'text.primary', textDecoration: 'underline' },
              }}
            >
              <Typography variant="subtitle2" noWrap>
                {displayName}
              </Typography>{' '}
            </Link>
          </Stack>
        </TableCell>

        <TableCell sx={{ px: 1 }} align="left">
          {email}
        </TableCell>
        {/* <TableCell sx={{px:1}} align="left">{department}</TableCell> */}

        {/* <TableCell align="left" sx={{ textTransform: 'capitalize', px: 1 }}>
          {role}
        </TableCell> */}

        {/* <TableCell sx={{px:1}} align="left">{fDateTime(Number(created_at))}</TableCell> */}
        <TableCell sx={{ px: 1 }} align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Modifica
        </MenuItem>
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="raphael:view" />
          Visualizza
        </MenuItem>
      </MenuPopover>
    </>
  );
}
