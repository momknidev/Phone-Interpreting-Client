/* eslint-disable no-shadow */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useMemo, useState } from 'react';
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
import {
  ALL_GROUPS,
  ALL_SOURCE_LANGUAGES,
  ALL_TARGET_LANGUAGES,
} from '../../../../graphQL/queries';
import { PATH_DASHBOARD } from '../../../../routes/paths';
import Iconify from '../../../../components/iconify';
import { useSettingsContext } from '../../../../components/settings';

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
  const { phone } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { data, loading } = useQuery(ALL_GROUPS, {
    variables: {
      phone_number: phone,
    },
    fetchPolicy: 'no-cache',
  });
  const [editMediator] = useMutation(UPDATE_MEDIATOR);
  const [addMediator] = useMutation(ADD_MEDIATOR);
  const { data: languagesData, loading: languagesLoading } = useQuery(ALL_SOURCE_LANGUAGES, {
    variables: {
      phone_number: phone,
    },
    fetchPolicy: 'no-cache',
  });
  const { data: targetLanguage, loading: targetLanguagesLoading } = useQuery(ALL_TARGET_LANGUAGES, {
    variables: {
      phone_number: phone,
    },
    fetchPolicy: 'no-cache',
  });

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

  const NewUserSchema = Yup.object().shape({
    avatar_url: Yup.mixed().nullable(),
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string(),
    email: Yup.string().email('Email must be a valid email address').nullable(),
    phone: Yup.string().required('Phone number is required'),
    iban: Yup.string(),
    sourceLanguages: Yup.array().of(Yup.object()).min(1, 'Select at least one source language'),
    targetLanguages: Yup.array().of(Yup.object()).min(1, 'Select at least one target language'),
    availableOnHolidays: Yup.boolean(),
    availableForEmergencies: Yup.boolean(),
    group: Yup.array(),
    priority: Yup.number().nullable().required('Priority is required'),
  });

  const defaultValues = useMemo(
    () => ({
      avatar_url: currentMediator?.avatar_url || null,
      first_name: currentMediator?.first_name || '',
      last_name: currentMediator?.last_name || '',
      email: currentMediator?.email || '',
      phone: currentMediator?.phone || '',
      iban: currentMediator?.iban || '',
      group: currentMediator?.groups?.map((item) => item?.group) || [],
      sourceLanguages: currentMediator?.sourceLanguages?.map((item) => item?.sourceLanguage) || [],
      targetLanguages: currentMediator?.targetLanguages?.map((item) => item?.targetLanguage) || [],
      availableOnHolidays: currentMediator?.availableOnHolidays || false,
      availableForEmergencies: currentMediator?.availableForEmergencies || false,
      priority: currentMediator?.priority || 1,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // control,
    formState: { isSubmitting, errors },
  } = methods;
  const values = watch();
  console.log({ values, errors });

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
      let updatedRecord = null;
      if (isEdit) {
        updatedRecord = await editMediator({
          variables: {
            id: currentMediator.id,
            mediatorData: {
              first_name: data?.first_name,
              last_name: data?.last_name,
              email: data?.email,
              phone: data?.phone,
              iban: data?.iban,
              groupIDs: data?.group?.map((item) => item.id),
              priority: data?.priority,
              status: 'active',
              phone_number: phone,
              sourceLanguages: data?.sourceLanguages?.map((item) => item.id),
              targetLanguages: data?.targetLanguages?.map((item) => item.id),
              ...availabilityData,
              ...formattedTimeSlots,
            },
          },
        });
      } else {
        updatedRecord = await addMediator({
          variables: {
            mediatorData: {
              first_name: data?.first_name,
              last_name: data?.last_name,
              email: data?.email,
              phone_number: phone,
              phone: data?.phone,
              groupIDs: data?.group?.map((item) => item.id),
              iban: data?.iban,
              priority: data?.priority,
              sourceLanguages: data?.sourceLanguages?.map((item) => item.id),
              targetLanguages: data?.targetLanguages?.map((item) => item.id),
              ...availabilityData,

              ...formattedTimeSlots,
            },
          },
        });
      }
      reset();
      // eslint-disable-next-line no-unused-expressions
      isEdit
        ? navigate(PATH_DASHBOARD.interpreter.view(updatedRecord?.data?.updateMediator?.id))
        : navigate(PATH_DASHBOARD.interpreter.list);
      enqueueSnackbar(!isEdit ? 'Interpreter created!' : 'Interpreter updated!');
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
        setValue('avatar_url', newFile, { shouldValidate: true });
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
              <RHFTextField name="first_name" label="First Name" />
              <RHFTextField name="last_name" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phone" label="Phone Number" />
              <RHFTextField name="iban" label="IBAN" />
              <RHFAutocomplete
                name="group"
                label="Group"
                multiple
                options={data?.allGroups || []}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.group_name}
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
            <Box sx={{ py: 2 }}>
              <Typography variant="subtitle2">Languages</Typography>
            </Box>
            <Stack direction="column" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
              <RHFAutocomplete
                name="sourceLanguages"
                label="Source Language"
                options={languagesData?.allSourceLanguages || []}
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                getOptionLabel={(option) => option?.language_name || ''}
                loading={languagesLoading}
                ChipProps={{ size: 'small' }}
                multiple
                sx={{ minWidth: 300 }}
              />

              <RHFAutocomplete
                name="targetLanguages"
                label="Target Language"
                options={targetLanguage?.allTargetLanguages || []}
                multiple
                isOptionEqualToValue={(option, value) => option?.id === value?.id}
                getOptionLabel={(option) => option?.language_name || ''}
                loading={targetLanguagesLoading}
                ChipProps={{ size: 'small' }}
                sx={{ minWidth: 300 }}
              />
            </Stack>
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
