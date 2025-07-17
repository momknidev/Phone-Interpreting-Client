import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../../../../../components/iconify';
import MenuPopover from '../../../../../components/menu-popover';
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// ----------------------------------------------------------------------

MediatorTableToolbar.propTypes = {
  row: PropTypes.object,
  loadingDelete: PropTypes.bool,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function MediatorTableToolbar({
  row,
  onViewRow,
  onEditRow,
  onDeleteRow,
  loadingDelete,
}) {
  const {
    id,
    firstName,
    lastName,
    email,
    phone,
    targetLanguage1,
    targetLanguage2,
    targetLanguage3,
    targetLanguage4,
    groupIDs,
  } = row;

  const [openPopover, setOpenPopover] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  const handleOpenDeleteDialog = () => {
    handleClosePopover();
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteConfirm = () => {
    onDeleteRow(id);
    setOpenDeleteDialog(false);
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ px: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {/* <Avatar alt={firstName} src={avatarUrl} /> */}
            <Link
              component={RouterLink}
              to={PATH_DASHBOARD.mediator.view(id)}
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': { color: 'text.primary', textDecoration: 'underline' },
                '&:active': { color: 'text.primary', textDecoration: 'underline' },
              }}
            >
              <Typography variant="subtitle2" noWrap>
                {`${firstName} ${lastName}`}
              </Typography>{' '}
            </Link>
          </Stack>
        </TableCell>

        <TableCell sx={{ px: 1 }} align="left">
          {email}
        </TableCell>
        <TableCell sx={{ px: 1 }} align="left">
          {phone}
        </TableCell>
        <TableCell sx={{ px: 1 }} align="left">
          {groupIDs?.join(', ') || 'No Groups'}
        </TableCell>
        <TableCell align="left" sx={{ textTransform: 'capitalize', px: 1 }}>
          {[targetLanguage1, targetLanguage2, targetLanguage3, targetLanguage4]
            .filter((lang) => lang != null && lang !== undefined)
            .join(', ')}
        </TableCell>

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
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => {
            onViewRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="raphael:view" />
          View
        </MenuItem>
        <MenuItem onClick={handleOpenDeleteDialog} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>
      </MenuPopover>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the mediator {`${firstName} ${lastName}`}? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loadingDelete}
            onClick={handleCloseDeleteDialog}
            variant="contained"
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={loadingDelete}
            onClick={handleDeleteConfirm}
            variant="contained"
            color="error"
            autoFocus
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
