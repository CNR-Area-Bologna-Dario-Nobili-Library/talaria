import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

import './style.scss';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, Title);

import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ChartDataLabels);

import { COLORS } from './config';

const LineComponent = ({
  title,
  subtitle,
  labels,
  data,
  tooltipLabelFormatter,
}) => {
  const chartData = {
    labels,
    datasets: data.map((dataset, idx) => ({
      label: dataset.label || `Dataset ${idx}`,
      data: dataset.data,
      fill: false,
      tension: 0.4,
      borderColor: COLORS[idx % COLORS.length],
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 20,
        },
      },
      subtitle: {
        display: true,
        text: subtitle,
        font: {
          size: 16,
        },
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: tooltipLabelFormatter
            ? tooltipLabelFormatter
            : function(context) {
                return `${context.label}: ${context.raw.toFixed(2)}`;
              },
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: value => value.toFixed(2),
        font: {
          weight: 'bold',
          size: 12,
        },
        color: 'black',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineComponent;
