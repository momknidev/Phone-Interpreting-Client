/* eslint-disable no-shadow */
import { useState } from 'react';
import * as Yup from 'yup';
// import { Link as RouterLink } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// graphQL
import { useLazyQuery } from '@apollo/client';
import jwtDecode from 'jwt-decode';

// routes
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { LOGIN } from '../../graphQL/queries';
import { useSettingsContext } from '../../components/settings';

// ----------------------------------------------------------------------

export default function AuthLoginForm() {
  const { onChangePhone } = useSettingsContext();
  const { login } = useAuthContext();
  const [loginPortal, { loading }] = useLazyQuery(LOGIN);
  const [showPassword, setShowPassword] = useState(false);
  const LoginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      const { data: responseData, error: queryErrors } = await loginPortal({
        variables: {
          email: data.email,
          password: data.password,
        },
        fetchPolicy: 'no-cache',
      });

      if (queryErrors) {
        setError('afterSubmit', {
          message: queryErrors?.message,
        });
        return;
      }
      const token = responseData?.login?.token;

      if (token) {
        await login(token);
        const user = jwtDecode(token);
        console.log('User:', user);
        onChangePhone(user?.client_phones[0]?.phone);
        reset();
      } else {
        setError('afterSubmit', {
          message: 'Login failed, no token received.',
        });
        reset();
      }
    } catch (error) {
      console.error(error);
      setError('afterSubmit', {
        message: error.message || 'An unknown error occurred.',
      });
      reset();
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
        <RHFTextField name="email" label="Email Address" />
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitSuccessful || isSubmitting || loading}
        sx={{
          my: 3,
          bgcolor: 'text.primary',
          color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: (theme) => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Login
      </LoadingButton>
    </FormProvider>
  );
}
