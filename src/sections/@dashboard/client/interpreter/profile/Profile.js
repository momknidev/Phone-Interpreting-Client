import PropTypes from 'prop-types';
// @mui
import { Grid, Typography, Card, CardContent, Avatar, Divider, Chip } from '@mui/material';
import { Stack } from '@mui/system';

Profile.propTypes = {
  mediatorData: PropTypes.object,
};

export default function Profile({ mediatorData }) {
  const {
    first_name,
    last_name,
    email,
    phone,
    iban,
    sourceLanguages,
    targetLanguages,
    groups,
    monday_time_slots,
    tuesday_time_slots,
    wednesday_time_slots,
    thursday_time_slots,
    friday_time_slots,
    saturday_time_slots,
    sunday_time_slots,
  } = mediatorData || {};

  const timeSlots = {
    Monday: monday_time_slots,
    Tuesday: tuesday_time_slots,
    Wednesday: wednesday_time_slots,
    Thursday: thursday_time_slots,
    Friday: friday_time_slots,
    Saturday: saturday_time_slots,
    Sunday: sunday_time_slots,
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={4}>
          {/* Header */}
          <Grid item xs={12}>
            <Stack alignItems="center" spacing={2}>
              <Avatar alt={`${first_name} ${last_name}`} sx={{ width: 64, height: 64 }} />
              <Typography variant="h5">{`${first_name} ${last_name}`}</Typography>
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Divider>
              <Chip label="Personal Info" />
            </Divider>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Typography>Email: {email || 'N/A'}</Typography>
            <Typography>Phone: {phone || 'N/A'}</Typography>
            <Typography>IBAN: {iban || 'N/A'}</Typography>
          </Grid>

          {/* Language Info */}
          <Grid item xs={12} md={4}>
            <Typography>Language Combination</Typography>
            <Typography>
              {sourceLanguages?.map((item) => item?.sourceLanguage?.language_name)?.join(',')}
              {targetLanguages?.length > 0 && <>&hArr;</>}
              {targetLanguages?.map((item) => item?.targetLanguage?.language_name)?.join(',')}
            </Typography>
          </Grid>

          {/* Groups */}
          <Grid item xs={12} md={4}>
            <Typography sx={{ mb: 1 }}>Groups</Typography>
            <Typography>
              {groups?.map((item) => item?.group?.group_name)?.join(', ') || 'No Groups'}
            </Typography>
          </Grid>

          {/* Availability */}
          <Grid item xs={12}>
            <Divider sx={{ mt: 2 }}>
              <Chip label="Weekly Availability" />
            </Divider>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {Object.entries(timeSlots).map(([day, slot]) => (
                <Grid key={day} item xs={6} md={3}>
                  <Typography variant="body2" fontWeight="bold">
                    {day}:
                  </Typography>
                  <Typography variant="body2">{slot || 'Not available'}</Typography>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
