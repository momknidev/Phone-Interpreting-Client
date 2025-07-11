/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Stack,
  Avatar,
  TableRow,
  TableCell,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Card,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
// components
import Iconify from '../../../../../components/iconify';
import { PATH_DASHBOARD } from '../../../../../routes/paths';
import { useAuthContext } from '../../../../../auth/useAuthContext';

import { UPDATE_USER_PASSWORD } from '../../../../../graphQL/mutations';
import FormProvider, { RHFTextField } from '../../../../../components/hook-form';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  onViewRow: PropTypes.func,
  onEditRow: PropTypes.func,
  onResetPassword: PropTypes.func,
};

export default function UserTableRow({ row, onViewRow, onEditRow, onResetPassword }) {
  const { id, email, avatarUrl, phone, firstName, lastName } = row;

  const [openResetDialog, setOpenResetDialog] = useState(false);
  const handleCloseResetDialog = () => {
    setOpenResetDialog(false);
  };

  return (
    <>
      <TableRow hover>
        <TableCell sx={{ px: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar alt={firstName} src={avatarUrl} />
            <Link
              component={RouterLink}
              to={PATH_DASHBOARD.adminClients.detail(id)}
              sx={{
                color: 'text.primary',
                textDecoration: 'none',
                '&:hover': { color: 'text.primary', textDecoration: 'underline' },
                '&:active': { color: 'text.primary', textDecoration: 'underline' },
              }}
            >
              <Typography variant="subtitle2" noWrap>
                {`${firstName} ${lastName}`}
              </Typography>
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
          <Button
            variant="contained"
            size="small"
            color="secondary"
            startIcon={<Iconify icon="mdi:key-reset" />}
            onClick={() => setOpenResetDialog(true)}
            sx={{
              minWidth: 125,
            }}
          >
            Reset Password
          </Button>
        </TableCell>
      </TableRow>

      <Dialog open={openResetDialog} onClose={handleCloseResetDialog}>
        <DialogTitle>Reset Password for {firstName}</DialogTitle>
        <DialogContent>
          <AccountChangePassword onClose={handleCloseResetDialog} id={id} />
        </DialogContent>
      </Dialog>
    </>
  );
}

function AccountChangePassword({ onClose, id }) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [updatePassword] = useMutation(UPDATE_USER_PASSWORD);
  const ChangePassWordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required('New Password is required')
      .min(8, 'Password must be at least 8 characters')
      .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
      .matches(/[0-9]/, 'Password must contain at least one number')
      .matches(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character')
      .test(
        'no-match',
        'New password must be different than old password',
        (value, { parent }) => value !== parent.oldPassword
      ),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await updatePassword({
        variables: {
          id,
          oldPassword: data?.oldPassword,
          newPassword: data?.newPassword,
        },
      });
      reset();
      enqueueSnackbar('Update success!');
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.message, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 420,
        }}
      >
        <Stack
          spacing={3}
          alignItems="center"
          sx={{
            p: 3,
            width: '100%',
            maxWidth: 420,
          }}
        >
          {/* <RHFTextField name="oldPassword" type="password" label="Old Password" /> */}

          <RHFTextField name="newPassword" type="password" label="New Password" />
          <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Reset Password
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
