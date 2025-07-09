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
import { ADD_CLIENT, EDIT_CLIENT } from '../../../../graphQL/mutations';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit = false, currentUser }) {
  console.log({ currentUser });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [editClient] = useMutation(EDIT_CLIENT);
  const [addClient] = useMutation(ADD_CLIENT);
  const NewUserSchema = Yup.object().shape({
    avatarUrl: Yup.mixed().nullable(),
    firstName: Yup.string().required('Il nome è obbligatorio'),
    lastName: Yup.string().required('Il cognome è obbligatorio'),
    email: Yup.string()
      .required('Email è obbligatoria')
      .email('Email deve essere un indirizzo valido'),
    phone: Yup.string().required('Telefono è obbligatorio'),
    isAdmin: Yup.boolean().required('Ruolo è obbligatorio'),
    password: Yup.string().when([], {
      is: () => isEdit,
      then: () => Yup.string(),
      otherwise: () => Yup.string().required('La password è obbligatoria'),
    }),
    department: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      avatarUrl: currentUser?.avatarUrl || null,
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
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
    resolver: yupResolver(NewUserSchema, { context: { isEdit } }),
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
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser, reset, defaultValues]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await editClient({
          variables: {
            id: currentUser.id,
            clientDetails: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              password: data.password,
              department: data.department,
              type: data.type,
              role: 'admin',
            },
            file: data.avatarUrl ? data.avatarUrl[0] : null,
          },
        });
      } else {
        await addClient({
          variables: {
            clientDetails: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phone: data.phone,
              password: data.password,
              department: data.department,
              type: data.type,
              role: 'admin',
            },
            file: data.avatarUrl ? data.avatarUrl[0] : null,
          },
        });
      }

      reset();
      navigate(PATH_DASHBOARD.intranetUser.list);
      enqueueSnackbar(!isEdit ? 'Utente creato!' : 'Utente aggiornato!');
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
        setValue('avatarUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 5 }}>
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
                    Consentiti *.jpeg, *.jpg, *.png, *.gif
                    <br /> dimensione massima di 3MB
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
              <RHFTextField name="firstName" label="Nome" />
              <RHFTextField name="lastName" label="Cognome" />
              <RHFTextField name="email" label="Indirizzo E-mail" />
              <RHFTextField name="phone" label="Numero di Telefono" />

              <RHFTextField autoComplete="off" name="password" label="Password" type="password" />
              {/* <RHFTextField name="department" label="Dipartimento" /> */}

              {/* 
              <Controller
                name="isAdmin"
                control={methods.control}
                render={({ field }) => (
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 0 }}>
                      È Amministratore?
                    </Typography>
                    <RadioGroup
                      row
                      value={String(field.value)}
                      onChange={(e) => field.onChange(e.target.value === 'true')}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Sì"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </Box>
                )}
              /> */}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Crea Utente' : 'Salva Modifiche'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
