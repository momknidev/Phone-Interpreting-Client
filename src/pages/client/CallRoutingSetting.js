import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Button,
  Card,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Skeleton,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQuery } from '@apollo/client';
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';

import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';
import { GET_CALL_ROUTING_SETTING } from '../../graphQL/queries';
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFUploadAvatar,
  RHFCheckbox,
} from '../../components/hook-form';
import { CREATE_UPDATED_ROUTING_SETTING } from '../../graphQL/mutations';

export default function CallRoutingSetting() {
  const { themeStretch, phone } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();

  const [updateRoutingSettings, { loading: saving }] = useMutation(CREATE_UPDATED_ROUTING_SETTING);

  const { data, loading, error } = useQuery(GET_CALL_ROUTING_SETTING, {
    variables: { phone_number: phone },
    fetchPolicy: 'no-cache',
  });

  const NewUserSchema = yup.object().shape({
    enableCode: yup.boolean(),
    callingCodePrompt: yup.string().when('enableCode', {
      is: true,
      then: (schema) => schema.required('Voice message is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    askSourceLanguage: yup.boolean(),
    sourceLanguagePrompt: yup.string().when('askSourceLanguage', {
      is: true,
      then: (schema) => schema.required('Source language message is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    askTargetLanguage: yup.boolean(),
    targetLanguagePrompt: yup.string().when('askTargetLanguage', {
      is: true,
      then: (schema) => schema.required('Target language message is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
    interpreterCallType: yup.string().oneOf(['simultaneous', 'sequential']).required(),
    enableFallback: yup.boolean(),

    fallbackNumber: yup.string(),
    retryAttempts: yup
      .number()
      .min(0, 'O or more ')
      .when('enableFallback', {
        is: true,
        then: (schema) => schema.required('Retry attempts required'),
        otherwise: (schema) => schema.notRequired(),
      }),
  });

  const defaultValues = useMemo(
    () => ({
      enableCode: data?.getCallRoutingSettings?.enable_code ?? false,
      callingCodePrompt: data?.getCallRoutingSettings?.callingCodePrompt ?? '',

      askSourceLanguage: data?.getCallRoutingSettings?.askSourceLanguage ?? false,
      sourceLanguagePrompt: data?.getCallRoutingSettings?.sourceLanguagePrompt ?? '',

      askTargetLanguage: data?.getCallRoutingSettings?.askTargetLanguage ?? false,
      targetLanguagePrompt: data?.getCallRoutingSettings?.targetLanguagePrompt ?? '',

      interpreterCallType: data?.getCallRoutingSettings?.interpreterCallType ?? 'sequential',

      enableFallback: data?.getCallRoutingSettings?.enableFallback ?? false,
      fallbackNumber: data?.getCallRoutingSettings?.fallbackNumber ?? '',
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
    control,
    formState: { errors },
  } = methods;

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

      delete payload.enableCode; // remove temporary form-specific field

      await updateRoutingSettings({
        variables: {
          input: payload,
        },
      });

      console.log('Settings saved successfully.');
      enqueueSnackbar('Settings saved successfully.', { variant: 'success' });
    } catch (err) {
      console.error('Failed to save settings:', err);
      enqueueSnackbar('Error in saving settings.', { variant: 'error' });
    }
  };

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
              )}
            </Card>

            {/* Section 2: Language Prompts */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6">Language Prompt Settings</Typography>

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
              )}
            </Card>

            {/* Section 3: Call Algorithm */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6">Call Algorithm Settings</Typography>
              <Controller
                name="interpreterCallType"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormLabel>Call Algorithm</FormLabel>
                    <RadioGroup row {...field}>
                      <FormControlLabel
                        value="simultaneous"
                        control={<Radio />}
                        label="Simultaneous"
                      />
                      <FormControlLabel value="sequential" control={<Radio />} label="Sequential" />
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </Card>

            {/* Section 4: Fallback */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6">Fallback Settings</Typography>

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
                <Stack spacing={2} mt={2}>
                  <Controller
                    name="fallbackNumber"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Fallback Number"
                        error={!!errors.fallbackNumber}
                        helperText={errors.fallbackNumber?.message}
                      />
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
              )}
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
