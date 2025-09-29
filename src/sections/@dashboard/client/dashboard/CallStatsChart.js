import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@apollo/client';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Alert, Skeleton } from '@mui/material';
import Chart, { useChart } from '../../../../components/chart';
import { GET_CALL_STATISTICS } from '../../../../graphQL/queries';

export default function CallStatsChart({ year, phoneNumberId }) {
  const theme = useTheme();
  const { loading, error, data } = useQuery(GET_CALL_STATISTICS, {
    variables: { year, phoneNumberId },
  });

  const chartOptions = useChart({
    chart: {
      type: 'donut',
    },
    labels: ['Completed', 'Not Completed', 'In Progress'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
        },
      },
    },
    colors: [theme.palette.primary.main, theme.palette.error.main, theme.palette.warning.main],
  });

  if (loading) {
    return (
      <Card>
        <CardHeader title="Call Statistics" />
        <Skeleton variant="rectangular" height={330} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Call Statistics" />
        <Alert severity="error">Error loading statistics: {error.message}</Alert>
      </Card>
    );
  }

  const stats = data?.getCallStatistics || {};
  const series = [stats.completed || 0, stats.notCompleted || 0, stats.inProgress || 0];

  return (
    <Card>
      <CardHeader title="Call Statistics" />
      <Chart dir="ltr" type="donut" series={series} options={chartOptions} height={330} />
    </Card>
  );
}

CallStatsChart.propTypes = {
  year: PropTypes.string.isRequired,
  phoneNumberId: PropTypes.string.isRequired,
};
