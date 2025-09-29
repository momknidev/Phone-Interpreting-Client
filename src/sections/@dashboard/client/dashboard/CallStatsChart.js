import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart, { useChart } from '../../../../components/chart';

export default function CallStatsChart() {
  const theme = useTheme();

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

  return (
    <Card>
      <CardHeader title="Call Statistics" />
      <Chart dir="ltr" type="donut" series={[1847, 247, 56]} options={chartOptions} height={330} />
    </Card>
  );
}
