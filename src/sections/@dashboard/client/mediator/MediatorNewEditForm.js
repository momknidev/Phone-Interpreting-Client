/* eslint-disable no-shadow */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { useSnackbar } from 'notistack';
import { useMutation, useQuery } from '@apollo/client';

import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  FormControlLabel,
  FormGroup,
  Slider,
} from '@mui/material';
// components
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFUploadAvatar,
  RHFCheckbox,
} from '../../../../components/hook-form';
import { ADD_MEDIATOR, UPDATE_MEDIATOR } from '../../../../graphQL/mutations';
import { ALL_LANGUAGES } from '../../../../graphQL/queries';
import { PATH_DASHBOARD } from '../../../../routes/paths';

// ----------------------------------------------------------------------

MediatorNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentMediator: PropTypes.object,
};

const marks = [
  {
    value: 1,
    label: 'Very High',
  },
  {
    value: 2,
    label: 'High',
  },
  {
    value: 3,
    label: 'Normal',
  },
  {
    value: 4,
    label: 'Low',
  },
  {
    value: 5,
    label: 'Very Low',
  },
];

export default function MediatorNewEditForm({ isEdit = false, currentMediator }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [editMediator] = useMutation(UPDATE_MEDIATOR);
  const [addMediator] = useMutation(ADD_MEDIATOR);
  const { data: languagesData, loading: languagesLoading } = useQuery(ALL_LANGUAGES);

  const [languageOptions, setLanguageOptions] = useState([]);
  const [languageMap, setLanguageMap] = useState({});

  useEffect(() => {
    if (languagesData && languagesData.allLanguages) {
      const options = languagesData.allLanguages.map((lang) => ({
        id: lang.id,
        name: lang.language_name,
      }));

      // Create a mapping of language IDs to objects for later use
      const mapping = {};
      languagesData.allLanguages.forEach((lang) => {
        mapping[lang.language_name] = {
          id: lang.id,
          name: lang.language_name,
        };
      });

      setLanguageOptions(options);
      setLanguageMap(mapping);
    }
  }, [languagesData]);

  const NewUserSchema = Yup.object().shape({
    avatarUrl: Yup.mixed().nullable(),
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string(),
    email: Yup.string().email('Email must be a valid email address').nullable(),
    phone: Yup.string().required('Phone number is required'),
    IBAN: Yup.string(),
    targetLanguage: Yup.array()
      .min(1, 'At least one Target Language is required')
      .max(4, 'Maximum 4 Target Languages')
      .of(Yup.object()),
    availableOnHolidays: Yup.boolean(),
    availableForEmergencies: Yup.boolean(),
    priority: Yup.number().nullable().required('Priority is required'),
  });

  const findLanguageObjectsByIds = (languageIds) => {
    if (!languageIds || !languageMap || Object.keys(languageMap).length === 0) return [];

    return languageIds
      .filter(Boolean)
      .map((id) => languageMap[id])
      .filter(Boolean);
  };

  const defaultValues = useMemo(
    () => ({
      avatarUrl: currentMediator?.avatarUrl || null,
      firstName: currentMediator?.firstName || '',
      lastName: currentMediator?.lastName || '',
      email: currentMediator?.email || '',
      phone: currentMediator?.phone || '',
      IBAN: currentMediator?.IBAN || '',
      targetLanguage: [],
      availableOnHolidays: currentMediator?.availableOnHolidays || false,
      availableForEmergencies: currentMediator?.availableForEmergencies || false,
      priority: currentMediator?.priority || 1,
    }),
    [currentMediator]
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

  useEffect(() => {
    if (isEdit && currentMediator && Object.keys(languageMap).length > 0) {
      // Get all language IDs from the mediator
      const languageIds = [
        currentMediator?.targetLanguage1,
        currentMediator?.targetLanguage2,
        currentMediator?.targetLanguage3,
        currentMediator?.targetLanguage4,
      ].filter(Boolean);

      // Find the language objects by their IDs
      const selectedLanguages = findLanguageObjectsByIds(languageIds);

      reset({
        ...defaultValues,
        targetLanguage: selectedLanguages,
      });
    }
    if (!isEdit && Object.keys(languageMap).length > 0) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentMediator, reset, defaultValues, languageMap]);

  const getLanguageIdsForMutation = () => {
    const languageObj = {};
    values?.targetLanguage?.forEach((lang, index) => {
      languageObj[`sourceLanguage${index + 1}`] = 'Italian';
      languageObj[`targetLanguage${index + 1}`] = lang.id;
    });
    return languageObj;
  };

  const onSubmit = async (data) => {
    try {
      const availabilityData = {
        availableOnHolidays: data.availableOnHolidays,
        availableForEmergencies: data.availableForEmergencies,
      };
      const languageData = getLanguageIdsForMutation();
      if (isEdit) {
        await editMediator({
          variables: {
            id: currentMediator.id,
            mediatorData: {
              firstName: data?.firstName,
              lastName: data?.lastName,
              email: data?.email,
              phone: data?.phone,
              IBAN: data?.IBAN,
              priority: data?.priority,
              status: 'active',
              ...availabilityData,
              ...languageData,
            },
          },
        });
      } else {
        await addMediator({
          variables: {
            mediatorData: {
              firstName: data?.firstName,
              lastName: data?.lastName,
              email: data?.email,
              phone: data?.phone,
              IBAN: data?.IBAN,
              priority: data?.priority,
              ...availabilityData,
              ...languageData,
            },
          },
        });
      }
      reset();
      navigate(PATH_DASHBOARD.mediator.list);
      enqueueSnackbar(!isEdit ? 'Mediator created!' : 'Mediator updated!');
    } catch (error) {
      enqueueSnackbar(error?.message, { variant: 'error' });
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
          <Card sx={{ p: 2 }}>
            <Box sx={{ mb: 1 }}>
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
                    Allowed *.jpeg, *.jpg, *.png, *.gif, maximum size of 3MB
                  </Typography>
                }
              />
            </Box>
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle2">Personal Information</Typography>
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFTextField name="firstName" label="First Name" />
              <RHFTextField name="lastName" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phone" label="Phone Number" />
              <RHFTextField name="IBAN" label="IBAN" />
            </Box>
            <Box
              sx={{
                py: 2,
              }}
            >
              <Typography variant="subtitle2">Professional Information</Typography>
            </Box>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="targetLanguage"
                label="Target Language"
                multiple
                options={languageOptions}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name}
                loading={languagesLoading}
                ChipProps={{ size: 'small' }}
              />
            </Box>

            <Box sx={{ py: 2 }}>
              <Box>
                <Typography variant="subtitle2">Emergencies and Holidays</Typography>
              </Box>

              <FormGroup
                sx={{
                  p: 2,
                }}
              >
                <FormControlLabel
                  control={<RHFCheckbox name="availableOnHolidays" />}
                  label="Available on Holidays"
                />
                <FormControlLabel
                  control={<RHFCheckbox name="availableForEmergencies" />}
                  label="Available for Emergencies"
                />
              </FormGroup>
            </Box>
            <Box
              sx={{
                py: 2,
              }}
            >
              <Typography variant="subtitle2">Priority (from 1 to 5):</Typography>
              <Box sx={{ display: 'flex', my: 1, ml: 4, width: 300 }}>
                <Slider
                  value={Number(values.priority)}
                  aria-label="Custom marks"
                  defaultValue={Number(values.priority)}
                  step={1}
                  min={1}
                  valueLabelDisplay="auto"
                  marks={marks}
                  max={5}
                  size="lg"
                  onChange={(event, newValue) => {
                    setValue('priority', newValue, { shouldValidate: true });
                  }}
                />
              </Box>
            </Box>
            <Stack alignItems="center" sx={{ mt: 3 }}>
              <LoadingButton size="large" type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
