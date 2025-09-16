import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useSnackbar } from 'notistack';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from '@mui/material';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { PhoneInput } from 'react-international-phone';

import { LoadingButton } from '@mui/lab';
import { CLIENT_PHONES } from '../../../../graphQL/queries';
import {
  ADD_CLIENT_PHONE,
  DELETE_CLIENT_PHONE,
  UPDATE_CLIENT_PHONE,
} from '../../../../graphQL/mutations';

import Iconify from '../../../../components/iconify';

const phoneUtil = PhoneNumberUtil.getInstance();

const PhoneList = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [open, setOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneLabel, setPhoneLabel] = useState('');
  const [deletingPhoneId, setDeletingPhoneId] = useState(null);
  const [phoneError, setPhoneError] = useState('');

  const isPhoneValid = (phone) => {
    try {
      const number = phoneUtil.parseAndKeepRawInput(phone, 'IT');
      return phoneUtil.isValidNumber(number);
    } catch (error) {
      return false;
    }
  };

  const {
    data: clientPhonesData,
    loading: phonesLoading,
    error: phonesError,
    refetch,
  } = useQuery(CLIENT_PHONES, {
    variables: { clientId: id },
    fetchPolicy: 'no-cache',
  });

  const [createPhone, { loading: createLoading }] = useMutation(ADD_CLIENT_PHONE, {
    onCompleted: () => {
      refetch();
      handleClose();
      enqueueSnackbar('Phone number created successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(`Error creating phone: ${error.message}`, { variant: 'error' });
    },
  });

  const [updatePhone, { loading: updateLoading }] = useMutation(UPDATE_CLIENT_PHONE, {
    onCompleted: () => {
      refetch();
      handleClose();
      enqueueSnackbar('Phone number updated successfully', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(`Error updating phone: ${error.message}`, { variant: 'error' });
    },
  });

  const [deletePhone, { loading: deleteLoading }] = useMutation(DELETE_CLIENT_PHONE, {
    onCompleted: () => {
      refetch();
      setDeletingPhoneId(null);
      enqueueSnackbar('Phone number deleted successfully', { variant: 'success' });
    },
    onError: (error) => {
      setDeletingPhoneId(null);
      enqueueSnackbar(`Error deleting phone: ${error.message}`, { variant: 'error' });
    },
  });

  const handleOpen = (phone = null) => {
    if (phone) {
      setEditingPhone(phone);
      setPhoneNumber(phone.phone);
      setPhoneLabel(phone.label);
    } else {
      setEditingPhone(null);
      setPhoneNumber('');
      setPhoneLabel('');
    }
    setPhoneError('');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingPhone(null);
    setPhoneNumber('');
    setPhoneLabel('');
    setPhoneError('');
  };

  const handlePhoneChange = (phone) => {
    setPhoneNumber(phone);
    if (phone && !isPhoneValid(phone)) {
      setPhoneError('Please enter a valid phone number');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = () => {
    if (!phoneNumber || !isPhoneValid(phoneNumber)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    if (editingPhone) {
      updatePhone({
        variables: {
          updateClientPhoneId: editingPhone.id,
          input: {
            phone: phoneNumber,
            label: phoneLabel,
          },
        },
      });
    } else {
      createPhone({
        variables: {
          clientId: id,
          input: {
            phone: phoneNumber,
            label: phoneLabel,
          },
        },
      });
    }
  };

  const handleDelete = (phoneId) => {
    if (window.confirm('Are you sure you want to delete this phone number?')) {
      setDeletingPhoneId(phoneId);
      deletePhone({
        variables: { deleteClientPhoneId: phoneId },
      });
    }
  };

  if (phonesLoading) return <CircularProgress />;
  if (phonesError) {
    enqueueSnackbar(`Error loading phone numbers: ${phonesError.message}`, { variant: 'error' });
    return <Alert severity="error">Error loading phone numbers</Alert>;
  }

  const isSubmitLoading = createLoading || updateLoading;
  const isSubmitDisabled = isSubmitLoading || !phoneNumber || !!phoneError;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Phone Numbers</Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="eva:plus-fill" />}
          onClick={() => handleOpen()}
        >
          Add Phone
        </Button>
      </Box>

      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Phone Number</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Created At</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clientPhonesData?.clientPhones?.map((phone) => (
                <TableRow key={phone.id}>
                  <TableCell>{phone.phone}</TableCell>
                  <TableCell>{phone.label}</TableCell>
                  <TableCell>{new Date(phone.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(phone)} disabled={deleteLoading}>
                      <Iconify icon="eva:edit-fill" />
                    </IconButton>
                    <LoadingButton
                      loading={deletingPhoneId === phone.id}
                      onClick={() => handleDelete(phone.id)}
                      size="small"
                      sx={{ minWidth: 'auto', p: 1 }}
                    >
                      <Iconify icon="eva:trash-2-outline" />
                    </LoadingButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingPhone ? 'Edit Phone Number' : 'Add Phone Number'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2, mt: 1 }}>
            <PhoneInput
              defaultCountry="it"
              inputStyle={{
                width: '100%',
                height: '56px',
                borderRadius: '4px',
                border: phoneError ? '1px solid #f44336' : '1px solid #ced4da',
                padding: '10px 12px',
                fontSize: '16px',
                boxSizing: 'border-box',
              }}
              buttonStyle={{
                height: '56px',
              }}
              value={phoneNumber}
              onChange={handlePhoneChange}
              disabled={isSubmitLoading}
            />
            {phoneError && (
              <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
                {phoneError}
              </Typography>
            )}
          </Box>
          <TextField
            margin="dense"
            label="Label"
            fullWidth
            variant="outlined"
            value={phoneLabel}
            onChange={(e) => setPhoneLabel(e.target.value)}
            disabled={isSubmitLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitLoading}>
            Cancel
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            variant="contained"
            loading={isSubmitLoading}
            disabled={isSubmitDisabled}
          >
            {editingPhone ? 'Update' : 'Create'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhoneList;
