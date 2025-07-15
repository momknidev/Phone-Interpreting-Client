import PropTypes from 'prop-types';
// @mui
import { Grid, Typography, Card, CardContent, Avatar } from '@mui/material';
import { Stack } from '@mui/system';
//

// ----------------------------------------------------------------------

Profile.propTypes = {
  mediatorData: PropTypes.object,
};

export default function Profile({ mediatorData }) {
  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Stack
              alignContent="center"
              justifyContent="center"
              direction="row"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Stack
                direction="column"
                alignItems="center"
                spacing={2}
                sx={{ mb: 2, maxWidth: 300 }}
              >
                <Avatar alt={mediatorData?.firstName} sx={{ width: 64, height: 64, mb: 2 }} />
                <Typography variant="h6">
                  {`${mediatorData?.firstName} ${mediatorData?.lastName}`}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Contact Information
            </Typography>
            <Typography>Email: {mediatorData?.email}</Typography>
            <Typography>Phone: {mediatorData?.phone}</Typography>
          </Grid>

          {/* Third Column */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Languages
            </Typography>
            {`Italian <> ${[
              mediatorData?.targetLanguage1,
              mediatorData?.targetLanguage2,
              mediatorData?.targetLanguage3,
              mediatorData?.targetLanguage4,
            ]
              .filter((lang) => lang != null && lang !== undefined)
              .join(', ')}`}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
