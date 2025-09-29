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
        <AnalyticsWidgetSummary title="Weekly Sales" total={714000} />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary title="Weekly Sales" total={1} />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary title="New Users" total={1352831} />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary title="Item Orders" total={1723315} />
      </Grid>
      <Grid item xs={12}>
        <AnalyticsWidgetSummary title="Bug Reports" total={234} />
      </Grid>
    </Grid>
  );
}
