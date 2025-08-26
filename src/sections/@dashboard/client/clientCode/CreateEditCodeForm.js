/* eslint-disable react/prop-types */
import { DialogActions, Stack, Typography } from '@mui/material';
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

  const [createClientCode, { loading: createLoading }] = useMutation(CREATE_CLIENT_CODE);
  const [updateClientCode, { loading: editLoading }] = useMutation(UPDATE_CLIENT_CODE);
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
  const defaultValues = {
    client_code: currentClientCode?.client_code || '',
    code_label: currentClientCode?.code_label || '',
    credits: currentClientCode?.credits || 0,
    status: currentClientCode?.status || 'active',
  };
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    trigger,
    // control,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  console.log('form errors', errors, values);
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
  const handleInputChange = (e) => {
    console.log(e.target.name, e.target.value);
    const { name, value } = e.target;
    setValue(name, value);
  };
  return (
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
  );
}

export default CreateEditCodeForm;
