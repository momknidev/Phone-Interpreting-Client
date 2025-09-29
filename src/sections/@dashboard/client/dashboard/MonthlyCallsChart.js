import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart, { useChart } from '../../../../components/chart';

const MonthlyCallsChart = () => {
  const theme = useTheme();

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

  return (
    <Card>
      <CardHeader title="Monthly Call Statistics" />
      <Chart
        dir="ltr"
        type="line"
        series={[
          {
            name: 'Total Calls',
            data: [150, 180, 200, 250, 300, 280, 320, 380, 400, 420, 380, 360],
          },
          {
            name: 'Completed',
            data: [120, 150, 180, 220, 280, 250, 300, 350, 380, 400, 350, 330],
          },
          {
            name: 'Not Completed',
            data: [30, 30, 20, 30, 20, 30, 20, 30, 20, 20, 30, 30],
          },
        ]}
        options={chartOptions}
        height={320}
      />
    </Card>
  );
};

export default MonthlyCallsChart;
