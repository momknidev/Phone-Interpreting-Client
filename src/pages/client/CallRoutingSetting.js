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
  Autocomplete,
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

const twilioVoices = [
  { label: 'Afrikaans (South Africa)', code: 'af-ZA' },
  { label: 'Arabic (Standard)', code: 'ar-XA' },
  { label: 'Basque (Spain)', code: 'eu-ES' },
  { label: 'Bengali (India)', code: 'bn-IN' },
  { label: 'Bulgarian (Bulgaria)', code: 'bg-BG' },
  { label: 'Catalan (Spain)', code: 'ca-ES' },
  { label: 'Chinese Cantonese (Hong Kong)', code: 'yue-HK' },
  { label: 'Chinese Mandarin', code: 'cmn-CN' },
  { label: 'Chinese Mandarin (Taiwan)', code: 'cmn-TW' },
  { label: 'Czech (Czech Republic)', code: 'cs-CZ' },
  { label: 'Danish (Denmark)', code: 'da-DK' },
  { label: 'Dutch (Belgium)', code: 'nl-BE' },
  { label: 'Dutch (Netherlands)', code: 'nl-NL' },
  { label: 'English (Australia)', code: 'en-AU' },
  { label: 'English (India)', code: 'en-IN' },
  { label: 'English (UK)', code: 'en-GB' },
  { label: 'English (US)', code: 'en-US' },
  { label: 'Filipino (Philippines)', code: 'fil-PH' },
  { label: 'Finnish (Finland)', code: 'fi-FI' },
  { label: 'French (Canada)', code: 'fr-CA' },
  { label: 'French (France)', code: 'fr-FR' },
  { label: 'Galician (Spain)', code: 'gl-ES' },
  { label: 'German (Germany)', code: 'de-DE' },
  { label: 'Greek (Greece)', code: 'el-GR' },
  { label: 'Gujarati (India)', code: 'gu-IN' },
  { label: 'Hebrew (Israel)', code: 'he-IL' },
  { label: 'Hindi (India)', code: 'hi-IN' },
  { label: 'Hungarian (Hungary)', code: 'hu-HU' },
  { label: 'Icelandic (Iceland)', code: 'is-IS' },
  { label: 'Indonesian (Indonesia)', code: 'id-ID' },
  { label: 'Italian (Italy)', code: 'it-IT' },
  { label: 'Japanese (Japan)', code: 'ja-JP' },
  { label: 'Kannada (India)', code: 'kn-IN' },
  { label: 'Korean (South Korea)', code: 'ko-KR' },
  { label: 'Malay (Malaysia)', code: 'ms-MY' },
  { label: 'Malayalam (India)', code: 'ml-IN' },
  { label: 'Marathi (India)', code: 'mr-IN' },
  { label: 'Norwegian (Norway)', code: 'nb-NO' },
  { label: 'Polish (Poland)', code: 'pl-PL' },
  { label: 'Portuguese (Brazil)', code: 'pt-BR' },
  { label: 'Portuguese (Portugal)', code: 'pt-PT' },
  { label: 'Punjabi (India)', code: 'pa-IN' },
  { label: 'Romanian (Romania)', code: 'ro-RO' },
  { label: 'Russian (Russia)', code: 'ru-RU' },
  { label: 'Slovak (Slovakia)', code: 'sk-SK' },
  { label: 'Spanish (Spain)', code: 'es-ES' },
  { label: 'Spanish (US)', code: 'es-US' },
  { label: 'Swedish (Sweden)', code: 'sv-SE' },
  { label: 'Tamil (India)', code: 'ta-IN' },
  { label: 'Telugu (India)', code: 'te-IN' },
  { label: 'Thai (Thailand)', code: 'th-TH' },
  { label: 'Turkish (Turkey)', code: 'tr-TR' },
  { label: 'Vietnamese (Vietnam)', code: 'vi-VN' },
];

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

  const NewUserSchema = yup.object().shape({
    language: yup.string().required('Primary language selection is required'),
    welcomeMessage: yup.string().required('Welcome message is required'),
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
    fallbackNumber: yup.string().when('enableFallback', {
      is: true,
      then: (schema) =>
        schema
          .required('Fallback number is required')
          .test('phone-validation', 'Phone number must be valid', (value) => {
            if (!value) return false;
            return isPhoneValid(value);
          }),
    }),
    retryAttempts: yup
      .number()
      .min(0, '0 or more')
      .when('enableFallback', {
        is: true,
        then: (schema) => schema.required('Retry attempts required'),
      }),
    creditError: yup.string().required('Low credit error message is required'),
    noAnswerMessage: yup.string().required('No answer message is required'),
    digitsTimeOut: yup
      .number()
      .min(1, 'Timeout must be at least 1 second')
      .required('Timeout for digit inputs is required'),
  });

  const defaultValues = useMemo(
    () => ({
      language: data?.getCallRoutingSettings?.language ?? '',
      welcomeMessage: data?.getCallRoutingSettings?.welcomeMessage ?? '',
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
      creditError: data?.getCallRoutingSettings?.creditError ?? '',
      noAnswerMessage: data?.getCallRoutingSettings?.noAnswerMessage ?? '',
      digitsTimeOut: data?.getCallRoutingSettings?.digitsTimeOut ?? '',
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
            {/* Section 0: Language Selection */}
            <Card sx={{ p: 3 }}>
              <Stack direction="column" spacing={2}>
                <Typography variant="h6">Language Settings</Typography>
                <Controller
                  name="language"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      {...field}
                      options={twilioVoices}
                      getOptionLabel={(option) => option.label || ''}
                      value={twilioVoices.find((lang) => lang.code === field.value) || null}
                      onChange={(_, newValue) => {
                        field.onChange(newValue ? newValue.code : '');
                      }}
                      clearIcon={null}
                      disableClearable
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Primary Language *"
                          error={!!errors.language}
                          helperText={errors.language?.message}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="welcomeMessage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Welcome Message *"
                      multiline
                      rows={3}
                      error={!!errors.welcomeMessage}
                      helperText={errors.welcomeMessage?.message}
                      placeholder="Enter the welcome message that will be played to callers"
                    />
                  )}
                />
              </Stack>
            </Card>

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
                          label="Voice Message for Code Prompt *"
                          multiline
                          rows={3}
                          error={!!errors.callingCodePrompt}
                          helperText={errors.callingCodePrompt?.message}
                          placeholder="Enter the voice message for code prompt"
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
                          label="Error Message for Code Prompt *"
                          multiline
                          rows={3}
                          error={!!errors.callingCodeError}
                          helperText={errors.callingCodeError?.message}
                          placeholder="Enter the error message for code prompt"
                        />
                      )}
                    />
                  </>
                )}
              </Stack>

              {/* Section 2: Language Prompts */}
              <Typography variant="h6" sx={{ mt: 3 }}>
                Language Prompt Settings
              </Typography>
              <Stack direction="column" spacing={2}>
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
                  <>
                    <Controller
                      name="sourceLanguagePrompt"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Voice Message for Source Language *"
                          multiline
                          rows={3}
                          error={!!errors.sourceLanguagePrompt}
                          helperText={errors.sourceLanguagePrompt?.message}
                          placeholder="Enter the voice message for source language"
                        />
                      )}
                    />
                    <Controller
                      name="sourceLanguageError"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Error Message for Source Language *"
                          multiline
                          rows={3}
                          error={!!errors.sourceLanguageError}
                          helperText={errors.sourceLanguageError?.message}
                          placeholder="Enter the error message for source language"
                        />
                      )}
                    />
                  </>
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
                  <>
                    <Controller
                      name="targetLanguagePrompt"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Voice Message for Target Language *"
                          multiline
                          rows={3}
                          error={!!errors.targetLanguagePrompt}
                          helperText={errors.targetLanguagePrompt?.message}
                          placeholder="Enter the voice message for target language"
                        />
                      )}
                    />
                    <Controller
                      name="targetLanguageError"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="Error Message for Target Language *"
                          multiline
                          rows={3}
                          error={!!errors.targetLanguageError}
                          helperText={errors.targetLanguageError?.message}
                          placeholder="Enter the error message for target language"
                        />
                      )}
                    />
                  </>
                )}
              </Stack>

              {/* Section 3: Call Algorithm */}
              <Typography variant="h6" sx={{ mt: 3 }}>
                Call Settings
              </Typography>
              <Stack direction="column" spacing={2}>
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
                      label="Retry Attempts *"
                      multiline
                      rows={1}
                      error={!!errors.retryAttempts}
                      helperText={errors.retryAttempts?.message}
                      placeholder="Enter number of retry attempts"
                    />
                  )}
                />
                <Controller
                  name="digitsTimeOut"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Timeout for Digit Inputs (seconds) *"
                      multiline
                      rows={1}
                      error={!!errors.digitsTimeOut}
                      helperText={errors.digitsTimeOut?.message}
                      placeholder="Enter timeout in seconds"
                    />
                  )}
                />
              </Stack>

              {/* Section 4: Error Messages */}

              <Stack direction="column" pt={3} spacing={2}>
                <Controller
                  name="creditError"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Low Credit Error Message *"
                      multiline
                      rows={3}
                      error={!!errors.creditError}
                      helperText={errors.creditError?.message}
                      placeholder="Enter the low credit error message"
                    />
                  )}
                />
              </Stack>

              {/* Section 5: Fallback */}
              <Typography variant="h6" sx={{ mt: 3 }}>
                Fallback Settings
              </Typography>
              <Stack direction="column" spacing={2}>
                <Controller
                  name="enableFallback"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Enable Fallback Number"
                    />
                  )}
                />

                {enableFallback && (
                  <Controller
                    name="fallbackNumber"
                    control={control}
                    render={({ field }) => (
                      <Stack spacing={1}>
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
                          onChange={(val) => setValue('fallbackNumber', val, { shouldDirty: true })}
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

                <Controller
                  name="noAnswerMessage"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="No Answer Message *"
                      multiline
                      rows={3}
                      error={!!errors.noAnswerMessage}
                      helperText={errors.noAnswerMessage?.message}
                      placeholder="Enter the no answer message"
                    />
                  )}
                />
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
