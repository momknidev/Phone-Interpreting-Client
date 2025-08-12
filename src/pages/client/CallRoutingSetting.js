/* eslint-disable no-shadow */
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Card,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
// eslint-disable-next-line import/no-extraneous-dependencies
import { PhoneNumberUtil } from 'google-libphonenumber';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';
import { GET_CALL_ROUTING_SETTING } from '../../graphQL/queries';
import FormProvider from '../../components/hook-form';
import { CREATE_UPDATED_ROUTING_SETTING } from '../../graphQL/mutations';
import { NoPhoneSelected } from './CallReportPage';

const phoneUtil = PhoneNumberUtil.getInstance();

export default function CallRoutingSetting() {
  const { themeStretch, phone } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [updateRoutingSettings, { loading: saving }] = useMutation(CREATE_UPDATED_ROUTING_SETTING);

  const { data, loading, error } = useQuery(GET_CALL_ROUTING_SETTING, {
    variables: { phone_number: phone },
    fetchPolicy: 'no-cache',
  });

  const isPhoneValid = (phone) => {
    try {
      const number = phoneUtil.parseAndKeepRawInput(phone, 'IT'); // Use 'IT' for Italy or dynamically detect
      return phoneUtil.isValidNumber(number);
    } catch (error) {
      return false;
    }
  };
  //   "targetLanguageError": null,
  // "sourceLanguageError": null,
  // "callingCodeError": null
  const NewUserSchema = yup.object().shape({
    enableCode: yup.boolean(),
    callingCodePrompt: yup.string().when('enableCode', {
      is: true,
      then: (schema) => schema.required('Voice message for code prompt is required'),
    }),
    callingCodeError: yup.string().when('enableCode', {
      is: true,
      then: (schema) => schema.required('Error message for code prompt is required'),
    }),
    askSourceLanguage: yup.boolean(),
    sourceLanguagePrompt: yup.string().when('askSourceLanguage', {
      is: true,
      then: (schema) => schema.required('Source language message is required'),
    }),
    sourceLanguageError: yup.string().when('askSourceLanguage', {
      is: true,
      then: (schema) => schema.required('Error message for source language is required'),
    }),
    askTargetLanguage: yup.boolean(),
    targetLanguagePrompt: yup.string().when('askTargetLanguage', {
      is: true,
      then: (schema) => schema.required('Target language message is required'),
    }),
    targetLanguageError: yup.string().when('askTargetLanguage', {
      is: true,
      then: (schema) => schema.required('Error message for target language is required'),
    }),
    interpreterCallType: yup.string().oneOf(['simultaneous', 'sequential']).required(),
    enableFallback: yup.boolean(),
    fallbackType: yup.string().oneOf(['number', 'message']).nullable(),
    fallbackNumber: yup.string().when(['enableFallback', 'fallbackType'], {
      is: (enableFallback, fallbackType) => enableFallback && fallbackType === 'number',
      then: (schema) =>
        schema
          .required('Fallback number is required')
          .test('phone-validation', 'Phone number must be valid', (value) => {
            if (!value) return false;
            return isPhoneValid(value);
          }),
    }),
    fallbackMessage: yup.string().when(['enableFallback', 'fallbackType'], {
      is: (enableFallback, fallbackType) => enableFallback && fallbackType === 'message',
      then: (schema) => schema.required('Fallback message is required'),
    }),
    retryAttempts: yup
      .number()
      .min(0, '0 or more')
      .when('enableFallback', {
        is: true,
        then: (schema) => schema.required('Retry attempts required'),
      }),
  });

  const defaultValues = useMemo(
    () => ({
      enableCode: data?.getCallRoutingSettings?.enable_code ?? false,
      callingCodePrompt: data?.getCallRoutingSettings?.callingCodePrompt ?? '',
      callingCodeError: data?.getCallRoutingSettings?.callingCodeError ?? '',
      askSourceLanguage: data?.getCallRoutingSettings?.askSourceLanguage ?? false,
      sourceLanguagePrompt: data?.getCallRoutingSettings?.sourceLanguagePrompt ?? '',
      sourceLanguageError: data?.getCallRoutingSettings?.sourceLanguageError ?? '',
      askTargetLanguage: data?.getCallRoutingSettings?.askTargetLanguage ?? false,
      targetLanguagePrompt: data?.getCallRoutingSettings?.targetLanguagePrompt ?? '',
      targetLanguageError: data?.getCallRoutingSettings?.targetLanguageError ?? '',
      interpreterCallType: data?.getCallRoutingSettings?.interpreterCallType ?? 'sequential',
      enableFallback: data?.getCallRoutingSettings?.enableFallback ?? false,
      fallbackType: data?.getCallRoutingSettings?.fallbackType ?? null,
      fallbackNumber: data?.getCallRoutingSettings?.fallbackNumber ?? '',
      fallbackMessage: data?.getCallRoutingSettings?.fallbackMessage ?? '',
      retryAttempts: data?.getCallRoutingSettings?.retryAttempts ?? 1,
    }),
    [data]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    watch,
    trigger,
    setValue,
    control,
    formState: { errors },
  } = methods;

  const values = watch();
  console.log({ values, errors });
  // Watchers for conditional rendering
  const enableCode = watch('enableCode');
  const askSourceLanguage = watch('askSourceLanguage');
  const askTargetLanguage = watch('askTargetLanguage');
  const enableFallback = watch('enableFallback');
  const fallbackType = watch('fallbackType');

  useEffect(() => {
    if (data?.getCallRoutingSettings) {
      reset(defaultValues);
    }
  }, [data, reset, defaultValues]);

  const onSubmit = async (formData) => {
    try {
      const payload = {
        ...formData,
        enable_code: formData.enableCode,
        callingCodePromptFile: null,
        sourceLanguagePromptFile: null,
        targetLanguagePromptFile: null,
        phone_number: phone,
      };

      delete payload.enableCode;

      await updateRoutingSettings({
        variables: {
          input: payload,
        },
      });

      enqueueSnackbar('Settings saved successfully.', { variant: 'success' });
    } catch (err) {
      console.error('Failed to save settings:', err);
      enqueueSnackbar('Error in saving settings.', { variant: 'error' });
    }
  };
  if (!phone) {
    return <NoPhoneSelected />;
  }
  if (loading) return <Skeleton width="100%" height={300} />;
  if (error) return `Error: ${error?.message}`;

  return (
    <>
      <Helmet>
        <title>Call Routing Settings | Telephone Mediation App</title>
      </Helmet>

      <Container maxWidth={themeStretch ? false : 'lg'}>
        <CustomBreadcrumbs
          heading="Call Routing Settings"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Call Routing Settings' },
          ]}
        />

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            {/* Section 1: Code Prompt */}
            <Card sx={{ p: 3 }}>
              <Stack direction="column" spacing={2}>
                <Typography variant="h6">Code Prompt Settings</Typography>
                <Controller
                  name="enableCode"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Enable Code Prompt"
                    />
                  )}
                />
                {enableCode && (
                  <>
                    <Controller
                      name="callingCodePrompt"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Voice Message for Code Prompt"
                          multiline
                          error={!!errors.callingCodePrompt}
                          helperText={errors.callingCodePrompt?.message}
                          sx={{ mt: 2 }}
                        />
                      )}
                    />
                    <Controller
                      name="callingCodeError"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Error Message for Code Prompt"
                          multiline
                          error={!!errors.callingCodeError}
                          helperText={errors.callingCodeError?.message}
                          sx={{ mt: 2 }}
                        />
                      )}
                    />
                  </>
                )}{' '}
              </Stack>
              {/* Section 2: Language Prompts */}
              <Typography variant="h6" sx={{ mt: 3 }}>
                Language Prompt Settings
              </Typography>
              <Stack direction="column" alignItems="baseline" spacing={2}>
                <Controller
                  name="askSourceLanguage"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Enable Source Language Prompt"
                    />
                  )}
                />
                {askSourceLanguage && (
                  <Controller
                    name="sourceLanguagePrompt"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        label="Voice Message for Source Language"
                        error={!!errors.sourceLanguagePrompt}
                        helperText={errors.sourceLanguagePrompt?.message}
                        sx={{ mt: 2 }}
                      />
                    )}
                  />
                )}{' '}
                {askSourceLanguage && (
                  <Controller
                    name="sourceLanguageError"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        label="Error Message for Source Language"
                        error={!!errors.sourceLanguageError}
                        helperText={errors.sourceLanguageError?.message}
                        sx={{ mt: 2 }}
                      />
                    )}
                  />
                )}
                <Controller
                  name="askTargetLanguage"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Enable Target Language Prompt"
                    />
                  )}
                />
                {askTargetLanguage && (
                  <Controller
                    name="targetLanguagePrompt"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        label="Voice Message for Target Language"
                        error={!!errors.targetLanguagePrompt}
                        helperText={errors.targetLanguagePrompt?.message}
                        sx={{ mt: 2 }}
                      />
                    )}
                  />
                )}{' '}
                {askTargetLanguage && (
                  <Controller
                    name="targetLanguageError"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        label="Error Message for Target Language"
                        error={!!errors.targetLanguageError}
                        helperText={errors.targetLanguageError?.message}
                        sx={{ mt: 2 }}
                      />
                    )}
                  />
                )}
              </Stack>
              {/* Section 3: Call Algorithm */}
              <Typography variant="h6" sx={{ mt: 3 }}>
                Call Settings
              </Typography>
              <Stack direction="column" spacing={3}>
                <Controller
                  name="interpreterCallType"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel>Call Type</FormLabel>
                      <RadioGroup row {...field}>
                        <FormControlLabel
                          value="simultaneous"
                          control={<Radio />}
                          label="Simultaneous"
                        />
                        <FormControlLabel
                          value="sequential"
                          control={<Radio />}
                          label="Sequential"
                        />
                      </RadioGroup>
                    </FormControl>
                  )}
                />
                <Controller
                  name="retryAttempts"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Retry Attempts"
                      error={!!errors.retryAttempts}
                      helperText={errors.retryAttempts?.message}
                    />
                  )}
                />
              </Stack>
              {/* Section 4: Fallback */}
              <Typography variant="h6" sx={{ mt: 3 }}>
                Fallback Settings
              </Typography>
              <Stack direction="column">
                <Controller
                  name="enableFallback"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Enable Fallback"
                    />
                  )}
                />

                {enableFallback && (
                  <>
                    {/* Fallback Type Selector */}
                    <Controller
                      name="fallbackType"
                      control={control}
                      render={({ field }) => (
                        <FormControl sx={{ mt: 2 }}>
                          <FormLabel>Fallback Option</FormLabel>
                          <RadioGroup
                            row
                            {...field}
                            onChange={(e) => {
                              field.onChange(e);
                              // Reset the other field when switching
                              if (e.target.value === 'number') {
                                setValue('fallbackMessage', '');
                              } else {
                                setValue('fallbackNumber', '');
                              }
                            }}
                          >
                            <FormControlLabel value="number" control={<Radio />} label="Number" />
                            <FormControlLabel value="message" control={<Radio />} label="Message" />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />

                    {/* Conditional Inputs */}
                    {fallbackType === 'number' && (
                      <Controller
                        name="fallbackNumber"
                        control={control}
                        render={({ field }) => (
                          <Stack spacing={1} mt={2}>
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
                              value={field.value}
                              onChange={(val) =>
                                setValue('fallbackNumber', val, { shouldDirty: true })
                              }
                              onBlur={() => trigger('fallbackNumber')}
                            />
                            {errors.fallbackNumber && (
                              <Typography variant="caption" color="error">
                                {errors.fallbackNumber.message}
                              </Typography>
                            )}
                          </Stack>
                        )}
                      />
                    )}

                    {fallbackType === 'message' && (
                      <Controller
                        name="fallbackMessage"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            fullWidth
                            label="Fallback Message"
                            multiline
                            error={!!errors.fallbackMessage}
                            helperText={errors.fallbackMessage?.message}
                            sx={{ mt: 2 }}
                          />
                        )}
                      />
                    )}
                  </>
                )}
              </Stack>
            </Card>

            <LoadingButton type="submit" variant="contained" size="large" loading={saving}>
              Save
            </LoadingButton>
          </Stack>
        </FormProvider>
      </Container>
    </>
  );
}
