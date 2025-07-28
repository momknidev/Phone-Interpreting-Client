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
import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../../../components/hook-form';
import { EDIT_CLIENT } from '../../../../../graphQL/mutations';
import { PATH_DASHBOARD } from '../../../../../routes/paths';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ currentUser }) {
  console.log({ currentUser });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [editClient] = useMutation(EDIT_CLIENT);
  const NewUserSchema = Yup.object().shape({
    avatar_url: Yup.mixed().nullable(),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string().required('Phone is required'),
    isAdmin: Yup.boolean().required('Role is required'),
    department: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      avatar_url: currentUser?.avatar_url || null,
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      isAdmin: currentUser?.role === 'admin' ? true : false || false,
      password: '',
      department: currentUser?.department || '',
      type: 'intranet',
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
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  console.log({ values });
  useEffect(() => {
    reset(defaultValues);
  }, [currentUser, reset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      await editClient({
        variables: {
          id: currentUser.id,
          clientDetails: {
            first_name: data.first_name,
            last_name: data.last_name,
            email: currentUser?.email,
            phone: data.phone,

            department: data.department,
            type: currentUser.type,
            role: currentUser?.role,
          },
          file: data.avatar_url ? data.avatar_url[0] : null,
        },
      });
      reset();
      navigate(PATH_DASHBOARD.intranetDashboard);
      enqueueSnackbar('User update!');
    } catch (error) {
      console.error(error);
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
        setValue('avatar_url', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 4, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="avatar_url"
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
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 2 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="first_name" label="First Name" />
              <RHFTextField name="last_name" label="Last Name" />
              <RHFTextField disabled name="email" label="Email Address" />
              <RHFTextField name="phone" label="Phone Number" />
              {/* <RHFTextField autoComplete='off' name="password" label="Password" type="password" /> */}
              <RHFTextField name="department" label="Department" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
