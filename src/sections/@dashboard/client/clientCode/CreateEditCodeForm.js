/* eslint-disable react/prop-types */
import { useState } from 'react';
import { DialogActions, Stack, Typography, Tabs, Tab, Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';
import { CREATE_CLIENT_CODE, UPDATE_CLIENT_CODE } from '../../../../graphQL/mutations';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import { useSettingsContext } from '../../../../components/settings';

function CreateEditCodeForm({ currentClientCode, isEditing, onClose, refetchClientCodes }) {
  const { enqueueSnackbar } = useSnackbar();
  const { phone } = useSettingsContext();

  const [tabIndex, setTabIndex] = useState(0);

  const [createClientCode, { loading: createLoading }] = useMutation(CREATE_CLIENT_CODE);
  const [updateClientCode, { loading: editLoading }] = useMutation(UPDATE_CLIENT_CODE);

  // Main form schema
  const schema = yup.object().shape({
    client_code: yup
      .number()
      .typeError('Client code must be a number')
      .required('Client code is required'),
    code_label: yup.string().required('Label is required'),
    credits: yup
      .number()
      .typeError('Credits must be a number')
      .required('Credits are required')
      .min(0, 'Credits cannot be negative'),
    status: yup.string().oneOf(['active', 'inactive']).required('Status is required'),
  });

  // Credit change schema
  const creditSchema = yup.object().shape({
    amount: yup
      .number()
      .typeError('Amount must be a number')
      .required('Amount is required')
      .min(0, 'Amount must be non-negative'),
  });

  const defaultValues = {
    client_code: currentClientCode?.client_code || '',
    code_label: currentClientCode?.code_label || '',
    credits: currentClientCode?.credits || 0,
    status: currentClientCode?.status || 'active',
  };

  // Main form methods
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  // Credit change form methods
  const creditMethods = useForm({
    resolver: yupResolver(creditSchema),
    defaultValues: { amount: '' },
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = methods;

  const {
    handleSubmit: handleCreditSubmit,
    setValue: setCreditValue,
    watch: watchCredit,
    formState: { errors: creditErrors },
  } = creditMethods;

  const values = watch();
  const creditValues = watchCredit();

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Main form submit
  const onSubmit = async (data) => {
    try {
      if (!data.client_code || !data.code_label) {
        enqueueSnackbar('Please input data in fields', { variant: 'error' });
        return;
      }
      // eslint-disable-next-line no-restricted-globals
      if (isNaN(data.client_code) || Number(data.client_code) < 0) {
        enqueueSnackbar('Client code must be a non-negative number', { variant: 'error' });
        return;
      }
      if (isEditing) {
        await updateClientCode({
          variables: {
            id: currentClientCode.id,
            input: {
              client_code: Number(data.client_code),
              code_label: data.code_label,
              status: data.status,
              phone_number: phone,
              credits: String(data.credits),
            },
          },
        });
        enqueueSnackbar('Client Code updated successfully', { variant: 'success' });
      } else {
        await createClientCode({
          variables: {
            input: {
              client_code: Number(data.client_code),
              code_label: data.code_label,
              status: data.status,
              phone_number: phone,
              credits: String(data.credits),
            },
          },
        });
        enqueueSnackbar('Client Code created successfully', { variant: 'success' });
      }
      onClose();
      refetchClientCodes();
    } catch (err) {
      console.error('Error while saving the user code:', err);
      enqueueSnackbar('Error while saving the user code', {
        variant: 'error',
      });
    }
  };

  // Increase credits submit
  const onIncreaseCredits = async ({ amount }) => {
    try {
      const newCredits = Number(currentClientCode.credits) + Number(amount);
      await updateClientCode({
        variables: {
          id: currentClientCode.id,
          input: {
            client_code: Number(currentClientCode.client_code),
            code_label: currentClientCode.code_label,
            status: currentClientCode.status,
            phone_number: phone,
            credits: String(newCredits),
          },
        },
      });
      enqueueSnackbar(`Credits increased. New credits: ${newCredits}`, { variant: 'success' });
      onClose();
      refetchClientCodes();
    } catch (err) {
      console.error('Error while increasing credits:', err);
      enqueueSnackbar('Error while increasing credits', { variant: 'error' });
    }
  };

  // Reduce credits submit
  const onReduceCredits = async ({ amount }) => {
    try {
      const current = Number(currentClientCode.credits);
      const reduce = Number(amount);
      if (reduce > current) {
        enqueueSnackbar('Cannot reduce more than current credits', { variant: 'error' });
        return;
      }
      const newCredits = current - reduce;
      await updateClientCode({
        variables: {
          id: currentClientCode.id,
          input: {
            client_code: Number(currentClientCode.client_code),
            code_label: currentClientCode.code_label,
            status: currentClientCode.status,
            phone_number: phone,
            credits: String(newCredits),
          },
        },
      });
      enqueueSnackbar(`Credits reduced. New credits: ${newCredits}`, { variant: 'success' });
      onClose();
      refetchClientCodes();
    } catch (err) {
      console.error('Error while reducing credits:', err);
      enqueueSnackbar('Error while reducing credits', { variant: 'error' });
    }
  };

  // Input change handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValue(name, value);
  };
  const handleCreditInputChange = (e) => {
    const { name, value } = e.target;
    setCreditValue(name, value);
  };

  return (
    <Box>
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="Edit Details" />
        <Tab label="Increase Credits" disabled={!isEditing} />
        <Tab label="Reduce Credits" disabled={!isEditing} />
      </Tabs>
      {tabIndex === 0 && (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Typography sx={{ pb: 3 }}>
              {isEditing
                ? 'Edit the details of the selected user code.'
                : 'Enter the details of the new user code.'}
            </Typography>
            <RHFTextField
              autoFocus
              type="number"
              margin="dense"
              name="client_code"
              label="Client Code"
              fullWidth
              variant="outlined"
              value={values.client_code || ''}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <RHFTextField
              margin="dense"
              name="code_label"
              label="Label"
              fullWidth
              variant="outlined"
              value={values.code_label || ''}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <RHFTextField
              margin="dense"
              type="number"
              name="credits"
              label="Credits"
              fullWidth
              variant="outlined"
              value={values.credits || ''}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />
            <RHFTextField
              select
              margin="dense"
              name="status"
              label="Status"
              fullWidth
              variant="outlined"
              value={values.status || null}
              onChange={handleInputChange}
              SelectProps={{ native: true }}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </RHFTextField>
          </Stack>
          <DialogActions>
            <LoadingButton loading={createLoading || editLoading} onClick={onClose}>
              Cancel
            </LoadingButton>
            <LoadingButton loading={createLoading || editLoading} variant="contained" type="submit">
              {isEditing ? 'Update' : 'Save'}
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      )}
      {tabIndex === 1 && (
        <FormProvider methods={creditMethods} onSubmit={handleCreditSubmit(onIncreaseCredits)}>
          <Stack>
            <Typography sx={{ pb: 3 }}>
              Enter the amount to <b>increase</b> credits. Current credits:{' '}
              <b>{currentClientCode?.credits}</b>
            </Typography>
            <RHFTextField
              type="number"
              margin="dense"
              name="amount"
              label="Increase Credits By"
              fullWidth
              variant="outlined"
              value={creditValues.amount || ''}
              onChange={handleCreditInputChange}
              sx={{ mb: 2 }}
              error={!!creditErrors.amount}
              helperText={creditErrors.amount?.message}
            />
          </Stack>
          <DialogActions>
            <LoadingButton loading={editLoading} onClick={onClose}>
              Cancel
            </LoadingButton>
            <LoadingButton loading={editLoading} variant="contained" type="submit">
              Increase
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      )}
      {tabIndex === 2 && (
        <FormProvider methods={creditMethods} onSubmit={handleCreditSubmit(onReduceCredits)}>
          <Stack>
            <Typography sx={{ pb: 3 }}>
              Enter the amount to <b>reduce</b> credits. Current credits:{' '}
              <b>{currentClientCode?.credits}</b>
            </Typography>
            <RHFTextField
              type="number"
              margin="dense"
              name="amount"
              label="Reduce Credits By"
              fullWidth
              variant="outlined"
              value={creditValues.amount || ''}
              onChange={handleCreditInputChange}
              sx={{ mb: 2 }}
              error={!!creditErrors.amount}
              helperText={creditErrors.amount?.message}
            />
          </Stack>
          <DialogActions>
            <LoadingButton loading={editLoading} onClick={onClose}>
              Cancel
            </LoadingButton>
            <LoadingButton loading={editLoading} variant="contained" type="submit">
              Reduce
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      )}
    </Box>
  );
}

export default CreateEditCodeForm;
