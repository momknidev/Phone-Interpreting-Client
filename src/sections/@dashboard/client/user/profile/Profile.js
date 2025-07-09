import PropTypes from 'prop-types';
// @mui
import { Grid, Typography, Card, CardContent, Avatar, Chip } from '@mui/material';
import { Stack } from '@mui/system';
//

// ----------------------------------------------------------------------

Profile.propTypes = {
  userData: PropTypes.object,
};

export default function Profile({ userData }) {
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
                <Avatar
                  src={userData.avatarUrl}
                  alt={userData.firstName}
                  sx={{ width: 64, height: 64, mb: 2 }}
                />
                <Typography variant="h6">
                  {userData.displayName || `${userData.firstName} ${userData.lastName}`}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Roles
            </Typography>
            <Typography>Role: {userData.role}</Typography>
            {/* <Typography >Department: {userData.department}</Typography> */}
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Contact Information
            </Typography>
            <Typography>Email: {userData.email}</Typography>
            <Typography>Phone: {userData.phone}</Typography>
          </Grid>

          {/* Third Column */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle1" gutterBottom>
              Customer Associations
            </Typography>
            {userData.customer.map((cust, index) => (
              <Chip key={index} label={cust} sx={{ mb: 1 }} />
            ))}
            {/* <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Created At: {new Date(Number(userData.createdAt)).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Updated At: {new Date(Number(userData.updatedAt)).toLocaleString()}
            </Typography> */}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
