import React from 'react';
import Grid from '@mui/material/Grid';
import AnalyticsWidgetSummary from './AnalyticsWidgetSummary';

export default function Stats() {
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
        <AnalyticsWidgetSummary title="Calls done in last Month:" total={714000} />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary title="Median Calls per Month:" total={1} />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary title="Total Number of calls:" total={1352831} />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary title="Average Response Time:" total={1723315} />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary title="Average Duration of calls:" total={234} />
      </Grid>
    </Grid>
  );
}
