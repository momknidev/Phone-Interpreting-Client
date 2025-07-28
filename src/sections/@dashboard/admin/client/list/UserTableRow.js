import { useState } from 'react';
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
// @mui
import {
  Stack,
  Avatar,
  TableRow,
  TableCell,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../../../../../components/iconify';
import { CHANGE_STATUS } from '../../../../../graphQL/mutations';
import Label from '../../../../../components/label';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onChangeStatus: PropTypes.func,
};

export default function UserTableRow({ row, onEditRow, onChangeStatus }) {
  const { enqueueSnackbar } = useSnackbar();
  const [changeStatus, { loading }] = useMutation(CHANGE_STATUS);
  const [openDialog, setOpenDialog] = useState(false);
  const [statusToChange, setStatusToChange] = useState(null);

  const handleOpenDialog = (newStatus) => {
    setStatusToChange(newStatus);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChangeStatus = async () => {
    const { id } = row;
    const status = statusToChange;

    console.log({ id, status });

    try {
      await changeStatus({
        variables: {
          id,
          status,
        },
      });
      enqueueSnackbar(`Status updated`, {
        variant: 'success',
      });
      row.status = status;

      if (onChangeStatus) {
        onChangeStatus();
      }
    } catch (error) {
      console.error('Error changing status:', error);
      enqueueSnackbar(`Error changing status: ${error.message}`, {
        variant: 'error',
      });
    }

    handleCloseDialog();
  };

  const { email, avatar_url, phone, first_name, last_name, status } = row;

  return (
    <TableRow hover>
      <TableCell sx={{ px: 1 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={first_name} src={avatar_url} />

          <Typography variant="subtitle2" noWrap>
            {`${first_name} ${last_name}`}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell sx={{ px: 1 }} align="left">
        {email}
      </TableCell>

      <TableCell sx={{ px: 1 }} align="left">
        {phone ?? ''}
      </TableCell>
      <TableCell sx={{ px: 1 }} align="left">
        <Label color={status === 'active' ? 'success' : 'error'}>{status}</Label>
      </TableCell>
      <TableCell sx={{ px: 1 }} align="left">
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={onEditRow}>
            <Iconify icon="eva:edit-fill" />
          </IconButton>
          <IconButton
            color={status === 'active' ? 'error' : 'success'}
            onClick={() => handleOpenDialog(status === 'active' ? 'in-active' : 'active')}
            title={status === 'active' ? 'Change status to in-active' : 'Change status to active'}
          >
            <Iconify icon={status === 'active' ? 'eva:slash-fill' : 'eva:checkmark-fill'} />
          </IconButton>
        </Stack>
      </TableCell>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirm Status Change</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to change the status to {statusToChange}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <LoadingButton
            loading={loading}
            variant="outlined"
            color="error"
            onClick={handleCloseDialog}
          >
            Cancel
          </LoadingButton>
          <LoadingButton
            loading={loading}
            variant="contained"
            onClick={handleChangeStatus}
            color="primary"
            autoFocus
          >
            Confirm
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </TableRow>
  );
}
