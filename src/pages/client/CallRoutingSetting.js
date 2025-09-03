/* eslint-disable react/prop-types */
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
  Button,
  Box,
  Chip,
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
import Iconify from '../../components/iconify';

const phoneUtil = PhoneNumberUtil.getInstance();

export const twilioVoices = [
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

  // eslint-disable-next-line no-shadow
  const isPhoneValid = (phone) => {
    try {
      const number = phoneUtil.parseAndKeepRawInput(phone, 'IT');
      return phoneUtil.isValidNumber(number);
      // eslint-disable-next-line no-shadow
    } catch (error) {
      return false;
    }
  };

  const NewUserSchema = yup.object().shape({
    language: yup.string().required('Primary language selection is required'),

    // Welcome Message
    welcomeMessageMode: yup.string().oneOf(['text', 'audio']).required(),
    welcomeMessageText: yup
      .string()
      .when('welcomeMessageMode', {
        is: 'text',
        then: (schema) => schema.required('Welcome message is required'),
      })
      .nullable(),
    welcomeMessageFile: yup
      .mixed()
      .when('welcomeMessageMode', {
        is: 'audio',
        then: (schema) => schema.required('Welcome message audio file is required'),
      })
      .nullable(),

    enableCode: yup.boolean(),

    // Calling Code Prompt
    callingCodePromptMode: yup.string().when('enableCode', {
      is: true,
      then: (schema) => schema.oneOf(['text', 'audio']).required(),
    }),
    callingCodePromptText: yup
      .string()
      .when(['enableCode', 'callingCodePromptMode'], {
        is: (enableCode, mode) => enableCode && mode === 'text',
        then: (schema) => schema.required('Voice message for code prompt is required'),
      })
      .nullable(),
    callingCodePromptFile: yup
      .mixed()
      .when(['enableCode', 'callingCodePromptMode'], {
        is: (enableCode, mode) => enableCode && mode === 'audio',
        then: (schema) => schema.required('Voice message audio file for code prompt is required'),
      })
      .nullable(),

    // Calling Code Error
    callingCodeErrorMode: yup
      .string()
      .when('enableCode', {
        is: true,
        then: (schema) => schema.oneOf(['text', 'audio']).required(),
      })
      .nullable(),
    callingCodeErrorText: yup
      .string()
      .when(['enableCode', 'callingCodeErrorMode'], {
        is: (enableCode, mode) => enableCode && mode === 'text',
        then: (schema) => schema.required('Error message for code prompt is required'),
      })
      .nullable(),
    callingCodeErrorFile: yup
      .mixed()
      .when(['enableCode', 'callingCodeErrorMode'], {
        is: (enableCode, mode) => enableCode && mode === 'audio',
        then: (schema) => schema.required('Error message audio file for code prompt is required'),
      })
      .nullable(),

    askSourceLanguage: yup.boolean(),

    // Source Language Prompt
    sourceLanguagePromptMode: yup
      .string()
      .when('askSourceLanguage', {
        is: true,
        then: (schema) => schema.oneOf(['text', 'audio']).required(),
      })
      .nullable(),
    sourceLanguagePromptText: yup
      .string()
      .when(['askSourceLanguage', 'sourceLanguagePromptMode'], {
        is: (askSourceLanguage, mode) => askSourceLanguage && mode === 'text',
        then: (schema) => schema.required('Source language message is required'),
      })
      .nullable(),
    sourceLanguagePromptFile: yup
      .mixed()
      .when(['askSourceLanguage', 'sourceLanguagePromptMode'], {
        is: (askSourceLanguage, mode) => askSourceLanguage && mode === 'audio',
        then: (schema) => schema.required('Source language audio file is required'),
      })
      .nullable(),

    // Source Language Error
    sourceLanguageErrorMode: yup
      .string()
      .when('askSourceLanguage', {
        is: true,
        then: (schema) => schema.oneOf(['text', 'audio']).required(),
      })
      .nullable(),
    sourceLanguageErrorText: yup
      .string()
      .when(['askSourceLanguage', 'sourceLanguageErrorMode'], {
        is: (askSourceLanguage, mode) => askSourceLanguage && mode === 'text',
        then: (schema) => schema.required('Error message for source language is required'),
      })
      .nullable(),
    sourceLanguageErrorFile: yup
      .mixed()
      .when(['askSourceLanguage', 'sourceLanguageErrorMode'], {
        is: (askSourceLanguage, mode) => askSourceLanguage && mode === 'audio',
        then: (schema) =>
          schema.required('Error message audio file for source language is required'),
      })
      .nullable(),

    askTargetLanguage: yup.boolean(),

    // Target Language Prompt
    targetLanguagePromptMode: yup
      .string()
      .when('askTargetLanguage', {
        is: true,
        then: (schema) => schema.oneOf(['text', 'audio']).required(),
      })
      .nullable(),
    targetLanguagePromptText: yup
      .string()
      .when(['askTargetLanguage', 'targetLanguagePromptMode'], {
        is: (askTargetLanguage, mode) => askTargetLanguage && mode === 'text',
        then: (schema) => schema.required('Target language message is required'),
      })
      .nullable(),
    targetLanguagePromptFile: yup
      .mixed()
      .when(['askTargetLanguage', 'targetLanguagePromptMode'], {
        is: (askTargetLanguage, mode) => askTargetLanguage && mode === 'audio',
        then: (schema) => schema.required('Target language audio file is required'),
      })
      .nullable(),

    // Target Language Error
    targetLanguageErrorMode: yup
      .string()
      .when('askTargetLanguage', {
        is: true,
        then: (schema) => schema.oneOf(['text', 'audio']).required(),
      })
      .nullable(),
    targetLanguageErrorText: yup
      .string()
      .when(['askTargetLanguage', 'targetLanguageErrorMode'], {
        is: (askTargetLanguage, mode) => askTargetLanguage && mode === 'text',
        then: (schema) => schema.required('Error message for target language is required'),
      })
      .nullable(),
    targetLanguageErrorFile: yup
      .mixed()
      .when(['askTargetLanguage', 'targetLanguageErrorMode'], {
        is: (askTargetLanguage, mode) => askTargetLanguage && mode === 'audio',
        then: (schema) =>
          schema.required('Error message audio file for target language is required'),
      })
      .nullable(),

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

    // Credit Error
    creditErrorMode: yup.string().oneOf(['text', 'audio']).required(),
    creditErrorText: yup
      .string()
      .when('creditErrorMode', {
        is: 'text',
        then: (schema) => schema.required('Low credit error message is required'),
      })
      .nullable(),
    creditErrorFile: yup
      .mixed()
      .when('creditErrorMode', {
        is: 'audio',
        then: (schema) => schema.required('Low credit error audio file is required'),
      })
      .nullable(),

    // No Answer Message
    noAnswerMessageMode: yup.string().oneOf(['text', 'audio']).required(),
    noAnswerMessageText: yup
      .string()
      .when('noAnswerMessageMode', {
        is: 'text',
        then: (schema) => schema.required('No answer message is required'),
      })
      .nullable(),
    noAnswerMessageFile: yup
      .mixed()
      .when('noAnswerMessageMode', {
        is: 'audio',
        then: (schema) => schema.required('No answer message audio file is required'),
      })
      .nullable(),

    digitsTimeOut: yup
      .number()
      .min(1, 'Timeout must be at least 1 second')
      .required('Timeout for digit inputs is required'),
  });

  const defaultValues = useMemo(
    () => ({
      language: data?.getCallRoutingSettings?.language ?? '',
      welcomeMessageText: data?.getCallRoutingSettings?.welcomeMessageText ?? '',
      welcomeMessageMode: data?.getCallRoutingSettings?.welcomeMessageMode ?? 'text',
      welcomeMessageFile: data?.getCallRoutingSettings?.welcomeMessageFile
        ? data?.getCallRoutingSettings?.welcomeMessageFile
        : null,
      enableCode: data?.getCallRoutingSettings?.enable_code ?? false,
      callingCodePromptText: data?.getCallRoutingSettings?.callingCodePromptText ?? '',
      callingCodePromptMode: data?.getCallRoutingSettings?.callingCodePromptMode ?? 'text',
      callingCodePromptFile: data?.getCallRoutingSettings?.callingCodePromptFile
        ? data?.getCallRoutingSettings?.callingCodePromptFile
        : null,
      callingCodeErrorText: data?.getCallRoutingSettings?.callingCodeErrorText ?? '',
      callingCodeErrorMode: data?.getCallRoutingSettings?.callingCodeErrorMode ?? 'text',
      callingCodeErrorFile: data?.getCallRoutingSettings?.callingCodeErrorFile
        ? data?.getCallRoutingSettings?.callingCodeErrorFile
        : null,
      askSourceLanguage: data?.getCallRoutingSettings?.askSourceLanguage ?? false,
      sourceLanguagePromptText: data?.getCallRoutingSettings?.sourceLanguagePromptText ?? '',
      sourceLanguagePromptMode: data?.getCallRoutingSettings?.sourceLanguagePromptMode ?? 'text',
      sourceLanguagePromptFile: data?.getCallRoutingSettings?.sourceLanguagePromptFile
        ? data?.getCallRoutingSettings?.sourceLanguagePromptFile
        : null,
      sourceLanguageErrorText: data?.getCallRoutingSettings?.sourceLanguageErrorText ?? '',
      sourceLanguageErrorMode: data?.getCallRoutingSettings?.sourceLanguageErrorMode ?? 'text',
      sourceLanguageErrorFile: data?.getCallRoutingSettings?.sourceLanguageErrorFile
        ? data?.getCallRoutingSettings?.sourceLanguageErrorFile
        : null,
      askTargetLanguage: data?.getCallRoutingSettings?.askTargetLanguage ?? false,
      targetLanguagePromptText: data?.getCallRoutingSettings?.targetLanguagePromptText ?? '',
      targetLanguagePromptMode: data?.getCallRoutingSettings?.targetLanguagePromptMode ?? 'text',
      targetLanguagePromptFile: data?.getCallRoutingSettings?.targetLanguagePromptFile
        ? data?.getCallRoutingSettings?.targetLanguagePromptFile
        : null,
      targetLanguageErrorText: data?.getCallRoutingSettings?.targetLanguageErrorText ?? '',
      targetLanguageErrorMode: data?.getCallRoutingSettings?.targetLanguageErrorMode ?? 'text',
      targetLanguageErrorFile: data?.getCallRoutingSettings?.targetLanguageErrorFile
        ? data?.getCallRoutingSettings?.targetLanguageErrorFile
        : null,
      interpreterCallType: data?.getCallRoutingSettings?.interpreterCallType ?? 'sequential',
      enableFallback: data?.getCallRoutingSettings?.enableFallback ?? false,
      fallbackType: data?.getCallRoutingSettings?.fallbackType ?? null,
      fallbackNumber: data?.getCallRoutingSettings?.fallbackNumber ?? '',
      fallbackMessage: data?.getCallRoutingSettings?.fallbackMessage ?? '',
      retryAttempts: data?.getCallRoutingSettings?.retryAttempts ?? 0,
      creditErrorText: data?.getCallRoutingSettings?.creditErrorText ?? '',
      creditErrorMode: data?.getCallRoutingSettings?.creditErrorMode ?? 'text',
      creditErrorFile: data?.getCallRoutingSettings?.creditErrorFile
        ? data?.getCallRoutingSettings?.creditErrorFile
        : null,
      noAnswerMessageText: data?.getCallRoutingSettings?.noAnswerMessageText ?? '',
      noAnswerMessageMode: data?.getCallRoutingSettings?.noAnswerMessageMode ?? 'text',
      noAnswerMessageFile: data?.getCallRoutingSettings?.noAnswerMessageFile
        ? data?.getCallRoutingSettings?.noAnswerMessageFile
        : null,
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
        language: formData.language,
        enable_code: formData.enableCode,
        askSourceLanguage: formData.askSourceLanguage,
        askTargetLanguage: formData.askTargetLanguage,
        interpreterCallType: formData.interpreterCallType,
        enableFallback: formData.enableFallback,
        fallbackType: formData.fallbackType,
        fallbackNumber: formData.fallbackNumber,
        fallbackMessage: formData.fallbackMessage,
        retryAttempts: formData.retryAttempts,
        digitsTimeOut: formData.digitsTimeOut,
        phone_number: phone,
      };

      // Handle text/audio for each field based on mode
      const messageFields = [
        'welcomeMessage',
        'callingCodePrompt',
        'callingCodeError',
        'sourceLanguagePrompt',
        'sourceLanguageError',
        'targetLanguagePrompt',
        'targetLanguageError',
        'creditError',
        'noAnswerMessage',
      ];

      messageFields.forEach((field) => {
        const mode = formData[`${field}Mode`];

        if (mode === 'text') {
          // If mode is text, send text value and null for file
          payload[`${field}Text`] = formData[`${field}Text`] || '';
          payload[`${field}File`] = null;
        } else if (mode === 'audio') {
          // If mode is audio, send file and null for text
          payload[`${field}Text`] = null;
          payload[`${field}File`] = formData[`${field}File`] || null;
        }
        // Also include the mode in the payload
        payload[`${field}Mode`] = mode;
      });

      console.log('Payload being sent:', payload);

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
  if (loading)
    return (
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <Skeleton width="100%" height={300} />
      </Container>
    );
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

                <TextOrAudioInput
                  control={control}
                  fieldName="welcomeMessage"
                  label="Welcome Message"
                  placeholder="Enter the welcome message that will be played to callers"
                  required
                  errors={errors}
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
                    <TextOrAudioInput
                      control={control}
                      fieldName="callingCodePrompt"
                      label="Voice Message for Code Prompt"
                      placeholder="Enter the voice message for code prompt"
                      required
                      errors={errors}
                    />
                    <TextOrAudioInput
                      control={control}
                      fieldName="callingCodeError"
                      label="Error Message for Code Prompt"
                      placeholder="Enter the error message for code prompt"
                      required
                      errors={errors}
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
                    <TextOrAudioInput
                      control={control}
                      fieldName="sourceLanguagePrompt"
                      label="Voice Message for Source Language"
                      placeholder="Enter the voice message for source language"
                      required
                      errors={errors}
                    />
                    <TextOrAudioInput
                      control={control}
                      fieldName="sourceLanguageError"
                      label="Error Message for Source Language"
                      placeholder="Enter the error message for source language"
                      required
                      errors={errors}
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
                    <TextOrAudioInput
                      control={control}
                      fieldName="targetLanguagePrompt"
                      label="Voice Message for Target Language"
                      placeholder="Enter the voice message for target language"
                      required
                      errors={errors}
                    />
                    <TextOrAudioInput
                      control={control}
                      fieldName="targetLanguageError"
                      label="Error Message for Target Language"
                      placeholder="Enter the error message for target language"
                      required
                      errors={errors}
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
                      error={!!errors.digitsTimeOut}
                      helperText={errors.digitsTimeOut?.message}
                      placeholder="Enter timeout in seconds"
                    />
                  )}
                />
              </Stack>

              {/* Section 4: Error Messages */}
              <Stack direction="column" pt={3} spacing={2}>
                <TextOrAudioInput
                  control={control}
                  fieldName="creditError"
                  label="Low Credit Error Message"
                  placeholder="Enter the low credit error message"
                  required
                  errors={errors}
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

                <TextOrAudioInput
                  control={control}
                  fieldName="noAnswerMessage"
                  label="No Answer Message"
                  placeholder="Enter the no answer message"
                  required
                  errors={errors}
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

// Component for text/audio toggle input using react-hook-form
const TextOrAudioInput = ({ control, fieldName, label, placeholder, required = false, errors }) => (
  <Stack spacing={2}>
    <FormControl>
      <FormLabel>
        {label} {required && '*'}
      </FormLabel>
      <Controller
        name={`${fieldName}Mode`}
        control={control}
        render={({ field }) => (
          <RadioGroup row {...field}>
            <FormControlLabel value="text" control={<Radio />} label="Text" />
            <FormControlLabel value="audio" control={<Radio />} label="Audio File" />
          </RadioGroup>
        )}
      />
    </FormControl>

    <Controller
      name={`${fieldName}Mode`}
      control={control}
      render={({ field: modeField }) => {
        if (modeField.value === 'text') {
          return (
            <Controller
              name={`${fieldName}Text`}
              control={control}
              render={({ field: textField }) => (
                <TextField
                  {...textField}
                  fullWidth
                  multiline
                  rows={3}
                  error={!!errors[`${fieldName}Text`]}
                  helperText={errors[`${fieldName}Text`]?.message}
                  placeholder={placeholder}
                />
              )}
            />
          );
        }

        return (
          <Controller
            name={`${fieldName}File`}
            control={control}
            render={({ field: fileField }) => (
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Iconify icon="eva:upload-fill" />}
                  fullWidth
                >
                  Upload Audio File
                  <input
                    accept="audio/*"
                    style={{ display: 'none' }}
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      console.log('Selected file:', file);
                      fileField.onChange(file);
                    }}
                  />
                </Button>
                {fileField.value && fileField.value.name && (
                  <Box mt={1}>
                    <Chip
                      label={fileField.value.name}
                      onDelete={() => fileField.onChange(null)}
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                )}

                {errors[`${fieldName}File`] && (
                  <Typography variant="caption" color="error">
                    {errors[`${fieldName}File`]?.message}
                  </Typography>
                )}
              </Box>
            )}
          />
        );
      }}
    />
  </Stack>
);
