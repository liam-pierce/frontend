import { useTheme } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import 'chartjs-adapter-moment';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

type HistogramProps = {
  dataset: { [s: string]: number };
  datatype: string;
  title?: string;
  height?: string;
  isDate?: boolean;
  titleSize?: number;
};

const WrappedHistogram = ({ dataset, height, title, isDate, datatype, titleSize = 14 }: HistogramProps) => {
  const theme = useTheme();
  const [max, setMax] = useState(5);
  const [histData, setHistData] = useState(null);
  const options = {
    datasets: { line: { tension: 0.4, fill: 'origin' } },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      title: title
        ? {
            display: true,
            text: title,
            color: theme.palette.text.primary,
            font: { family: 'Roboto', size: titleSize, weight: '500' }
          }
        : null,
      legend: { display: false }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: true },
        ticks: {
          color: theme.palette.text.secondary
        },
        time: isDate ? { unit: 'day' as 'day' } : null,
        type: isDate ? ('time' as 'time') : ('linear' as 'linear')
      },
      y: {
        beginAtZero: true,
        suggestedMax: max,
        ticks: {
          color: theme.palette.text.secondary,
          precision: 0
        }
      }
    }
  };

  useEffect(() => {
    if (dataset) {
      setMax(Math.max(max, ...Object.values<number>(dataset)));
      setHistData({
        labels: Object.keys(dataset).map((key: string) => key.replace('T00:00:00.000Z', '')),
        datasets: [
          {
            label: datatype,
            data: Object.values(dataset),
            backgroundColor: theme.palette.primary.dark,
            borderColor: theme.palette.primary.light,
            borderWidth: 1,
            hoverBackgroundColor: theme.palette.primary.main
          }
        ]
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataset, theme]);

  return histData ? (
    <div style={{ height: height }}>
      <Line data={histData} options={options} />
    </div>
  ) : (
    <Skeleton variant="rect" height={height} />
  );
};

WrappedHistogram.defaultProps = {
  title: null,
  height: null,
  isDate: false
};

const Histogram = React.memo(WrappedHistogram);
export default Histogram;
