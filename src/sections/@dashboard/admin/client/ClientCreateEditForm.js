import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useMutation } from '@apollo/client';

import { Box, Card, Grid, Stack, Typography } from '@mui/material';
// components
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { EDIT_CLIENT, ADD_CLIENT } from '../../../../graphQL/mutations';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

ClientCreateEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function ClientCreateEditForm({ isEdit = false, currentUser }) {
  console.log({ currentUser });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [editClient] = useMutation(EDIT_CLIENT);
  const [addClient] = useMutation(ADD_CLIENT);

  const NewUserSchema = Yup.object().shape({
    avatarUrl: Yup.mixed().nullable(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string().required('Phone is required'),
    password: isEdit
      ? Yup.string()
          .min(8, 'Password must be at least 8 characters')
          .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
          .matches(/[0-9]/, 'Password must contain at least one number')
          .matches(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character')
          .nullable()
      : Yup.string()
          .required('Password is required')
          .min(8, 'Password must be at least 8 characters')
          .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
          .matches(/[0-9]/, 'Password must contain at least one number')
          .matches(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character'),
  });

  const defaultValues = useMemo(
    () => ({
      avatarUrl: currentUser?.avatarUrl || null,
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      phone: currentUser?.phone || '',
      email: currentUser?.email || '',
      password: '',
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  console.log({ values, errors });
  useEffect(() => {
    reset(defaultValues);
  }, [currentUser, reset, defaultValues]);

  const onSubmit = async (data) => {
    console.log({ data });
    try {
      if (isEdit) {
        await editClient({
          variables: {
            id: currentUser.id,
            userDetails: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: currentUser.email,
              role: 'client',
              phone: data.phone,
              type: 'client',
              ...(data.password && { password: data.password }),
            },
            file: data.avatarUrl ? data.avatarUrl[0] : null,
          },
        });
        enqueueSnackbar('Update success!');
      } else {
        await addClient({
          variables: {
            userDetails: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              role: 'client',
              phone: data.phone,
              type: 'client',
              password: data.password,
            },
            file: data.avatarUrl ? data.avatarUrl[0] : null,
          },
        });
        enqueueSnackbar('Client added successfully!');
      }
      reset();
      navigate(PATH_DASHBOARD.adminClients.list);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 2, maxWidth: 800, mx: 'auto' }}>
            <Box sx={{ mb: 2 }}>
              <RHFUploadAvatar
                name="avatarUrl"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of 3MB
                  </Typography>
                }
              />
            </Box>

            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="email" label="Email Address" disabled={isEdit} />
              <RHFTextField name="phone" label="Phone Number" />

              <RHFTextField
                name="password"
                label={isEdit ? 'New Password (Optional)' : 'Password'}
                type="password"
              />
            </Box>

            <Stack alignItems="center" sx={{ mt: 3 }}>
              <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting}>
                {isEdit ? 'Save Changes' : 'Create Client'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
