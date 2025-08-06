/* eslint-disable no-shadow */
import { useEffect } from 'react';
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
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useForm, Controller, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';
import { PATH_DASHBOARD } from '../../routes/paths';

// ----------------------
// ✅ Schema definition
// ----------------------
const schema = yup.object().shape({
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
  callAlgorithm: yup.string().oneOf(['simultaneous', 'sequential']).required(),
  enableFallback: yup.boolean(),
  fallbackType: yup.string().when('enableFallback', {
    is: true,
    then: (schema) => schema.oneOf(['recall', 'fixed_number']).required(),
    otherwise: (schema) => schema.notRequired(),
  }),
  fallbackNumber: yup.string().when(['enableFallback', 'fallbackType'], {
    is: (enabled, type) => enabled && type === 'fixed_number',
    then: (schema) => schema.required('Fallback number required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  retryAttempts: yup
    .number()
    .min(1, 'At least 1 attempt')
    .when('enableFallback', {
      is: true,
      then: (schema) => schema.required('Retry attempts required'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export default function CallRoutingSetting() {
  const { themeStretch } = useSettingsContext();

  // const { id } = useParams();
  // console.log({ id });
  // const { data, loading, error } = useQuery(MEDIATOR_BY_ID, {
  //   variables: { id },
  //   fetchPolicy: 'no-cache',
  // });

  // if (error) {
  //   return `Error: ${error?.message}`;
  // }
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      enableCode: false,
      callingCodePrompt: '',
      askSourceLanguage: false,
      sourceLanguagePrompt: '',
      askTargetLanguage: false,
      targetLanguagePrompt: '',
      callAlgorithm: 'sequential',
      enableFallback: false,
      fallbackType: 'recall',
      fallbackNumber: '',
      retryAttempts: 1,
    },
    resolver: yupResolver(schema),
  });

  // Watch for conditional rendering
  const enableCode = useWatch({ control, name: 'enableCode' });
  const askSourceLanguage = useWatch({ control, name: 'askSourceLanguage' });
  const askTargetLanguage = useWatch({ control, name: 'askTargetLanguage' });
  const enableFallback = useWatch({ control, name: 'enableFallback' });
  const fallbackType = useWatch({ control, name: 'fallbackType' });

  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

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
            // { name: 'Interpreters', href: PATH_DASHBOARD.interpreter.list },
            { name: 'Call Routing Settings' },
          ]}
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={4}>
            {/* Section 1 */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Code Prompt Settings
              </Typography>
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
                      label="Voice Message for Code Prompt"
                      fullWidth
                      multiline
                      error={!!errors.callingCodePrompt}
                      helperText={errors.callingCodePrompt?.message}
                      sx={{ mt: 2 }}
                    />
                  )}
                />
              )}
            </Card>

            {/* Section 2 */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Language Prompt Settings
              </Typography>

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
                      label="Voice Message for Source Language"
                      fullWidth
                      multiline
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
                      label="Voice Message for Target Language"
                      fullWidth
                      multiline
                      error={!!errors.targetLanguagePrompt}
                      helperText={errors.targetLanguagePrompt?.message}
                      sx={{ mt: 2 }}
                    />
                  )}
                />
              )}
            </Card>

            {/* Section 3 */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Call Algorithm Settings
              </Typography>
              <Controller
                name="callAlgorithm"
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

            {/* Section 4 */}
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Fallback Settings
              </Typography>

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
                    name="fallbackType"
                    control={control}
                    render={({ field }) => (
                      <FormControl>
                        <FormLabel>Fallback Type</FormLabel>
                        <RadioGroup row {...field}>
                          <FormControlLabel value="recall" control={<Radio />} label="Recall" />
                          <FormControlLabel
                            value="fixed_number"
                            control={<Radio />}
                            label="Fixed Number"
                          />
                        </RadioGroup>
                      </FormControl>
                    )}
                  />

                  {fallbackType === 'fixed_number' && (
                    <Controller
                      name="fallbackNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Fallback Number"
                          fullWidth
                          error={!!errors.fallbackNumber}
                          helperText={errors.fallbackNumber?.message}
                        />
                      )}
                    />
                  )}

                  <Controller
                    name="retryAttempts"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Retry Attempts"
                        type="number"
                        fullWidth
                        error={!!errors.retryAttempts}
                        helperText={errors.retryAttempts?.message}
                      />
                    )}
                  />
                </Stack>
              )}
            </Card>

            {/* Submit */}
            <Button type="submit" variant="contained" size="large">
              Save Settings
            </Button>
          </Stack>
        </form>
      </Container>
    </>
  );
}
