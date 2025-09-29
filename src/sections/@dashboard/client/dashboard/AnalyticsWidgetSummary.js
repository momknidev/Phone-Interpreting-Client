// @mui
import PropTypes from 'prop-types';
import { Stack, Typography } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

AnalyticsWidgetSummary.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
};

export default function AnalyticsWidgetSummary({ title, total }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-around"
      padding={2}
      borderBottom="1px solid"
      borderColor="divider"
      sx={{
        textAlign: 'center',
      }}
    >
      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {title}
      </Typography>
      <Typography variant="h6">{fShortenNumber(total)}</Typography>
    </Stack>
  );
}
