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
  Button,
  IconButton,
  TextField,
  Divider,
  Paper,
  List,
  ListItem,
} from '@mui/material';
// components
import FormProvider, {
  RHFAutocomplete,
  RHFTextField,
  RHFUploadAvatar,
  RHFCheckbox,
} from '../../../../components/hook-form';
import { ADD_MEDIATOR, UPDATE_MEDIATOR } from '../../../../graphQL/mutations';
import { ALL_GROUPS, ALL_LANGUAGES } from '../../../../graphQL/queries';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Iconify from '../../../../components/iconify';

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
  const { data, error, loading } = useQuery(ALL_GROUPS);
  const [editMediator] = useMutation(UPDATE_MEDIATOR);
  const [addMediator] = useMutation(ADD_MEDIATOR);
  const { data: languagesData, loading: languagesLoading } = useQuery(ALL_LANGUAGES);

  const [languageOptions, setLanguageOptions] = useState([]);
  const [languageMap, setLanguageMap] = useState({});

  // New state for custom time slots
  const [timeSlots, setTimeSlots] = useState({
    monday: parseTimeSlots(currentMediator?.monday_time_slots || ''),
    tuesday: parseTimeSlots(currentMediator?.tuesday_time_slots || ''),
    wednesday: parseTimeSlots(currentMediator?.wednesday_time_slots || ''),
    thursday: parseTimeSlots(currentMediator?.thursday_time_slots || ''),
    friday: parseTimeSlots(currentMediator?.friday_time_slots || ''),
    saturday: parseTimeSlots(currentMediator?.saturday_time_slots || ''),
    sunday: parseTimeSlots(currentMediator?.sunday_time_slots || ''),
  });
  // Function to parse time slots from the database format "HH:MM-HH:MM,HH:MM-HH:MM"
  function parseTimeSlots(slotsString) {
    if (!slotsString) return [];

    return slotsString.split(',').map((slot) => {
      const [start, end] = slot.split('-');
      return { start, end };
    });
  }

  // Function to convert time slots to database format
  function formatTimeSlotsForDB(slots) {
    if (!slots || slots.length === 0) return '';
    return slots.map((slot) => `${slot.start}-${slot.end}`).join(',');
  }

  // Function to check if a new time slot overlaps with existing ones
  function isTimeSlotOverlapping(day, newSlot) {
    if (!newSlot.start || !newSlot.end) return false;
    return timeSlots[day].some((existingSlot) => {
      // Skip the check if the slot is exactly the same (by value)
      if (existingSlot.start === newSlot.start && existingSlot.end === newSlot.end) {
        return false;
      }
      const newStart = convertTimeToMinutes(newSlot.start);
      const newEnd = convertTimeToMinutes(newSlot.end);
      const existingStart = convertTimeToMinutes(existingSlot.start);
      const existingEnd = convertTimeToMinutes(existingSlot.end);

      return (
        (newStart >= existingStart && newStart < existingEnd) ||
        (newEnd > existingStart && newEnd <= existingEnd) ||
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  }

  // Convert time (HH:MM) to minutes for comparison
  function convertTimeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Function to validate a time slot
  function isValidTimeSlot(start, end) {
    if (!start || !end) return false;

    const startMinutes = convertTimeToMinutes(start);
    const endMinutes = convertTimeToMinutes(end);
    return startMinutes < endMinutes;
  }

  // Function to add a new time slot for a specific day
  const addTimeSlot = (day) => {
    const newSlot = { start: '', end: '' };
    setTimeSlots({
      ...timeSlots,
      [day]: [...timeSlots[day], newSlot],
    });
  };

  // Function to update a time slot
  const updateTimeSlot = (day, index, field, value) => {
    const updatedSlots = [...timeSlots[day]];
    updatedSlots[index] = { ...updatedSlots[index], [field]: value };

    setTimeSlots({
      ...timeSlots,
      [day]: updatedSlots,
    });
  };

  // Function to remove a time slot
  const removeTimeSlot = (day, index) => {
    const updatedSlots = [...timeSlots[day]];
    updatedSlots.splice(index, 1);

    setTimeSlots({
      ...timeSlots,
      [day]: updatedSlots,
    });
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMapping = {
    Monday: 'monday',
    Tuesday: 'tuesday',
    Wednesday: 'wednesday',
    Thursday: 'thursday',
    Friday: 'friday',
    Saturday: 'saturday',
    Sunday: 'sunday',
  };

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

  useEffect(() => {
    if (data?.allGroups) {
      const groupIDs = currentMediator?.groupIDs || [];
      const groups = Array.isArray(data.allGroups) ? data.allGroups : [];
      const groupValue = groups.filter((group) => groupIDs.includes(group.id));
      setValue('group', groupValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
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
    group: Yup.array().required('Group is required').min(1, 'At least one group is required'),
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
      group: [],
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
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  // console.log({ values, errors });
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
        ...values,
        targetLanguage: selectedLanguages,
      });
    }

    if (!isEdit && Object.keys(languageMap).length > 0) {
      reset(values);
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
      // Format time slots for database
      const formattedTimeSlots = {
        monday_time_slots: formatTimeSlotsForDB(timeSlots.monday),
        tuesday_time_slots: formatTimeSlotsForDB(timeSlots.tuesday),
        wednesday_time_slots: formatTimeSlotsForDB(timeSlots.wednesday),
        thursday_time_slots: formatTimeSlotsForDB(timeSlots.thursday),
        friday_time_slots: formatTimeSlotsForDB(timeSlots.friday),
        saturday_time_slots: formatTimeSlotsForDB(timeSlots.saturday),
        sunday_time_slots: formatTimeSlotsForDB(timeSlots.sunday),
      };
      const availabilityData = {
        availableOnHolidays: data.availableOnHolidays,
        availableForEmergencies: data.availableForEmergencies,
      };
      const languageData = getLanguageIdsForMutation();
      let updatedRecord = null;
      if (isEdit) {
        updatedRecord = await editMediator({
          variables: {
            id: currentMediator.id,
            mediatorData: {
              firstName: data?.firstName,
              lastName: data?.lastName,
              email: data?.email,
              phone: data?.phone,
              IBAN: data?.IBAN,
              groupIDs: data?.group?.map((item) => item.id),
              priority: data?.priority,
              status: 'active',
              ...availabilityData,
              ...languageData,
              ...formattedTimeSlots,
            },
          },
        });
      } else {
        updatedRecord = await addMediator({
          variables: {
            mediatorData: {
              firstName: data?.firstName,
              lastName: data?.lastName,
              email: data?.email,
              phone: data?.phone,
              groupIDs: data?.group?.map((item) => item.id),
              IBAN: data?.IBAN,
              priority: data?.priority,
              ...availabilityData,
              ...languageData,
            },
          },
        });
      }
      reset();
      // eslint-disable-next-line no-unused-expressions
      isEdit
        ? navigate(PATH_DASHBOARD.mediator.view(updatedRecord?.data?.updateMediator?.id))
        : navigate(PATH_DASHBOARD.mediator.list);
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
              <RHFAutocomplete
                name="group"
                label="Group"
                multiple
                options={data?.allGroups || []}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.groupName}
                loading={loading}
                ChipProps={{ size: 'small' }}
                renderInput={(params) => <TextField {...params} label="Group" />}
              />
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
              <Typography variant="subtitle2">Availability</Typography>
              <Typography variant="caption" color="text.secondary">
                Add custom time slots for each day
              </Typography>
            </Box>

            {days.map((day) => (
              <Paper key={day} sx={{ p: 2, mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">{day}</Typography>
                  <Button
                    startIcon={<Iconify icon="ic:twotone-plus" />}
                    variant="outlined"
                    onClick={() => addTimeSlot(dayMapping[day])}
                  >
                    Add Time Slot
                  </Button>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {timeSlots[dayMapping[day]].length === 0 ? (
                  <Typography color="text.secondary">No time slots added</Typography>
                ) : (
                  <List dense>
                    {timeSlots[dayMapping[day]].map((slot, index) => (
                      <ListItem
                        key={index}
                        secondaryAction={
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => removeTimeSlot(dayMapping[day], index)}
                          >
                            <Iconify icon="mdi:trash-outline" />
                          </IconButton>
                        }
                      >
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{ width: '100%', alignItems: 'center' }}
                        >
                          <TextField
                            label="Start Time"
                            type="time"
                            value={slot.start}
                            onChange={(e) =>
                              updateTimeSlot(dayMapping[day], index, 'start', e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }} // 5 min steps
                            size="small"
                            sx={{ width: 150 }}
                            error={slot.start && slot.end && !isValidTimeSlot(slot.start, slot.end)}
                            helperText={
                              slot.start && slot.end && !isValidTimeSlot(slot.start, slot.end)
                                ? 'Start time must be before end time'
                                : ''
                            }
                          />
                          <Typography variant="body2">to</Typography>
                          <TextField
                            label="End Time"
                            type="time"
                            value={slot.end}
                            onChange={(e) =>
                              updateTimeSlot(dayMapping[day], index, 'end', e.target.value)
                            }
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ step: 300 }} // 5 min steps
                            size="small"
                            sx={{ width: 150 }}
                            error={slot.start && slot.end && !isValidTimeSlot(slot.start, slot.end)}
                          />
                          {isTimeSlotOverlapping(dayMapping[day], slot) && (
                            <Typography variant="caption" color="error">
                              This time slot overlaps with another slot
                            </Typography>
                          )}
                        </Stack>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            ))}

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
