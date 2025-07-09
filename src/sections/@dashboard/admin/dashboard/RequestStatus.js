import PropTypes from 'prop-types';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Card, CardHeader, Skeleton } from '@mui/material';
import { useQuery } from '@apollo/client';

// utils
import { fNumber } from '../../../../utils/formatNumber';
// components
import Chart, { useChart } from '../../../../components/chart';
import { GET_REQUEST_STATUS_BY_CLIENT } from '../../../../graphQL/queries';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 400;

const LEGEND_HEIGHT = 72;

const StyledChart = styled('div')(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  '& .apexcharts-canvas svg': {
    height: CHART_HEIGHT,
  },
  '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
    overflow: 'visible',
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    alignContent: 'center',
    position: 'relative !important',
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

RequestStatus.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function RequestStatus({ title, subheader, ...other }) {
  const { data, loading, error } = useQuery(GET_REQUEST_STATUS_BY_CLIENT, {
    variables: {
      year: '2025',
    },
  });

  const theme = useTheme();

  const chart = {
    colors: [
      theme.palette.primary.main,
      theme.palette.info.main,
      theme.palette.error.main,
      theme.palette.warning.main,
    ],
    series: data?.getRequestStatusByClient?.status,
  };
  console.log(chart);
  const { colors, series, options } = chart;

  const chartSeries = series?.map((i) => i.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series?.map((i) => i.label),
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: 'center' },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (value) => fNumber(value),
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    ...options,
  });
  if (error) {
    return `Error: ${error?.message}`;
  }
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {loading && !data && <Skeleton width="100" height={400} />}
      {data && !loading && (
        <StyledChart dir="ltr">
          <Chart type="donut" series={chartSeries} options={chartOptions} height={280} />
        </StyledChart>
      )}
    </Card>
  );
}
