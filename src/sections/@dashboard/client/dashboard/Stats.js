import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import Grid from '@mui/material/Grid';
import { Alert, Skeleton } from '@mui/material';
import { GET_GENERAL_CALL_STATISTICS } from '../../../../graphQL/queries';
import AnalyticsWidgetSummary from './AnalyticsWidgetSummary';

// eslint-disable-next-line react/prop-types
export default function Stats({ year, phoneNumberId }) {
  const { loading, error, data } = useQuery(GET_GENERAL_CALL_STATISTICS, {
    variables: { year, phoneNumberId },
  });

  if (loading) {
    return (
      <Grid
        container
        spacing={2}
        sx={{ borderRadius: 2, boxShadow: 0, p: 3, bgcolor: 'background.neutral' }}
      >
        {[...Array(5)].map((_, index) => (
          <Grid item xs={12} key={index}>
            <Skeleton variant="rectangular" height={100} />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return <Alert severity="error">Error loading statistics: {error.message}</Alert>;
  }

  const stats = data?.getGeneralCallStatistics || {};

  return (
    <Grid
      container
      sx={{
        borderRadius: 2,
        boxShadow: 0,
        p: 3,
        bgcolor: 'background.neutral',
      }}
    >
      <Grid item xs={12}>
        <AnalyticsWidgetSummary
          title="Calls done in last Month:"
          total={stats.callsLastMonth || 0}
        />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary
          title="Median Calls per Month:"
          total={stats.medianCallsPerMonth || 0}
        />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary title="Total Number of calls:" total={stats.totalCalls || 0} />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary
          title="Average Response Time:"
          total={stats.averageResponseTime || 0}
        />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary
          title="Average Duration of calls:"
          total={stats.averageCallDuration || 0}
        />
      </Grid>
    </Grid>
  );
}
