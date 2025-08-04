import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

import { useMutation } from '@apollo/client';
import { Box, Card, Grid, Stack, Typography, IconButton, Button } from '@mui/material';
import { PhoneInput } from 'react-international-phone';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PhoneNumberUtil } from 'google-libphonenumber';

import FormProvider, { RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form';
import { EDIT_CLIENT, ADD_CLIENT } from '../../../../graphQL/mutations';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Iconify from '../../../../components/iconify';

const phoneUtil = PhoneNumberUtil.getInstance();

ClientCreateEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function ClientCreateEditForm({ isEdit = false, currentUser }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [editClient] = useMutation(EDIT_CLIENT);
  const [addClient] = useMutation(ADD_CLIENT);
  const isPhoneValid = (phone) => {
    try {
      const number = phoneUtil.parseAndKeepRawInput(phone, 'IT'); // Use 'IT' for Italy or dynamically detect
      return phoneUtil.isValidNumber(number);
    } catch (error) {
      return false;
    }
  };
  const NewUserSchema = Yup.object().shape({
    avatar_url: Yup.mixed().nullable(),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phone: Yup.string()

      .required('Phone is required')
      .test('phone-validation', 'Phone number must be valid', (value) => {
        if (!value) return false;
        return isPhoneValid(value);
      })
      .nullable(),
    phone_list: Yup.array().of(
      Yup.object().shape({
        label: Yup.string().required('Label is required'),
        phone: Yup.string()
          .required('Phone is required')
          .test('phone-validation', 'Phone number must be valid', (value) => {
            if (!value) return false;
            return isPhoneValid(value);
          }),
      })
    ),
    password: isEdit
      ? Yup.string()
          .nullable()
          .transform((value) => (value === '' ? null : value))
          .test('password-validation', 'Password must meet requirements', (value, context) => {
            if (!value) return true;
            const hasMinLength = value.length >= 8;
            const hasLetter = /[a-zA-Z]/.test(value);
            const hasNumber = /[0-9]/.test(value);
            const hasSpecialChar = /[!@#$%^&*]/.test(value);
            if (!hasMinLength)
              return context.createError({ message: 'Password must be at least 8 characters' });
            if (!hasLetter)
              return context.createError({ message: 'Password must contain at least one letter' });
            if (!hasNumber)
              return context.createError({ message: 'Password must contain at least one number' });
            if (!hasSpecialChar)
              return context.createError({
                message: 'Password must contain at least one special character',
              });
            return true;
          })
      : Yup.string()
          .required('Password is required')
          .min(8, 'Password must be at least 8 characters')
          .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
          .matches(/[0-9]/, 'Password must contain at least one number')
          .matches(/(?=.*[!@#$%^&*])/, 'Password must contain at least one special character'),
  });

  const defaultValues = useMemo(
    () => ({
      avatar_url: currentUser?.avatar_url || null,
      first_name: currentUser?.first_name || '',
      last_name: currentUser?.last_name || '',
      phone: currentUser?.phone || null,
      email: currentUser?.email || '',
      password: '',
      phone_list: currentUser?.client_phones || [],
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
    trigger,
    control,
    watch,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  console.log('Form Values:', values, 'Errors', errors);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'phone_list',
  });

  const onSubmit = async (data) => {
    try {
      const variables = {
        clientDetails: {
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          role: 'client',
          phone: data.phone,
          phoneList:
            data.phone_list?.map((item) => ({
              label: item.label,
              phone: item.phone,
            })) || [],
          type: 'client',
          ...(data.password && { password: data.password }),
        },

        file: data.avatar_url && typeof data.avatar_url !== 'string' ? data.avatar_url[0] : null,
      };

      if (isEdit) {
        await editClient({
          variables: {
            id: currentUser.id,
            ...variables,
          },
        });
        enqueueSnackbar('Update success!');
      } else {
        await addClient({ variables });
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
        setValue('avatar_url', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 2, mx: 'auto' }}>
            <Box sx={{ mb: 2 }}>
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

            <Box
              rowGap={2}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="first_name" label="First Name" />
              <RHFTextField name="last_name" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <div>
                <PhoneInput
                  defaultCountry="it"
                  inputStyle={{
                    width: '100%',
                    height: '56px',
                    borderRadius: '4px',
                    border: '1px solid #ced4da',
                    padding: '10px 12px',
                    fontSize: '16px',
                    boxSizing: 'border-box',
                  }}
                  buttonStyle={{
                    height: '56px',
                  }}
                  value={values?.phone ?? ''}
                  onChange={(phone) => {
                    setValue('phone', phone, { shouldDirty: true });
                  }}
                  onBlur={() => {
                    trigger('phone');
                  }}
                />
                {errors.phone && (
                  <Typography variant="caption" color="error">
                    {errors.phone.message}
                  </Typography>
                )}
              </div>
              <RHFTextField
                name="password"
                label={isEdit ? 'New Password (Optional)' : 'Password'}
                type="password"
              />
            </Box>

            <Box sx={{ mt: 4 }}>
              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Typography variant="subtitle1" gutterBottom>
                  Client Phone Numbers
                </Typography>

                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                  onClick={() => append({ label: '', phone: '' })}
                >
                  Add Phone
                </Button>
              </Stack>
              <Stack spacing={2}>
                {fields.map((item, index) => (
                  <Grid container key={item.id}>
                    <Grid item xs={12} sm={12} md={12}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Stack direction="row" spacing={2} flexGrow={1}>
                          <RHFTextField name={`phone_list.${index}.label`} label="Label" />

                          <div>
                            <PhoneInput
                              defaultCountry="it"
                              inputStyle={{
                                width: '100%',
                                height: '56px',
                                borderRadius: '4px',
                                border: '1px solid #ced4da',
                                padding: '10px 12px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                              }}
                              buttonStyle={{
                                height: '56px',
                              }}
                              value={values?.phone_list[index]?.phone ?? ''}
                              onChange={(phone) => {
                                setValue(`phone_list.${index}.phone`, phone, { shouldDirty: true });
                              }}
                              onBlur={() => {
                                trigger(`phone_list.${index}.phone`);
                              }}
                            />
                            {Array.isArray(errors.phone_list) &&
                              errors.phone_list[index] &&
                              errors.phone_list[index].phone && (
                                <Typography variant="caption" color="error">
                                  {errors.phone_list[index].phone.message}
                                </Typography>
                              )}
                          </div>
                        </Stack>
                        <Stack direction="row" spacing={2} flexGrow={1}>
                          <IconButton color="error" onClick={() => remove(index)}>
                            <Iconify icon="eva:trash-2-outline" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            </Box>

            <Stack alignItems="center" sx={{ mt: 4 }}>
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
