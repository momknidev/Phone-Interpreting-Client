import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useMutation } from '@apollo/client';

// components
import Iconify from '../../../../../components/iconify';
import { useSnackbar } from '../../../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../../../components/hook-form';
import { UPDATE_USER_PASSWORD } from '../../../../../graphQL/mutations';
import { useAuthContext } from '../../../../../auth/useAuthContext';

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const [updatePassword] = useMutation(UPDATE_USER_PASSWORD);
  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
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
          id: user?.id,
          oldPassword: data?.oldPassword,
          newPassword: data?.newPassword,
        },
      });
      reset();
      enqueueSnackbar('Update success!');
      console.log('DATA', data);
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
          maxWidth: 600,
        }}
      >
        <Stack
          spacing={3}
          alignItems="center"
          sx={{
            p: 3,
            width: '100%',
            maxWidth: 600,
          }}
        >
          <RHFTextField name="oldPassword" type="password" label="Old Password" />

          <RHFTextField
            name="newPassword"
            type="password"
            label="New Password"
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> Password must be
                minimum 8+, contain letters, numbers and special characters
              </Stack>
            }
          />

          <RHFTextField name="confirmNewPassword" type="password" label="Confirm New Password" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Save Changes
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
