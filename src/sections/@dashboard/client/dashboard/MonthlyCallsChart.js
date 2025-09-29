import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useQuery } from '@apollo/client';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { Alert, Skeleton } from '@mui/material';
import Chart, { useChart } from '../../../../components/chart';
import { GET_MONTHLY_CALL_STATISTICS } from '../../../../graphQL/queries';

const MonthlyCallsChart = ({ year, phoneNumberId }) => {
  const theme = useTheme();
  const { loading, error, data } = useQuery(GET_MONTHLY_CALL_STATISTICS, {
    variables: { year, phoneNumberId },
  });

  const chartOptions = useChart({
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    yaxis: {
      title: {
        text: 'Number of Calls',
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => `${value} calls`,
      },
    },
    colors: [theme.palette.primary.main, theme.palette.error.main, theme.palette.warning.main],
  });

  if (loading) {
    return (
      <Card>
        <CardHeader title="Monthly Call Statistics" />
        <Skeleton variant="rectangular" height={320} />
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader title="Monthly Call Statistics" />
        <Alert severity="error">Error loading statistics: {error.message}</Alert>
      </Card>
    );
  }

  const monthlyData = data?.getMonthlyCallStatistics || [];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Initialize data arrays with zeros
  const totalCalls = new Array(12).fill(0);
  const completedCalls = new Array(12).fill(0);
  const notCompletedCalls = new Array(12).fill(0);

  // Fill in the actual data
  monthlyData.forEach((monthData) => {
    const monthIndex = months.indexOf(monthData.month);
    if (monthIndex !== -1) {
      totalCalls[monthIndex] = monthData.totalCalls;
      completedCalls[monthIndex] = monthData.completed;
      notCompletedCalls[monthIndex] = monthData.notCompleted;
    }
  });

  const series = [
    {
      name: 'Total Calls',
      data: totalCalls,
    },
    {
      name: 'Completed',
      data: completedCalls,
    },
    {
      name: 'Not Completed',
      data: notCompletedCalls,
    },
  ];

  return (
    <Card>
      <CardHeader title="Monthly Call Statistics" />
      <Chart dir="ltr" type="line" series={series} options={chartOptions} height={320} />
    </Card>
  );
};

MonthlyCallsChart.propTypes = {
  year: PropTypes.string.isRequired,
  phoneNumberId: PropTypes.string.isRequired,
};

export default MonthlyCallsChart;
